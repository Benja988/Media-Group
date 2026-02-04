import { NextRequest } from 'next/server'
import { contentService } from '@/services/content.service'
import { ContentCreateDto, ContentQueryDto } from '@/types/content.types'
import { ApiResponse } from '@/lib/api/response'
import { withRoles, AuthenticatedRequest } from '@/lib/api/middleware'
import { validateRequest, contentValidationSchema } from '@/lib/api/validation'
import { logger } from '@/lib/logger'
import { AppError } from '@/utils/errors'

// GET - List content (public)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Parse query parameters
    const query: ContentQueryDto = {
      type: (searchParams.get('type') as any) || undefined,
      status: (searchParams.get('status') as any) || undefined,
      stationId: searchParams.get('stationId') || undefined,
      channelId: searchParams.get('channelId') || undefined,
      authorId: searchParams.get('authorId') || undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      tagId: searchParams.get('tagId') || undefined,
      search: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
      page: searchParams.get('page')
        ? parseInt(searchParams.get('page')!, 10)
        : undefined,
      limit: searchParams.get('limit')
        ? parseInt(searchParams.get('limit')!, 10)
        : undefined,
      includeDrafts: false, // 🔒 never allowed in public GET
    }

    const contentList = await contentService.getContentList(query)

    logger.info('Content list fetched', {
      count: contentList.data.length,
      filters: query,
    })

    return ApiResponse.success({
      data: contentList.data,
      pagination: contentList.pagination,
      filters: contentList.filters,
    })
  } catch (error: any) {
    logger.error('Error fetching content list', { error: error.message })
    return ApiResponse.error('Failed to fetch content list', 500)
  }
}

// POST - Create content (authenticated)
export async function POST(request: AuthenticatedRequest) {
  return withRoles([
    'super_admin',
    'group_admin',
    'station_admin',
    'editor',
    'contributor',
  ])(request, async (req) => {
    try {
      const body = await req.json()
      const user = req.user!

      console.log('User is:', user)

      const validationResult = validateRequest(body, contentValidationSchema)

      if (!validationResult.valid) {
        return ApiResponse.validationError(validationResult.errors)
      }

      const contentData: ContentCreateDto = {
        ...validationResult.data,
        authorId: validationResult.data.authorId || user.userId,
      }

      // Contributors can only create drafts
      if (user.role === 'contributor' && contentData.status !== 'draft') {
        return ApiResponse.forbidden(
          'Contributors can only create draft content',
        )
      }

      const content = await contentService.createContent(contentData)

      logger.info('Content created', {
        contentId: content._id,
        userId: user.userId,
        type: content.type,
      })

      return ApiResponse.success(content, 'Content created successfully', 201)
    } catch (error: any) {
      logger.error('Error creating content', {
        error: error,
        message: error.message,
        stack: error.stack,
        userId: req.user?.userId,
      })

      if (error instanceof AppError) {
        // AppError contains a friendly message and optional details
        return ApiResponse.error(
          error.message,
          error.statusCode || 500,
          error.details,
        )
      }

      if (error.message?.includes('already exists')) {
        return ApiResponse.conflict(error.message)
      }

      return ApiResponse.error('Failed to create content', 500, error.message)
    }
  })
}
