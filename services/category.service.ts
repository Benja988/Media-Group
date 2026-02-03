// services/category.service.ts
import { Category } from '@/lib/models'
import { Types } from 'mongoose'

export async function createCategory(data: any) {
  return Category.create(data)
}

export async function listCategories(params: {
  type?: string
  isActive?: boolean
  parentId?: Types.ObjectId | null
  search?: string
}) {
  const filter: any = {}

  if (params.type) {
    filter.type = params.type.toLowerCase()
  }

  if (params.isActive !== undefined) {
    filter.isActive = params.isActive
  }

  // IMPORTANT: explicitly handle null
  if (params.parentId === null) {
    filter.parentId = null
  } else if (params.parentId) {
    filter.parentId = params.parentId
  }

  if (params.search) {
    filter.$text = { $search: params.search }
  }

  // 🔍 DEBUG LOGS
  console.log('📂 Category list filter:', JSON.stringify(filter, null, 2))

  const results = await Category.find(filter)
    .sort({ order: 1, createdAt: -1 })
    .lean()

  console.log('📊 Categories found:', results.length)

  return results
}

export async function getCategoryById(id: Types.ObjectId) {
  return Category.findById(id)
}

export async function updateCategory(data: {
  id: Types.ObjectId
  [key: string]: any
}) {
  const { id, ...update } = data
  return Category.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  })
}

export async function deleteCategory(id: Types.ObjectId) {
  return Category.findByIdAndUpdate(id, { isActive: false }, { new: true })
}
