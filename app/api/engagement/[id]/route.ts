import { NextRequest } from 'next/server';
import { engagementService } from '@/services/engagement.service';
import { ApiResponse } from '@/lib/api/response';
import { withAuth, AuthenticatedRequest } from '@/lib/api/middleware';
import { logger } from '@/lib/logger';

interface RouteParams {
  params: {
    id: string;
  };
}

// DELETE - Delete engagement (authenticated, owner or admin)
export async function DELETE(
  request: AuthenticatedRequest,
  { params }: RouteParams
) {
  return await withAuth(request, async (req) => {
    try {
      const { id } = params;
      const user = req.user!;
      
      // Only allow users to delete their own engagements (or admin)
      const userId = user.role === 'super_admin' ? undefined : user.userId;
      
      await engagementService.deleteEngagement(id, userId);
      
      logger.info('Engagement deleted', { 
        engagementId: id, 
        userId: user.userId 
      });
      
      return ApiResponse.success(null, 'Engagement deleted successfully');
    } catch (error: any) {
      logger.error('Error deleting engagement', { 
        engagementId: params.id, 
        userId: req.user?.userId,
        error: error.message 
      });
      
      if (error.message.includes('not found')) {
        return ApiResponse.notFound(error.message);
      }
      
      return ApiResponse.error('Failed to delete engagement', 500);
    }
  });
}