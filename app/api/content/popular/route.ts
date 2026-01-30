import { NextRequest } from 'next/server';
import { contentService } from '@/services/content.service';
import { ApiResponse } from '@/lib/api/response';
import { logger } from '@/lib/logger';

// GET - Get popular content (public)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const type = searchParams.get('type') as any || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    const timeframe = (searchParams.get('timeframe') as 'day' | 'week' | 'month') || 'week';
    
    const popularContent = await contentService.getPopularContent(
      type,
      limit,
      timeframe
    );
    
    logger.info('Popular content fetched', { 
      type, 
      timeframe,
      count: popularContent.length 
    });
    
    return ApiResponse.success(popularContent);
  } catch (error: any) {
    logger.error('Error fetching popular content', { error: error.message });
    
    return ApiResponse.error('Failed to fetch popular content', 500);
  }
}