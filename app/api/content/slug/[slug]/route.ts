import { NextRequest } from 'next/server';
import { contentService } from '@/services/content.service';
import { ApiResponse } from '@/lib/api/response';
import { logger } from '@/lib/logger';

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = params;
    const searchParams = request.nextUrl.searchParams;
    
    const stationId = searchParams.get('stationId') || undefined;
    const includeEngagement = searchParams.get('includeEngagement') === 'true';
    
    const content = await contentService.getContentBySlug(
      slug,
      stationId,
      includeEngagement
    );
    
    logger.info('Content fetched by slug', { 
      slug, 
      stationId,
      contentId: content._id 
    });
    
    return ApiResponse.success(content);
  } catch (error: any) {
    logger.error('Error fetching content by slug', { 
      slug: params.slug, 
      error: error.message 
    });
    
    if (error.message.includes('not found')) {
      return ApiResponse.notFound(error.message);
    }
    
    return ApiResponse.error('Failed to fetch content', 500);
  }
}