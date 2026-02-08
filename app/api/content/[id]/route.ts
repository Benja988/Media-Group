// app/api/content/[id]/route.ts

import { NextRequest } from 'next/server'
import { contentService } from '@/services/content.service'
import { ContentUpdateDto } from '@/types/content.types'
import { ApiResponse } from '@/lib/api/response'
import { withAuth, AuthenticatedRequest } from '@/lib/api/middleware'
import { validateRequest, contentValidationSchema } from '@/lib/api/validation'
import { logger } from '@/lib/logger'


interface RouteParams {
  params: Promise<{ id: string }>
}


export async function GET(
  request: NextRequest,
  { params }: RouteParams,
) {
  const { id } = await params

  try {
    const searchParams = request.nextUrl.searchParams

    const includeEngagement = searchParams.get('includeEngagement') === 'true'
      
    const incrementView = searchParams.get('incrementView') !== 'false'
      
    const content = await contentService.getContentById(
      id,
      includeEngagement,
      incrementView,
    )

    logger.info('Content fetched', { contentId: id })

    return ApiResponse.success(content)
  } catch (error: any) {
    logger.error('Error fetching content', {
      contentId: id,
      error: error.message,
    })

    if (error.message.includes('not found')) {
      return ApiResponse.notFound(error.message)
    }

    return ApiResponse.error('Failed to fetch content', 500)
  }
}


export async function PUT(
  request: AuthenticatedRequest,
  { params }: RouteParams,
) {
  return withAuth(request, async (req) => {
    const { id } = await params

    try {
      const user = req.user!
      const body = await req.json()

      const existingContent = await contentService.getContentById(
        id,
        false,
        false,
      )

      /* ---------------- permissions ---------------- */

      const isOwner = existingContent.authorId === user.userId
      const isSuperAdmin = user.role === 'super_admin'
      const isGroupAdmin = user.role === 'group_admin'
      const isStationAdmin = user.role === 'station_admin'
      const isEditor = user.role === 'editor'

      let canEdit = false

      if (isSuperAdmin) canEdit = true
      else if (isGroupAdmin || isStationAdmin) canEdit = true
      else if (isEditor)
        canEdit = existingContent.status !== 'published' || isOwner
      else if (isOwner) canEdit = true

      if (!canEdit) return ApiResponse.forbidden()

      /* ---------------- validation ---------------- */

      const updateSchema = { ...contentValidationSchema }

      if (updateSchema.type) delete updateSchema.type.required
      if (updateSchema.title) delete updateSchema.title.required

      const validationResult = validateRequest(body, updateSchema)

      if (!validationResult.valid) {
        return ApiResponse.validationError(validationResult.errors)
      }

      if (
        body.authorId &&
        body.authorId !== existingContent.authorId &&
        !isSuperAdmin
      ) {
        return ApiResponse.forbidden(
          'Only super admin can change content author',
        )
      }

      if (
        user.role === 'contributor' &&
        existingContent.status !== 'draft'
      ) {
        return ApiResponse.forbidden(
          'Contributors can only update draft content',
        )
      }

      const contentData: ContentUpdateDto = validationResult.data

      const content = await contentService.updateContent(id, contentData)

      logger.info('Content updated', {
        contentId: id,
        userId: user.userId,
        updates: Object.keys(contentData),
      })

      return ApiResponse.success(content, 'Content updated successfully')
    } catch (error: any) {
      logger.error('Error updating content', {
        contentId: id,
        userId: req.user?.userId,
        error: error.message,
      })

      if (error.message.includes('not found')) {
        return ApiResponse.notFound(error.message)
      }

      return ApiResponse.error('Failed to update content', 500)
    }
  })
}

/* -------------------------------------------------------------------------- */
/*                                  DELETE                                    */
/* -------------------------------------------------------------------------- */

export async function DELETE(
  request: AuthenticatedRequest,
  { params }: RouteParams,
) {
  return withAuth(request, async (req) => {
    const { id } = await params

    try {
      const user = req.user!

      const existingContent = await contentService.getContentById(
        id,
        false,
        false,
      )

      const isOwner = existingContent.authorId === user.userId
      const isSuperAdmin = user.role === 'super_admin'
      const isGroupAdmin = user.role === 'group_admin'
      const isStationAdmin = user.role === 'station_admin'

      let canDelete = false

      if (isSuperAdmin) canDelete = true
      else if (isGroupAdmin || isStationAdmin) canDelete = true
      else if (isOwner && existingContent.status === 'draft')
        canDelete = true

      if (!canDelete) return ApiResponse.forbidden()

      await contentService.deleteContent(id)

      logger.info('Content deleted', {
        contentId: id,
        userId: user.userId,
      })

      return ApiResponse.success(null, 'Content deleted successfully')
    } catch (error: any) {
      logger.error('Error deleting content', {
        contentId: id,
        userId: req.user?.userId,
        error: error.message,
      })

      if (error.message.includes('not found')) {
        return ApiResponse.notFound(error.message)
      }

      return ApiResponse.error('Failed to delete content', 500)
    }
  })
}
