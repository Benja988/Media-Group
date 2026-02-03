import mongoose, { Types } from 'mongoose';
import { Tag, Category, Station, Channel, Content } from '@/lib/models';
import { generateSlug } from '@/utils/helpers';
import { 
  ContentCreateDto, 
  ContentListResponse, 
  ContentMetrics, 
  ContentQueryDto, 
  ContentResponse, 
  ContentStats, 
  ContentUpdateDto 
} from '@/types/content.types';
import { AppError } from '@/utils/errors';
import { engagementService } from './engagement.service';
import { InMemoryCache } from '@/config/cache';

const CACHE_TTL = 3600; 
const POPULAR_CACHE_TTL = 1800;
const CACHE_PREFIX = 'content:';
const LIST_CACHE_PREFIX = 'content_list:';

interface AggregationResult {
  _id: string;
  count: number;
}

interface ByTypeResult extends AggregationResult {
  _id: 'news' | 'podcast' | 'video' | 'show';
}

const cache = new InMemoryCache();

export class ContentService {
  /**
   * Create new content
   */
  async createContent(data: ContentCreateDto): Promise<ContentResponse> {
    try {
      // Generate slug if not provided
      const slug = data.slug || generateSlug(data.title);
      
      // Check uniqueness of slug per station
      const existingContent = await Content.findOne({
        slug,
        stationId: data.stationId || null
      });

      if (existingContent) {
        throw new AppError('Content with this slug already exists', 400);
      }

      // Validate relationships exist
      await this.validateRelationships(data);

      // Set publishedAt if status is published
      if (data.status === 'published' && !data.publishedAt) {
        data.publishedAt = new Date();
      }

      const content = await Content.create({
        ...data,
        slug,
        metrics: {
          views: 0,
          likes: 0
        }
      });

      // Invalidate relevant caches
      await this.invalidateContentCaches(content);

      return await this.enrichContentResponse(content);
    } catch (error: unknown) {
      if (error instanceof AppError) throw error;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new AppError('Failed to create content', 500, errorMessage);
    }
  }

  /**
   * Get content by ID with caching
   */
  async getContentById(
    id: string, 
    includeEngagement: boolean = false,
    incrementView: boolean = true
  ): Promise<ContentResponse> {
    try {
      const cacheKey = `${CACHE_PREFIX}${id}`;
      
      // Try cache first
      const cachedContent = cache.get(cacheKey);
      if (cachedContent) {
        const content = cachedContent;
        
        // Increment view async if needed
        if (incrementView) {
          this.incrementViewCount(id);
        }
        
        if (includeEngagement) {
          return await this.enrichWithEngagement(content, id);
        }
        return content;
      }

      // Fetch from database
      const content = await Content.findById(id);
      if (!content) {
        throw new AppError('Content not found', 404);
      }

      // Increment view async if needed
      if (incrementView) {
        this.incrementViewCount(id);
      }

      const enrichedContent = await this.enrichContentResponse(content);
      
      // Cache the result
      cache.set(cacheKey, enrichedContent, CACHE_TTL);

      if (includeEngagement) {
        return await this.enrichWithEngagement(enrichedContent, id);
      }

      return enrichedContent;
    } catch (error: unknown) {
      if (error instanceof AppError) throw error;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new AppError('Failed to fetch content', 500, errorMessage);
    }
  }

  /**
   * Get content by slug
   */
  async getContentBySlug(
    slug: string, 
    stationId?: string,
    includeEngagement: boolean = false
  ): Promise<ContentResponse> {
    try {
      const cacheKey = `${CACHE_PREFIX}slug:${slug}:station:${stationId || 'global'}`;
      
      const cachedContent = cache.get(cacheKey);
      if (cachedContent) {
        const content = cachedContent;
        
        // Increment view async
        this.incrementViewCount(content._id);
        
        if (includeEngagement) {
          return await this.enrichWithEngagement(content, content._id);
        }
        return content;
      }

      const query: any = { slug, stationId: stationId || null };
      const content = await Content.findOne(query);
      
      if (!content) {
        throw new AppError('Content not found', 404);
      }

      // Increment view async
      this.incrementViewCount(content._id);

      const enrichedContent = await this.enrichContentResponse(content);
      
      // Cache the result
      cache.set(cacheKey, enrichedContent, CACHE_TTL);

      if (includeEngagement) {
        return await this.enrichWithEngagement(enrichedContent, content._id);
      }

      return enrichedContent;
    } catch (error: unknown) {
      if (error instanceof AppError) throw error;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new AppError('Failed to fetch content', 500, errorMessage);
    }
  }

