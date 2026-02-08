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
  ContentUpdateDto,
} from '@/types/content.types';
import { AppError } from '@/utils/errors';
import { engagementService } from './engagement.service';
import { InMemoryCache } from '@/config/cache';

const CACHE_TTL = 3600;
const POPULAR_CACHE_TTL = 1800;
const CACHE_PREFIX = 'content:';
const LIST_CACHE_PREFIX = 'content_list:';

interface ByTypeAggregation {
  _id: 'news' | 'podcast' | 'video' | 'show';
  count: number;
}

const cache = new InMemoryCache();

export class ContentService {
  /* -------------------------------------------------------------------------- */
  /*                               CREATE CONTENT                               */
  /* -------------------------------------------------------------------------- */
  async createContent(data: ContentCreateDto): Promise<ContentResponse> {
    try {
      const slug = data.slug || generateSlug(data.title);

      const existing = await Content.findOne({
        slug,
        stationId: data.stationId || null,
      });

      if (existing) {
        throw new AppError('Content with this slug already exists', 400);
      }

      await this.validateRelationships(data);

      if (data.status === 'published' && !data.publishedAt) {
        data.publishedAt = new Date();
      }

      const content = await Content.create({
        ...data,
        slug,
        metrics: { views: 0, likes: 0 },
      });

      await this.invalidateContentCaches(content);

      return this.enrichContentResponse(content.toObject());
    } catch (err) {
      throw this.wrapError(err, 'Failed to create content');
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                GET BY ID                                   */
  /* -------------------------------------------------------------------------- */
  async getContentById(
    id: string,
    includeEngagement = false,
    incrementView = true,
  ): Promise<ContentResponse> {
    const cacheKey = `${CACHE_PREFIX}${id}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      if (incrementView) this.incrementViewCount(id);
      return includeEngagement
        ? this.enrichWithEngagement(cached, id)
        : cached;
    }

    const content = await Content.findById(id).lean();
    if (!content) throw new AppError('Content not found', 404);

    if (incrementView) this.incrementViewCount(id);

    const enriched = await this.enrichContentResponse(content);
    cache.set(cacheKey, enriched, CACHE_TTL);

    return includeEngagement
      ? this.enrichWithEngagement(enriched, id)
      : enriched;
  }

  /* -------------------------------------------------------------------------- */
  /*                               GET BY SLUG                                  */
  /* -------------------------------------------------------------------------- */
  async getContentBySlug(
    slug: string,
    stationId?: string,
    includeEngagement = false,
  ): Promise<ContentResponse> {
    const cacheKey = `${CACHE_PREFIX}slug:${slug}:${stationId || 'global'}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      this.incrementViewCount(cached._id);
      return includeEngagement
        ? this.enrichWithEngagement(cached, cached._id)
        : cached;
    }

    const content = await Content.findOne({
      slug,
      stationId: stationId || null,
    }).lean();

    if (!content) throw new AppError('Content not found', 404);

    this.incrementViewCount(content._id.toString());

    const enriched = await this.enrichContentResponse(content);
    cache.set(cacheKey, enriched, CACHE_TTL);

    return includeEngagement
      ? this.enrichWithEngagement(enriched, enriched._id)
      : enriched;
  }

  /* -------------------------------------------------------------------------- */
  /*                              CONTENT LIST                                  */
  /* -------------------------------------------------------------------------- */
  async getContentList(query: ContentQueryDto): Promise<ContentListResponse> {
    const cacheKey = this.generateListCacheKey(query);
    const cached = cache.get(cacheKey);
    if (cached) return cached;

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
      includeDrafts = false,
    } = query;

    const filter: any = {};

    if (type) filter.type = type;
    if (stationId) filter.stationId = new Types.ObjectId(stationId);
    if (channelId) filter.channelId = new Types.ObjectId(channelId);
    if (authorId) filter.authorId = new Types.ObjectId(authorId);
    if (categoryId) filter.categoryIds = new Types.ObjectId(categoryId);
    if (tagId) filter.tagIds = new Types.ObjectId(tagId);

    if (!includeDrafts) {
      filter.$or = [
        { status: 'published' },
        { status: 'scheduled', scheduledFor: { $lte: new Date() } },
      ];
    } else if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [items, total] = await Promise.all([
      Content.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Content.countDocuments(filter),
    ]);

    const enriched = await Promise.all(
      items.map(item => this.enrichContentResponse(item)),
    );

    const result: ContentListResponse = {
      data: enriched,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      filters: { type, status, stationId, search },
    };

    cache.set(cacheKey, result, 300);
    return result;
  }

  /* -------------------------------------------------------------------------- */
  /*                                UPDATE                                      */
  /* -------------------------------------------------------------------------- */
  async updateContent(id: string, data: ContentUpdateDto): Promise<ContentResponse> {
    const content = await Content.findById(id);
    if (!content) throw new AppError('Content not found', 404);

    if (data.status === 'published' && !data.publishedAt) {
      data.publishedAt = new Date();
    }

    Object.assign(content, data);
    await content.save();

    await this.invalidateContentCaches(content);
    return this.enrichContentResponse(content.toObject());
  }

  /* -------------------------------------------------------------------------- */
  /*                                 DELETE                                     */
  /* -------------------------------------------------------------------------- */
  async deleteContent(id: string): Promise<void> {
    const content = await Content.findById(id);
    if (!content) throw new AppError('Content not found', 404);

    await content.deleteOne();
    await this.invalidateContentCaches(content);
  }

