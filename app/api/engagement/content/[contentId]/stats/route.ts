import { NextRequest } from 'next/server';
import { engagementService } from '@/services/engagement.service';
import { ApiResponse } from '@/lib/api/response';
import { withRoles, AuthenticatedRequest } from '@/lib/api/middleware';
import { logger } from '@/lib/logger';

interface RouteParams {
  params: {
    contentId: string;
  };
}

// GET - Get content engagement stats (admin only)
export async function GET(
  request: AuthenticatedRequest,
  { params }: RouteParams
) {
  return await withRoles(['super_admin', 'group_admin', 'station_admin', 'editor'])(
    request,
    async (req) => {
      try {
        const { contentId } = params;
        
        const stats = await engagementService.getContentEngagementStats(contentId);
        
        logger.info('Content engagement stats fetched', { 
          contentId, 
          userId: req.user!.userId 
        });
        
        return ApiResponse.success(stats);
      } catch (error: any) {
        logger.error('Error fetching content engagement stats', { 
          contentId: params.contentId, 
          userId: req.user?.userId,
          error: error.message 
        });
        
        return ApiResponse.error('Failed to fetch content engagement stats', 500);
      }
    }
  );
}