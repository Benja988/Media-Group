import { NextRequest } from 'next/server';
import { contentService } from '@/services/content.service';
import { ApiResponse } from '@/lib/api/response';
import { withRoles, AuthenticatedRequest } from '@/lib/api/middleware';
import { logger } from '@/lib/logger';

// GET - Get content statistics (admin only)
export async function GET(request: AuthenticatedRequest) {
  return await withRoles(['super_admin', 'group_admin', 'station_admin', 'editor'])(
    request,
    async (req) => {
      try {
        const searchParams = req.nextUrl.searchParams;
        const type = searchParams.get('type') as any || undefined;
        const user = req.user!;
        
        // Only super_admin can get stats for all types
        if (type && user.role !== 'super_admin') {
          return ApiResponse.forbidden();
        }
        
        const stats = await contentService.getContentStats(type);
        
        logger.info('Content stats fetched', { 
          userId: user.userId,
          role: user.role,
          type 
        });
        
        return ApiResponse.success(stats);
      } catch (error: any) {
        logger.error('Error fetching content statistics', { 
          userId: req.user?.userId,
          error: error.message 
        });
        
        return ApiResponse.error('Failed to fetch content statistics', 500);
      }
    }
  );
}