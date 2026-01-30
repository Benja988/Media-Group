import { NextRequest } from 'next/server';
import { engagementService } from '@/services/engagement.service';
import { ApiResponse } from '@/lib/api/response';
import { logger } from '@/lib/logger';

// GET - Get engagement leaderboard (public)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const type = searchParams.get('type') as 'likes' | 'comments' | 'shares' | undefined;
    const timeframe = (searchParams.get('timeframe') as 'day' | 'week' | 'month') || 'week';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
    
    const leaderboard = await engagementService.getEngagementLeaderboard(
      type,
      timeframe,
      limit
    );
    
    logger.info('Engagement leaderboard fetched', { 
      type, 
      timeframe,
      limit 
    });
    
    return ApiResponse.success(leaderboard);
  } catch (error: any) {
    logger.error('Error fetching engagement leaderboard', { error: error.message });
    
    return ApiResponse.error('Failed to fetch engagement leaderboard', 500);
  }
}