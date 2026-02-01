import mongoose, { Types } from 'mongoose';
import { AppError } from '@/utils/errors';
import { 
  EngagementCreateDto,
  EngagementQueryDto,
  EngagementResponse,
  EngagementStats,
  EngagementAggregation,
  UserEngagementSummary
} from '@/types/engagement.types';
import { Engagement, Content } from '@/lib/models';

// In-memory cache configuration
const ENGAGEMENT_CACHE_TTL = 1800; // 30 minutes (in seconds)
const LEADERBOARD_CACHE_TTL = 3600; // 1 hour (in seconds)
const CACHE_PREFIX = 'engagement:';

// Simple in-memory cache implementation
class InMemoryCache {
  private cache = new Map<string, { value: any; expiresAt: number }>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => this.cleanupExpired(), 60000);
  }

  set(key: string, value: any, ttl: number = 0): void {
    const expiresAt = ttl > 0 ? Date.now() + (ttl * 1000) : 0;
    this.cache.set(key, { value, expiresAt });
  }

  get<T = any>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (entry.expiresAt > 0 && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value;
  }

  del(key: string): void {
    this.cache.delete(key);
  }

  async mget(keys: string[]): Promise<(string | null)[]> {
    return keys.map(key => {
      const value = this.get(key);
      return value ? JSON.stringify(value) : null;
    });
  }

  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    const matchingKeys: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        matchingKeys.push(key);
      }
    }
    
    return matchingKeys;
  }

  async setex(key: string, ttl: number, value: string): Promise<void> {
    this.set(key, JSON.parse(value), ttl);
  }

  async delMultiple(keys: string[]): Promise<void> {
    keys.forEach(key => this.cache.delete(key));
  }

  private cleanupExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt > 0 && now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  dispose(): void {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
  }
}

// Global cache instance
const cache = new InMemoryCache();

export class EngagementService {
  /**
   * Record an engagement
   */
  async recordEngagement(data: EngagementCreateDto): Promise<EngagementResponse> {
    try {
      // Validate content exists
      const content = await Content.findById(data.contentId);
      if (!content) {
        throw new AppError('Content not found', 404);
      }

      // Check for duplicate like from same user
      if (data.type === 'like' && data.userId) {
        const existingLike = await Engagement.findOne({
          contentId: data.contentId,
          userId: data.userId,
          type: 'like'
        });

        if (existingLike) {
          throw new AppError('User has already liked this content', 400);
        }
      }

      const engagement = await Engagement.create(data);

      // Update content metrics asynchronously
      this.updateContentMetrics(data.contentId, data.type);

      // Invalidate relevant caches
      await this.invalidateEngagementCaches(data.contentId, data.userId);

      return await this.enrichEngagementResponse(engagement);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to record engagement', 500, error);
    }
  }

  /**
   * Get engagements for content
   */
  async getContentEngagement(contentId: string): Promise<any> {
    try {
      const cacheKey = `${CACHE_PREFIX}content:${contentId}:all`;
      
      const cachedEngagement = cache.get(cacheKey);
      if (cachedEngagement) {
        return cachedEngagement;
      }

      const [likes, comments, recentComments, shares] = await Promise.all([
        this.getEngagementCount(contentId, 'like'),
        this.getEngagementCount(contentId, 'comment'),
        this.getRecentComments(contentId, 5),
        this.getEngagementCount(contentId, 'share')
      ]);

      const result = {
        likes,
        comments,
        shares,
        recentComments,
        totalEngagements: likes + comments + shares
      };

      // Cache the result
      cache.set(cacheKey, result, ENGAGEMENT_CACHE_TTL);

      return result;
    } catch (error) {
      throw new AppError('Failed to fetch content engagement', 500, error);
    }
  }

