import { NextRequest } from 'next/server'
import { contentService } from '@/services/content.service'
import { ApiResponse } from '@/lib/api/response'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return ApiResponse.error('Missing content id', 400)
    }

    const metrics = await contentService.getContentMetrics(id)

    logger.info('Content metrics fetched', { contentId: id })

    return ApiResponse.success(metrics)
  } catch (error: any) {
    logger.error('Error fetching content metrics', {
      error: error.message,
    })

    if (error.message.includes('not found')) {
      return ApiResponse.notFound(error.message)
    }

    return ApiResponse.error('Failed to fetch content metrics', 500)
  }
}
