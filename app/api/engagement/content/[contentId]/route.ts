import { NextRequest } from 'next/server';
import { engagementService } from '@/services/engagement.service';
import { ApiResponse } from '@/lib/api/response';
import { logger } from '@/lib/logger';

interface RouteParams {
  params: Promise<{ contentId: string }>
}

// GET - Get content engagements (public)
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { contentId } = await params;
  try {
    
    
    const engagement = await engagementService.getContentEngagement(contentId);
    
    logger.info('Content engagement fetched', { contentId });
    
    return ApiResponse.success(engagement);
  } catch (error: any) {
    logger.error('Error fetching content engagement', { 
      contentId: contentId, 
      error: error.message 
    });
    
    return ApiResponse.error('Failed to fetch content engagement', 500);
  }
}