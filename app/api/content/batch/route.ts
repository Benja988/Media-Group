import { NextRequest } from 'next/server';
import { contentService } from '@/services/content.service';
import { ApiResponse } from '@/lib/api/response';
import { withRoles, AuthenticatedRequest } from '@/lib/api/middleware';
import { validateRequest } from '@/lib/api/validation';
import { logger } from '@/lib/logger';

// POST - Batch get content (admin only)
export async function POST(request: AuthenticatedRequest) {
  return await withRoles(['super_admin', 'group_admin', 'station_admin'])(
    request,
    async (req) => {
      try {
        const body = await req.json();
        
        const validationResult = validateRequest(body, {
          ids: { required: true, type: 'array', items: { type: 'string', mongoId: true } }
        });

        if (!validationResult.valid) {
          return ApiResponse.validationError(validationResult.errors);
        }

        const { ids } = validationResult.data;
        
        // Limit batch size
        if (ids.length > 100) {
          return ApiResponse.error('Batch size too large. Maximum 100 items.', 400);
        }

        const contentBatch = await contentService.getContentBatch(ids);
        
        logger.info('Content batch fetched', { 
          userId: req.user!.userId,
          batchSize: ids.length,
          returnedCount: contentBatch.length 
        });
        
        return ApiResponse.success(contentBatch);
      } catch (error: any) {
        logger.error('Error in batch content operation', { 
          userId: req.user?.userId,
          error: error.message 
        });
        
        return ApiResponse.error('Failed to process batch operation', 500);
      }
    }
  );
}