  /**
   * Get engagement statistics for content
   */
  async getContentEngagementStats(contentId: string): Promise<EngagementStats> {
    try {
      const cacheKey = `${CACHE_PREFIX}content:${contentId}:stats`;
      
      const cachedStats = cache.get(cacheKey);
      if (cachedStats) {
        return cachedStats;
      }

      const [aggregatedStats, hourlyTrend, userEngagement] = await Promise.all([
        Engagement.aggregate([
          { $match: { contentId: new Types.ObjectId(contentId) } },
          { $group: { 
            _id: '$type', 
            count: { $sum: 1 },
            uniqueUsers: { $addToSet: '$userId' }
          }},
          { $project: {
            type: '$_id',
            count: 1,
            uniqueUsers: { $size: '$uniqueUsers' },
            _id: 0
          }}
        ]),
        this.getHourlyEngagementTrend(contentId, 24),
        this.getTopEngagingUsers(contentId, 10)
      ]);

      const stats: EngagementStats = {
        aggregated: aggregatedStats.reduce((acc, curr) => {
          acc[curr.type] = {
            count: curr.count,
            uniqueUsers: curr.uniqueUsers
          };
          return acc;
        }, {}),
        hourlyTrend,
        topEngagingUsers: userEngagement,
        updatedAt: new Date()
      };

      // Cache with shorter TTL for frequently changing data
      cache.set(cacheKey, stats, 300);

      return stats;
    } catch (error) {
      throw new AppError('Failed to fetch engagement statistics', 500, error);
    }
  }

  /**
   * Get user engagements
   */
  async getUserEngagements(
    userId: string, 
    query: EngagementQueryDto
  ): Promise<EngagementResponse[]> {
    try {
      const cacheKey = this.generateUserEngagementsCacheKey(userId, query);
      
      const cachedEngagements = cache.get(cacheKey);
      if (cachedEngagements) {
        return cachedEngagements;
      }

      const { type, contentId, limit = 50, page = 1 } = query;
      
      const filter: any = { userId };
      if (type) filter.type = type;
      if (contentId) filter.contentId = contentId;

      const skip = (page - 1) * limit;

      const engagements = await Engagement.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const enrichedEngagements = await Promise.all(
        engagements.map(engagement => this.enrichEngagementResponse(engagement))
      );

      // Cache user engagements
      cache.set(cacheKey, enrichedEngagements, ENGAGEMENT_CACHE_TTL);

      return enrichedEngagements;
    } catch (error) {
      throw new AppError('Failed to fetch user engagements', 500, error);
    }
  }

  /**
   * Get user engagement summary
   */
  async getUserEngagementSummary(userId: string): Promise<UserEngagementSummary> {
    try {
      const cacheKey = `${CACHE_PREFIX}user:${userId}:summary`;
      
      const cachedSummary = cache.get(cacheKey);
      if (cachedSummary) {
        return cachedSummary;
      }

      const [aggregatedStats, recentEngagements, topContent] = await Promise.all([
        Engagement.aggregate([
          { $match: { userId: new Types.ObjectId(userId) } },
          { $group: { 
            _id: '$type', 
            count: { $sum: 1 },
            lastEngagement: { $max: '$createdAt' }
          }},
          { $project: {
            type: '$_id',
            count: 1,
            lastEngagement: 1,
            _id: 0
          }}
        ]),
        Engagement.find({ userId })
          .sort({ createdAt: -1 })
          .limit(10)
          .populate('contentId', 'title type thumbnailUrl')
          .lean(),
        Engagement.aggregate([
          { $match: { userId: new Types.ObjectId(userId) } },
          { $group: { 
            _id: '$contentId', 
            engagementCount: { $sum: 1 },
            types: { $addToSet: '$type' }
          }},
          { $sort: { engagementCount: -1 } },
          { $limit: 5 },
          { 
            $lookup: {
              from: 'contents',
              localField: '_id',
              foreignField: '_id',
              as: 'content'
            }
          },
          { $unwind: '$content' },
          { $project: {
            contentId: '$_id',
            title: '$content.title',
            type: '$content.type',
            thumbnailUrl: '$content.thumbnailUrl',
            engagementCount: 1,
            engagementTypes: '$types'
          }}
        ])
      ]);

      const summary: UserEngagementSummary = {
        aggregated: aggregatedStats.reduce((acc, curr) => {
          acc[curr.type] = {
            count: curr.count,
            lastEngagement: curr.lastEngagement
          };
          return acc;
        }, {}),
        recentEngagements,
        topEngagedContent: topContent,
        totalEngagements: aggregatedStats.reduce((sum, curr) => sum + curr.count, 0)
      };

      // Cache user summary
      cache.set(cacheKey, summary, ENGAGEMENT_CACHE_TTL);

      return summary;
    } catch (error) {
      throw new AppError('Failed to fetch user engagement summary', 500, error);
    }
  }