  /* -------------------------------------------------------------------------- */
  /*                                METRICS                                     */
  /* -------------------------------------------------------------------------- */
  async getContentMetrics(id: string): Promise<ContentMetrics> {
    const cacheKey = `content:metrics:${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const [content, engagement] = await Promise.all([
      Content.findById(id).select('metrics').lean(),
      engagementService.getContentEngagementStats(id),
    ]);

    if (!content) throw new AppError('Content not found', 404);

    const comments = engagement.aggregated?.comment?.count || 0;
    const shares = engagement.aggregated?.share?.count || 0;

    const metrics: ContentMetrics = {
      views: content.metrics?.views || 0,
      likes: content.metrics?.likes || 0,
      comments,
      shares,
      engagementRate: this.calculateEngagementRate(content.metrics, {
        comments,
        shares,
      }),
    };

    cache.set(cacheKey, metrics, 300);
    return metrics;
  }

  /* -------------------------------------------------------------------------- */
  /*                              STATS & POPULAR                               */
  /* -------------------------------------------------------------------------- */
  async getContentStats(type?: string): Promise<ContentStats> {
    const cacheKey = `content:stats:${type || 'all'}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const filter = type ? { type } : {};

    const [total, published, scheduled, drafts, byType, recentActivity] =
      await Promise.all([
        Content.countDocuments(filter),
        Content.countDocuments({ ...filter, status: 'published' }),
        Content.countDocuments({ ...filter, status: 'scheduled' }),
        Content.countDocuments({ ...filter, status: 'draft' }),
        Content.aggregate<ByTypeAggregation>([
          { $match: filter },
          { $group: { _id: '$type', count: { $sum: 1 } } },
        ]),
        Content.find(filter)
          .sort({ updatedAt: -1 })
          .limit(10)
          .select('title type status updatedAt')
          .lean(),
      ]);

    const stats: ContentStats = {
      total,
      published,
      scheduled,
      drafts,
      byType: byType.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {} as Record<string, number>),
      recentActivity,
      updatedAt: new Date(),
    };

    cache.set(cacheKey, stats, 300);
    return stats;
  }

  

  /* -------------------------------------------------------------------------- */
  /*                              HELPERS                                       */
  /* -------------------------------------------------------------------------- */
  private async validateRelationships(data: ContentCreateDto): Promise<void> {
    const checks: Promise<any>[] = [];

    if (data.stationId) checks.push(Station.findById(data.stationId));
    if (data.channelId) checks.push(Channel.findById(data.channelId));

    if (data.categoryIds?.length) {
      checks.push(Category.countDocuments({ _id: { $in: data.categoryIds } }));
    }

    if (data.tagIds?.length) {
      checks.push(Tag.countDocuments({ _id: { $in: data.tagIds } }));
    }

    await Promise.all(checks);
  }

  private async enrichContentResponse(content: any): Promise<ContentResponse> {
    const [categories, tags, station, channel, author] = await Promise.all([
      content.categoryIds?.length
        ? Category.find({ _id: { $in: content.categoryIds } }).lean()
        : [],
      content.tagIds?.length
        ? Tag.find({ _id: { $in: content.tagIds } }).lean()
        : [],
      content.stationId ? Station.findById(content.stationId).lean() : null,
      content.channelId ? Channel.findById(content.channelId).lean() : null,
      content.authorId
        ? mongoose.model('User').findById(content.authorId).lean()
        : null,
    ]);

    return {
      ...content,
      _id: content._id.toString(),
      categories,
      tags,
      station,
      channel,
      author,
    };
  }

  private async enrichWithEngagement(
    content: ContentResponse,
    contentId: string,
  ): Promise<ContentResponse> {
    const engagement = await engagementService.getContentEngagement(contentId);
    return { ...content, engagement };
  }

  private async incrementViewCount(contentId: string): Promise<void> {
    Content.findByIdAndUpdate(contentId, {
      $inc: { 'metrics.views': 1 },
    }).exec();

    cache.del(`content:metrics:${contentId}`);
  }

  private calculateEngagementRate(
    metrics: any,
    extra: { comments: number; shares: number },
  ): number {
    const views = metrics?.views || 1;
    const total =
      (metrics?.likes || 0) + extra.comments + extra.shares;
    return Math.round((total / views) * 100);
  }

  private generateListCacheKey(query: ContentQueryDto): string {
    return [
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
      query.includeDrafts ? 'drafts' : 'nodrafts',
    ].join(':');
  }

  private async invalidateContentCaches(content: any): Promise<void> {
    await Promise.all([
      cache.del(`${CACHE_PREFIX}${content._id}`),
      cache.del(`${CACHE_PREFIX}slug:${content.slug}:${content.stationId || 'global'}`),
      cache.del(`content:metrics:${content._id}`),
      cache.del(`content:stats:${content.type}`),
      cache.del(`content:stats:all`),
    ]);

    await this.invalidateListCaches();
  }

  private async invalidateListCaches(): Promise<void> {
    const keys = await cache.keys(`${LIST_CACHE_PREFIX}*`);
    if (keys.length) await cache.delMultiple(keys);
  }

  private wrapError(error: unknown, message: string): AppError {
    if (error instanceof AppError) return error;
    return new AppError(message, 500, error instanceof Error ? error.message : '');
  }
}

export const contentService = new ContentService();
