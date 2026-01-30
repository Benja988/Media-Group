import { NextRequest } from 'next/server';
import { contentService } from '@/services/content.service';
import { ApiResponse } from '@/lib/api/response';
import { logger } from '@/lib/logger';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    
    const metrics = await contentService.getContentMetrics(id);
    
    logger.info('Content metrics fetched', { contentId: id });
    
    return ApiResponse.success(metrics);
  } catch (error: any) {
    logger.error('Error fetching content metrics', { 
      contentId: params.id, 
      error: error.message 
    });
    
    if (error.message.includes('not found')) {
      return ApiResponse.notFound(error.message);
    }
    
    return ApiResponse.error('Failed to fetch content metrics', 500);
  }
}