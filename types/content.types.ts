// types/content.types.ts

// Update your content.types.ts to provide defaults:
export interface ContentCreateDto {
  type: 'news' | 'podcast' | 'video' | 'show';
  title: string;
  slug?: string;
  description?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  stationId?: string;
  channelId?: string;
  authorId?: string;
  categoryIds?: string[];
  tagIds?: string[];
  status?: 'draft' | 'scheduled' | 'published';
  publishedAt?: Date;
  scheduledFor?: Date;
}

// Or create a type with defaults for internal use:
export interface ContentCreateData extends Omit<ContentCreateDto, 'categoryIds' | 'tagIds'> {
  categoryIds: string[];  // Required, not optional
  tagIds: string[];       // Required, not optional
}

// Helper function to convert DTO to Data
export function toContentCreateData(dto: ContentCreateDto): ContentCreateData {
  return {
    ...dto,
    categoryIds: dto.categoryIds ?? [],
    tagIds: dto.tagIds ?? []
  };
}

export interface ContentUpdateDto extends Partial<ContentCreateDto> {}

export interface ContentQueryDto {
  type?: 'news' | 'podcast' | 'video' | 'show';
  status?: 'draft' | 'scheduled' | 'published';
  stationId?: string;
  channelId?: string;
  authorId?: string;
  categoryId?: string;
  tagId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  includeDrafts?: boolean;
}

export interface ContentResponse {
  _id: string;
  type: 'news' | 'podcast' | 'video' | 'show';
  title: string;
  slug: string;
  description?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  stationId?: string;
  channelId?: string;
  authorId?: string;
  categoryIds?: string[];
  tagIds?: string[];
  status: 'draft' | 'scheduled' | 'published';
  publishedAt?: Date;
  scheduledFor?: Date;
  metrics: {
    views: number;
    likes: number;
  };
  categories?: any[];
  tags?: any[];
  station?: any;
  channel?: any;
  author?: any;
  engagement?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentListResponse {
  data: ContentResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    type?: string;
    status?: string;
    stationId?: string;
    search?: string;
  };
}

export interface ContentMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
}

export interface ContentStats {
  total: number;
  published: number;
  scheduled: number;
  drafts: number;
  byType: Record<string, number>;
  recentActivity: any[];
  updatedAt: Date;
}