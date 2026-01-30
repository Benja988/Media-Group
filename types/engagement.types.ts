export interface EngagementCreateDto {
  contentId: string;
  userId?: string;
  type: 'view' | 'like' | 'comment' | 'share';
  value?: string;
}

export interface EngagementQueryDto {
  type?: 'view' | 'like' | 'comment' | 'share';
  contentId?: string;
  limit?: number;
  page?: number;
}

export interface EngagementResponse {
  _id: string;
  contentId: string;
  userId?: string;
  type: 'view' | 'like' | 'comment' | 'share';
  value?: string;
  content?: any;
  user?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface EngagementStats {
  aggregated: Record<string, { count: number; uniqueUsers: number }>;
  hourlyTrend: any[];
  topEngagingUsers: any[];
  updatedAt: Date;
}

export interface EngagementAggregation {
  type: string;
  count: number;
  uniqueUsers: number;
}

export interface UserEngagementSummary {
  aggregated: Record<string, { count: number; lastEngagement?: Date }>;
  recentEngagements: any[];
  topEngagedContent: any[];
  totalEngagements: number;
}