// api/content/slug/[slug]/route.ts
import { NextRequest } from 'next/server';
import { contentService } from '@/services/content.service';
import { ApiResponse } from '@/lib/api/response';
import { logger } from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  await new Promise(resolve => setTimeout(resolve, 0)); // Optional: ensures async context
  const { slug } = await params; // unwrap the promise

  try {
    const searchParams = request.nextUrl.searchParams;
    const stationId = searchParams.get('stationId') || undefined;
    const includeEngagement = searchParams.get('includeEngagement') === 'true';

    const content = await contentService.getContentBySlug(
      slug,
      stationId,
      includeEngagement
    );

    logger.info('Content fetched by slug', { 
      slug,
      stationId,
      contentId: content._id
    });

    return ApiResponse.success(content);
  } catch (error: any) {
    logger.error('Error fetching content by slug', { 
      slug,
      error: error.message
    });

    if (error.message.includes('not found')) {
      return ApiResponse.notFound(error.message);
    }

    return ApiResponse.error('Failed to fetch content', 500);
  }
}
