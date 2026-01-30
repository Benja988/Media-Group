import { NextRequest } from 'next/server';
import { engagementService } from '@/services/engagement.service';
import { EngagementQueryDto } from '@/types/engagement.types';
import { ApiResponse } from '@/lib/api/response';
import { withAuth, AuthenticatedRequest } from '@/lib/api/middleware';
import { logger } from '@/lib/logger';

interface RouteParams {
  params: {
    userId: string;
  };
}

// GET - Get user engagements (authenticated, owner or admin)
export async function GET(
  request: AuthenticatedRequest,
  { params }: RouteParams
) {
  return await withAuth(request, async (req) => {
    try {
      const { userId } = params;
      const user = req.user!;
      
      // Users can only view their own engagements (or admin)
      if (userId !== user.userId && user.role !== 'super_admin') {
        return ApiResponse.forbidden();
      }

      const searchParams = req.nextUrl.searchParams;
      
      const query: EngagementQueryDto = {
        type: searchParams.get('type') as any || undefined,
        contentId: searchParams.get('contentId') || undefined,
        limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
        page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1
      };

      const engagements = await engagementService.getUserEngagements(userId, query);
      
      logger.info('User engagements fetched', { 
        userId,
        requesterId: user.userId,
        count: engagements.length 
      });
      
      return ApiResponse.success(engagements);
    } catch (error: any) {
      logger.error('Error fetching user engagements', { 
        userId: params.userId, 
        requesterId: req.user?.userId,
        error: error.message 
      });
      
      return ApiResponse.error('Failed to fetch user engagements', 500);
    }
  });
}