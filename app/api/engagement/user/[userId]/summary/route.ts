import { NextRequest } from 'next/server';
import { engagementService } from '@/services/engagement.service';
import { ApiResponse } from '@/lib/api/response';
import { withAuth, AuthenticatedRequest } from '@/lib/api/middleware';
import { logger } from '@/lib/logger';

interface RouteParams {
  params: Promise<{ userId: string }>
}

// GET - Get user engagement summary (authenticated, owner or admin)
export async function GET(
  request: AuthenticatedRequest,
  { params }: RouteParams
) {
  return await withAuth(request, async (req) => {
    const { userId } = await params;
    try {
      
      const user = req.user!;
      
      // Users can only view their own summary (or admin)
      if (userId !== user.userId && user.role !== 'super_admin') {
        return ApiResponse.forbidden();
      }

      const summary = await engagementService.getUserEngagementSummary(userId);
      
      logger.info('User engagement summary fetched', { 
        userId,
        requesterId: user.userId 
      });
      
      return ApiResponse.success(summary);
    } catch (error: any) {
      logger.error('Error fetching user engagement summary', { 
        userId: userId, 
        requesterId: req.user?.userId,
        error: error.message 
      });
      
      return ApiResponse.error('Failed to fetch user engagement summary', 500);
    }
  });
}