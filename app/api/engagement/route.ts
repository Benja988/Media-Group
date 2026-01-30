import { NextRequest } from 'next/server';
import { engagementService } from '@/services/engagement.service';
import { EngagementCreateDto } from '@/types/engagement.types';
import { ApiResponse } from '@/lib/api/response';
import { AuthenticatedRequest } from '@/lib/api/middleware';
import { validateRequest, engagementValidationSchema } from '@/lib/api/validation';
import { logger } from '@/lib/logger';

// POST - Record engagement (public for views, authenticated for others)
export async function POST(request: AuthenticatedRequest) {
  let engagementData: EngagementCreateDto | null = null;

  try {
    const body = await request.json();

    // ✅ Validate request body
    const validationResult = validateRequest(body, engagementValidationSchema);

    if (!validationResult.valid) {
      return ApiResponse.validationError(validationResult.errors);
    }

    engagementData = validationResult.data as EngagementCreateDto;

    // ✅ Extract auth info (optional)
    const authHeader = request.headers.get('authorization');
    let userId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.replace('Bearer ', '');
        // TODO: Verify token properly and extract userId
        userId = engagementData.userId ?? null;
      } catch {
        userId = null;
      }
    }

    // ✅ Handle engagement rules
    switch (engagementData.type) {
      case 'view':
        // Views can be anonymous
        if (!userId) {
          delete engagementData.userId;
        }
        break;

      case 'like':
        if (!userId) {
          return ApiResponse.unauthorized('Authentication required for likes');
        }
        engagementData.userId = userId;
        break;

      case 'comment':
        if (!userId) {
          return ApiResponse.unauthorized('Authentication required for comments');
        }

        if (!engagementData.value?.trim()) {
          return ApiResponse.error('Comment value is required', 400);
        }

        engagementData.userId = userId;
        break;

      case 'share':
        // Shares can be anonymous or authenticated
        if (userId) {
          engagementData.userId = userId;
        } else {
          delete engagementData.userId;
        }
        break;
    }

    // ✅ Persist engagement
    const engagement = await engagementService.recordEngagement(engagementData);

    logger.info('Engagement recorded', {
      engagementId: engagement._id,
      type: engagementData.type,
      contentId: engagementData.contentId,
      userId: engagementData.userId ?? 'anonymous',
    });

    return ApiResponse.success(
      engagement,
      'Engagement recorded successfully',
      201
    );
  } catch (error: any) {
    logger.error('Error recording engagement', {
      error: error.message,
      engagementData,
    });

    if (error.message?.includes('already liked')) {
      return ApiResponse.conflict(error.message);
    }

    if (error.message?.includes('not found')) {
      return ApiResponse.notFound(error.message);
    }

    return ApiResponse.error('Failed to record engagement', 500);
  }
}