  /**
   * Get content list with filtering, pagination, and caching
   */
  async getContentList(query: ContentQueryDto): Promise<ContentListResponse> {
    try {
      const cacheKey = this.generateListCacheKey(query);
      
      // Try cache first
      const cachedResult = cache.get(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      const {
        type,
        status,
        stationId,
        channelId,
        authorId,
        categoryId,
        tagId,
        search,
        sortBy = 'publishedAt',
        sortOrder = 'desc',
        page = 1,
        limit = 20,
        includeDrafts = false
      } = query;

      const filter: any = {};

      // Apply filters
      if (type) filter.type = type;
      if (stationId) filter.stationId = new Types.ObjectId(stationId);
      if (channelId) filter.channelId = new Types.ObjectId(channelId);
      if (authorId) filter.authorId = new Types.ObjectId(authorId);
      if (categoryId) filter.categoryIds = new Types.ObjectId(categoryId);
      if (tagId) filter.tagIds = new Types.ObjectId(tagId);

      // Status filter with special handling for drafts
      if (status) {
        filter.status = status;
      } else if (!includeDrafts) {
        filter.status = { $ne: 'draft' };
      }

      // Search filter
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      // Published/scheduled logic
      if (!includeDrafts) {
        filter.$or = [
          { status: 'published' },
          { 
            status: 'scheduled',
            scheduledFor: { $lte: new Date() }
          }
        ];
      }

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Build sort
      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Execute query with total count
      const [content, total] = await Promise.all([
        Content.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        Content.countDocuments(filter)
      ]);

      // Enrich content with relationships
      const enrichedContent = await Promise.all(
        content.map((item: any) => this.enrichContentResponse(item))
      );

      const result: ContentListResponse = {
        data: enrichedContent,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        },
        filters: {
          type,
          status,
          stationId,
          search
        }
      };

      // Cache the result with shorter TTL for dynamic lists
      cache.set(cacheKey, result, 300);

      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new AppError('Failed to fetch content list', 500, errorMessage);
    }
  }

  /**
   * Update content
   */
  async updateContent(id: string, data: ContentUpdateDto): Promise<ContentResponse> {
    try {
      const content = await Content.findById(id);
      if (!content) {
        throw new AppError('Content not found', 404);
      }

      // Validate relationships exist if being updated
      const validationData: Partial<ContentCreateDto> = {};
      
      if (data.categoryIds || data.tagIds) {
        validationData.categoryIds = data.categoryIds || content.categoryIds;
        validationData.tagIds = data.tagIds || content.tagIds;
        
        // If stationId or channelId are being updated, include them
        if (data.stationId !== undefined) {
          validationData.stationId = data.stationId;
        } else if (content.stationId) {
          validationData.stationId = content.stationId.toString();
        }
        
        if (data.channelId !== undefined) {
          validationData.channelId = data.channelId;
        } else if (content.channelId) {
          validationData.channelId = content.channelId.toString();
        }
        
        await this.validateRelationships(validationData as ContentCreateDto);
      }

      // Handle status changes
      if (data.status && data.status !== content.status) {
        if (data.status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date();
        }
      }

      // Update content
      Object.assign(content, data);
      await content.save();

      // Invalidate caches
      await this.invalidateContentCaches(content);

      return await this.enrichContentResponse(content);
    } catch (error: unknown) {
      if (error instanceof AppError) throw error;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new AppError('Failed to update content', 500, errorMessage);
    }
  }

  /**
   * Delete content
   */
  async deleteContent(id: string): Promise<void> {
    try {
      const content = await Content.findById(id);
      if (!content) {
        throw new AppError('Content not found', 404);
      }

      // Store cache keys for invalidation
      const cacheKeys = [
        `${CACHE_PREFIX}${id}`,
        `${CACHE_PREFIX}slug:${content.slug}:station:${content.stationId || 'global'}`
      ];

      // Delete content
      await content.deleteOne();

      // Invalidate caches
      await Promise.all([
        ...cacheKeys.map(key => cache.del(key)),
        this.invalidateListCaches(),
        cache.del(`content:stats:${content.type}`)
      ]);

      // Clean up engagements (optional, based on business logic)
      // await engagementService.deleteEngagementsByContentId(id);
    } catch (error: unknown) {
      if (error instanceof AppError) throw error;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new AppError('Failed to delete content', 500, errorMessage);
    }
  }

  /**
   * Get content metrics
   */
  async getContentMetrics(id: string): Promise<ContentMetrics> {
    try {
      const cacheKey = `content:metrics:${id}`;
      
      const cachedMetrics = cache.get(cacheKey);
      if (cachedMetrics) {
        return cachedMetrics;
      }

      const [content, engagementStats] = await Promise.all([
        Content.findById(id).select('metrics').lean(),
        engagementService.getContentEngagementStats(id)
      ]);

      if (!content) {
        throw new AppError('Content not found', 404);
      }

      // Access comments and shares safely
      const comments = engagementStats.aggregated?.['comment']?.count || 0;
      const shares = engagementStats.aggregated?.['share']?.count || 0;

      const metrics: ContentMetrics = {
        views: content.metrics?.views || 0,
        likes: content.metrics?.likes || 0,
        comments,
        shares,
        engagementRate: this.calculateEngagementRate(content.metrics, { comments, shares })
      };

      // Cache with shorter TTL for frequently changing data
      cache.set(cacheKey, metrics, 300);

      return metrics;
    } catch (error: unknown) {
      if (error instanceof AppError) throw error;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new AppError('Failed to fetch content metrics', 500, errorMessage);
    }
  }