  /**
   * Delete an engagement
   */
  async deleteEngagement(engagementId: string, userId?: string): Promise<void> {
    try {
      const filter: any = { _id: engagementId };
      if (userId) filter.userId = userId;

      const engagement = await Engagement.findOne(filter);
      if (!engagement) {
        throw new AppError('Engagement not found', 404);
      }

      // Store info for cache invalidation
      const { contentId, userId: engagementUserId, type } = engagement;

      // Delete the engagement
      await engagement.deleteOne();

      // Update content metrics (decrement)
      await this.updateContentMetrics(contentId, type, -1);

      // Invalidate caches
      await this.invalidateEngagementCaches(contentId, engagementUserId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete engagement', 500, error);
    }
  }

  /**
   * Get engagement leaderboard
   */
  async getEngagementLeaderboard(
    type?: 'likes' | 'comments' | 'shares',
    timeframe: 'day' | 'week' | 'month' = 'week',
    limit: number = 20
  ): Promise<any[]> {
    try {
      const cacheKey = `${CACHE_PREFIX}leaderboard:${type || 'all'}:${timeframe}:${limit}`;
      
      const cachedLeaderboard = cache.get(cacheKey);
      if (cachedLeaderboard) {
        return cachedLeaderboard;
      }

      const dateFilter = this.getDateFilter(timeframe);

      const matchStage: any = { 
        createdAt: dateFilter 
      };
      
      if (type) {
        matchStage.type = type.slice(0, -1); // Convert 'likes' to 'like'
      }

      const leaderboard = await Engagement.aggregate([
        { $match: matchStage },
        { 
          $group: { 
            _id: '$contentId', 
            engagementCount: { $sum: 1 },
            lastEngagement: { $max: '$createdAt' }
          }
        },
        { $sort: { engagementCount: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: 'contents',
            localField: '_id',
            foreignField: '_id',
            as: 'content'
          }
        },
        { $unwind: '$content' },
        { 
          $project: {
            contentId: '$_id',
            title: '$content.title',
            type: '$content.type',
            thumbnailUrl: '$content.thumbnailUrl',
            engagementCount: 1,
            lastEngagement: 1
          }
        }
      ]);

      // Cache leaderboard
      cache.set(cacheKey, leaderboard, LEADERBOARD_CACHE_TTL);

      return leaderboard;
    } catch (error) {
      throw new AppError('Failed to fetch engagement leaderboard', 500, error);
    }
  }

  /**
   * Batch record engagements (for analytics imports, etc.)
   */
  async batchRecordEngagements(engagements: EngagementCreateDto[]): Promise<void> {
    try {
      if (engagements.length > 1000) {
        throw new AppError('Batch size too large. Maximum 1000 engagements per batch.', 400);
      }

      // Validate all content exists
      const contentIds = [...new Set(engagements.map(e => e.contentId))];
      const existingContent = await Content.find({ _id: { $in: contentIds } }).select('_id').lean();
      const existingContentIds = new Set(existingContent.map(c => c._id.toString()));

      const validEngagements = engagements.filter(e => existingContentIds.has(e.contentId));

      if (validEngagements.length === 0) {
        throw new AppError('No valid engagements to record', 400);
      }

      // Record engagements
      await Engagement.insertMany(validEngagements, { ordered: false });

      // Update content metrics in bulk
      await this.batchUpdateContentMetrics(validEngagements);

      // Invalidate caches for affected content
      const affectedContentIds = [...new Set(validEngagements.map(e => e.contentId))];
      await Promise.all(
        affectedContentIds.map(contentId => 
          this.invalidateEngagementCaches(contentId)
        )
      );

    } catch (error: unknown) {
      if (error instanceof AppError) throw error;
      
      // Handle bulk write errors
      if (error instanceof Error && error.name === 'BulkWriteError') {
        // Log the error but continue
        console.error('Partial failure in batch record engagements:', error);
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new AppError('Failed to batch record engagements', 500, errorMessage);
      }
    }
  }

  // Private helper methods

  private async updateContentMetrics(
    contentId: string, 
    type: string, 
    increment: number = 1
  ): Promise<void> {
    try {
      const updateField = type === 'like' ? 'metrics.likes' : 'metrics.views';
      
      await Content.findByIdAndUpdate(contentId, {
        $inc: { [updateField]: increment }
      });

      // Invalidate content cache
      cache.del(`content:${contentId}`);
      
      // Invalidate metrics cache
      cache.del(`content:metrics:${contentId}`);
    } catch (error) {
      console.error('Failed to update content metrics:', error);
    }
  }

  private async batchUpdateContentMetrics(engagements: EngagementCreateDto[]): Promise<void> {
    try {
      const updates: Record<string, { likes: number; views: number }> = {};

      // Aggregate updates by content and type
      engagements.forEach(engagement => {
        if (!updates[engagement.contentId]) {
          updates[engagement.contentId] = { likes: 0, views: 0 };
        }
        
        if (engagement.type === 'like') {
          updates[engagement.contentId].likes += 1;
        } else if (engagement.type === 'view') {
          updates[engagement.contentId].views += 1;
        }
      });

      // Perform bulk updates
      const bulkOps = Object.entries(updates).map(([contentId, metrics]) => ({
        updateOne: {
          filter: { _id: contentId },
          update: {
            $inc: {
              'metrics.likes': metrics.likes,
              'metrics.views': metrics.views
            }
          }
        }
      }));

      if (bulkOps.length > 0) {
        await Content.bulkWrite(bulkOps);
      }
    } catch (error) {
      console.error('Failed to batch update content metrics:', error);
    }
  }

  private async getEngagementCount(contentId: string, type: string): Promise<number> {
    const cacheKey = `${CACHE_PREFIX}content:${contentId}:count:${type}`;
    
    const cachedCount = cache.get<number>(cacheKey);
    if (cachedCount !== null) {
      return cachedCount;
    }

    const count = await Engagement.countDocuments({ contentId, type });
    
    // Cache count with shorter TTL
    cache.set(cacheKey, count, 300);
    
    return count;
  }

  private async getRecentComments(contentId: string, limit: number): Promise<any[]> {
    const comments = await Engagement.find({
      contentId,
      type: 'comment'
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'name')
    .select('userId value createdAt')
    .lean();

    return comments.map(comment => ({
      user: comment.userId,
      comment: comment.value,
      timestamp: comment.createdAt
    }));
  }

  private async getHourlyEngagementTrend(
    contentId: string, 
    hours: number = 24
  ): Promise<any[]> {
    const date = new Date();
    date.setHours(date.getHours() - hours);

    const trend = await Engagement.aggregate([
      {
        $match: {
          contentId: new Types.ObjectId(contentId),
          createdAt: { $gte: date }
        }
      },
      {
        $group: {
          _id: {
            hour: { $hour: '$createdAt' },
            type: '$type'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.hour',
          engagements: {
            $push: {
              type: '$_id.type',
              count: '$count'
            }
          },
          total: { $sum: '$count' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return trend;
  }

  private async getTopEngagingUsers(
    contentId: string, 
    limit: number = 10
  ): Promise<any[]> {
    const topUsers = await Engagement.aggregate([
      { $match: { contentId: new Types.ObjectId(contentId) } },
      { $group: { 
        _id: '$userId', 
        engagementCount: { $sum: 1 },
        types: { $addToSet: '$type' }
      }},
      { $sort: { engagementCount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $project: {
        userId: '$_id',
        name: '$user.name',
        engagementCount: 1,
        engagementTypes: '$types'
      }}
    ]);

    return topUsers;
  }

  private async enrichEngagementResponse(engagement: any): Promise<EngagementResponse> {
    const [content, user] = await Promise.all([
      Content.findById(engagement.contentId).select('title type thumbnailUrl').lean(),
      engagement.userId 
        ? mongoose.model('User').findById(engagement.userId).select('name email').lean()
        : null
    ]);

    return {
      ...engagement,
      _id: engagement._id.toString(),
      content,
      user,
      contentId: engagement.contentId.toString(),
      userId: engagement.userId?.toString()
    };
  }

  private async invalidateEngagementCaches(contentId: string, userId?: string): Promise<void> {
    const cacheKeys = [
      `${CACHE_PREFIX}content:${contentId}:all`,
      `${CACHE_PREFIX}content:${contentId}:stats`,
      ...['like', 'comment', 'share', 'view'].map(type => 
        `${CACHE_PREFIX}content:${contentId}:count:${type}`
      )
    ];

    if (userId) {
      cacheKeys.push(`${CACHE_PREFIX}user:${userId}:summary`);
    }

    // Also invalidate leaderboard caches
    const leaderboardKeys = await cache.keys(`${CACHE_PREFIX}leaderboard:*`);
    cacheKeys.push(...leaderboardKeys);

    if (cacheKeys.length > 0) {
      await cache.delMultiple(cacheKeys);
    }
  }

  private generateUserEngagementsCacheKey(userId: string, query: EngagementQueryDto): string {
    const keyParts = [
      `${CACHE_PREFIX}user:${userId}:engagements`,
      query.type || 'all',
      query.contentId || 'all',
      query.page || 1,
      query.limit || 50
    ];
    
    return keyParts.join(':');
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

export const engagementService = new EngagementService();