  /**
   * Get content statistics
   */
  async getContentStats(type?: string): Promise<ContentStats> {
    try {
      const cacheKey = `content:stats:${type || 'all'}`;
      
      const cachedStats = cache.get(cacheKey);
      if (cachedStats) {
        return cachedStats;
      }

      const filter = type ? { type } : {};

      const [
        total,
        published,
        scheduled,
        drafts,
        byType,
        recentActivity
      ] = await Promise.all([
        Content.countDocuments(filter),
        Content.countDocuments({ ...filter, status: 'published' }),
        Content.countDocuments({ ...filter, status: 'scheduled' }),
        Content.countDocuments({ ...filter, status: 'draft' }),
        Content.aggregate<ByTypeResult>([
          { $match: filter },
          { $group: { _id: '$type', count: { $sum: 1 } } }
        ]),
        Content.aggregate([
          { $match: filter },
          { $sort: { updatedAt: -1 } },
          { $limit: 10 },
          { $project: { _id: 1, title: 1, type: 1, status: 1, updatedAt: 1 } }
        ])
      ]);

      const stats: ContentStats = {
        total,
        published,
        scheduled,
        drafts,
        byType: byType.reduce((acc: Record<string, number>, curr: ByTypeResult) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        recentActivity,
        updatedAt: new Date()
      };

      // Cache stats for 5 minutes
      cache.set(cacheKey, stats, 300);

      return stats;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new AppError('Failed to fetch content statistics', 500, errorMessage);
    }
  }

  /**
   * Get popular content
   */
  async getPopularContent(
    type?: string,
    limit: number = 10,
    timeframe: 'day' | 'week' | 'month' = 'week'
  ): Promise<ContentResponse[]> {
    try {
      const cacheKey = `content:popular:${type || 'all'}:${timeframe}:${limit}`;
      
      const cachedContent = cache.get(cacheKey);
      if (cachedContent) {
        return cachedContent;
      }

      const dateFilter = this.getDateFilter(timeframe);

      const popularContent = await Content.aggregate([
        {
          $match: {
            status: 'published',
            ...(type && { type }),
            ...(dateFilter && { publishedAt: dateFilter })
          }
        },
        {
          $addFields: {
            engagementScore: {
              $add: [
                { $multiply: ['$metrics.views', 0.1] },
                { $multiply: ['$metrics.likes', 1] }
              ]
            }
          }
        },
        { $sort: { engagementScore: -1 } },
        { $limit: limit }
      ]);

      const enrichedContent = await Promise.all(
        popularContent.map((item: any) => this.enrichContentResponse(item))
      );

      // Cache popular content
      cache.set(cacheKey, enrichedContent, POPULAR_CACHE_TTL);

      return enrichedContent;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new AppError('Failed to fetch popular content', 500, errorMessage);
    }
  }

  /**
   * Batch get content by IDs
   */
  async getContentBatch(ids: string[]): Promise<ContentResponse[]> {
    try {
      const cacheKeys = ids.map(id => `${CACHE_PREFIX}${id}`);
      const cachedResults = await cache.mget(cacheKeys);
      
      const resultMap = new Map<string, ContentResponse>();
      const idsToFetch: string[] = [];

      // Process cached results
      cachedResults.forEach((cached: string | null, index: number) => {
        if (cached) {
          const content = JSON.parse(cached);
          resultMap.set(ids[index], content);
        } else {
          idsToFetch.push(ids[index]);
        }
      });

      // Fetch missing content from database
      if (idsToFetch.length > 0) {
        const objectIds = idsToFetch.map(id => new Types.ObjectId(id));
        const contents = await Content.find({ _id: { $in: objectIds } }).lean();
        
        // Cache and store fetched content
        await Promise.all(
          contents.map(async (content: any) => {
            const enriched = await this.enrichContentResponse(content);
            resultMap.set(content._id.toString(), enriched);
            cache.set(
              `${CACHE_PREFIX}${content._id}`,
              enriched,
              CACHE_TTL
            );
          })
        );
      }

      // Return in original order
      return ids.map(id => resultMap.get(id)).filter(Boolean) as ContentResponse[];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new AppError('Failed to batch fetch content', 500, errorMessage);
    }
  }

  private async validateRelationships(data: ContentCreateDto): Promise<void> {
    const validationPromises: Promise<void>[] = [];

    if (data.stationId) {
      validationPromises.push(
        Station.findById(data.stationId).then((station) => {
          if (!station) throw new AppError('Station not found', 400);
        })
      );
    }

    if (data.channelId) {
      validationPromises.push(
        Channel.findById(data.channelId).then((channel) => {
          if (!channel) throw new AppError('Channel not found', 400);
        })
      );
    }

    // Fix: Add proper check for optional arrays
    if (data.categoryIds && data.categoryIds.length > 0) {
      validationPromises.push(
        Category.countDocuments({ _id: { $in: data.categoryIds } })
          .then((count: number) => {
            if (count !== data.categoryIds!.length) {
              throw new AppError('One or more categories not found', 400);
            }
          })
      );
    }

    // Fix: Add proper check for optional arrays
    if (data.tagIds && data.tagIds.length > 0) {
      validationPromises.push(
        Tag.countDocuments({ _id: { $in: data.tagIds } })
          .then((count: number) => {
            if (count !== data.tagIds!.length) {
              throw new AppError('One or more tags not found', 400);
            }
          })
      );
    }

    await Promise.all(validationPromises);
  }

  private async enrichContentResponse(content: any): Promise<ContentResponse> {
    const [categories, tags, station, channel, author] = await Promise.all([
      content.categoryIds?.length 
        ? Category.find({ _id: { $in: content.categoryIds } }).select('name slug').lean()
        : [],
      content.tagIds?.length
        ? Tag.find({ _id: { $in: content.tagIds } }).select('name slug').lean()
        : [],
      content.stationId 
        ? Station.findById(content.stationId).select('name slug').lean()
        : null,
      content.channelId
        ? Channel.findById(content.channelId).select('name slug').lean()
        : null,
      content.authorId
        ? mongoose.model('User').findById(content.authorId).select('name email').lean()
        : null
    ]);

    return {
      ...content,
      categories,
      tags,
      station,
      channel,
      author,
      _id: content._id.toString()
    };
  }

  private async enrichWithEngagement(content: ContentResponse, contentId: string): Promise<ContentResponse> {
    const engagement = await engagementService.getContentEngagement(contentId);
    return {
      ...content,
      engagement
    };
  }

  private async incrementViewCount(contentId: string): Promise<void> {
    try {
      // Increment in database
      await Content.findByIdAndUpdate(contentId, {
        $inc: { 'metrics.views': 1 }
      });

      // Update cache asynchronously
      const cacheKey = `${CACHE_PREFIX}${contentId}`;
      const cachedContent = cache.get(cacheKey);
      if (cachedContent) {
        const content = cachedContent;
        content.metrics.views += 1;
        cache.set(cacheKey, content, CACHE_TTL);
      }

      // Invalidate metrics cache
      cache.del(`content:metrics:${contentId}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to increment view count:', errorMessage);
    }
  }

  private calculateEngagementRate(contentMetrics: any, engagementStats: { comments: number; shares: number }): number {
    const views = contentMetrics?.views || 1; // Avoid division by zero
    const engagements = (contentMetrics?.likes || 0) + 
                       (engagementStats.comments || 0) + 
                       (engagementStats.shares || 0);
    
    return Math.round((engagements / views) * 100);
  }

  private generateListCacheKey(query: ContentQueryDto): string {
    const keyParts = [
      LIST_CACHE_PREFIX,
      query.type || 'all',
      query.status || 'all',
      query.stationId || 'all',
      query.channelId || 'all',
      query.authorId || 'all',
      query.categoryId || 'all',
      query.tagId || 'all',
      query.search || 'all',
      query.sortBy || 'publishedAt',
      query.sortOrder || 'desc',
      query.page || 1,
      query.limit || 20,
      query.includeDrafts ? 'drafts' : 'nodrafts'
    ];
    
    return keyParts.join(':');
  }

  private async invalidateContentCaches(content: any): Promise<void> {
    const cacheKeys = [
      `${CACHE_PREFIX}${content._id}`,
      `${CACHE_PREFIX}slug:${content.slug}:station:${content.stationId || 'global'}`,
      `content:metrics:${content._id}`
    ];

    await Promise.all([
      ...cacheKeys.map(key => cache.del(key)),
      this.invalidateListCaches(),
      cache.del(`content:stats:${content.type}`),
      cache.del(`content:stats:all`)
    ]);
  }

  private async invalidateListCaches(): Promise<void> {
    const keys = await cache.keys(`${LIST_CACHE_PREFIX}*`);
    if (keys.length > 0) {
      await cache.delMultiple(keys);
    }
  }

  private getDateFilter(timeframe: 'day' | 'week' | 'month'): any {
    const now = new Date();
    let startDate = new Date();

    switch (timeframe) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
    }

    return { $gte: startDate };
  }
}

export const contentService = new ContentService();