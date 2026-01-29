import { Station } from '@/lib/models'
import { Types } from 'mongoose'
import { logger } from '@/lib/logger'

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface CreateStationInput {
  mediaGroupId: Types.ObjectId
  name: string
  type: 'radio' | 'tv'
  frequency?: string
  region?: string
  logoUrl?: string
  description?: string
  status?: 'active' | 'inactive' | 'archived'
}

export interface UpdateStationInput {
  id: Types.ObjectId
  name?: string
  type?: 'radio' | 'tv'
  frequency?: string
  region?: string
  logoUrl?: string
  description?: string
  status?: 'active' | 'inactive' | 'archived'
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/* -------------------------------------------------------------------------- */
/* Create                                                                     */
/* -------------------------------------------------------------------------- */

export async function createStation(input: CreateStationInput) {
  const slug = generateSlug(input.name)

  const exists = await Station.exists({
    slug,
    mediaGroupId: input.mediaGroupId,
    deletedAt: null,
  })

  if (exists) {
    throw new Error('Station already exists in this media group')
  }

  const station = await Station.create({
    ...input,
    slug,
  })

  logger.info('Station created', {
    stationId: station._id,
    mediaGroupId: input.mediaGroupId,
  })

  return station
}

/* -------------------------------------------------------------------------- */
/* Read                                                                       */
/* -------------------------------------------------------------------------- */


export async function getStationById(id: Types.ObjectId) {
  const stationWithoutPopulate = await Station.findOne({
    _id: id,
    $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
  }).lean()

  /* console.log('Station raw data:', stationWithoutPopulate)
  console.log('mediaGroupId value:', stationWithoutPopulate?.mediaGroupId)
  console.log(
    'Is mediaGroupId valid ObjectId?',
    Types.ObjectId.isValid(stationWithoutPopulate?.mediaGroupId),
  ) */

  const station = await Station.findOne({
    _id: id,
    $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
  }).lean()

  // console.log('After populate:', station)

  return station
}

export async function getStationBySlug(
  mediaGroupId: Types.ObjectId,
  slug: string,
) {
  return Station.findOne({
    mediaGroupId,
    slug,
    deletedAt: null,
  })
    .populate('mediaGroupId', 'name')
    .lean()
}

export async function listStations({
  mediaGroupId,
  type,
  status,
  region,
  limit = 20,
  offset = 0,
  sortBy = 'createdAt',
  sortOrder = -1,
}: {
  mediaGroupId?: Types.ObjectId
  type?: 'radio' | 'tv'
  status?: 'active' | 'inactive' | 'archived'
  region?: string
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: 1 | -1
} = {}) {
  const filter: any = { deletedAt: null }

  if (mediaGroupId) filter.mediaGroupId = mediaGroupId
  if (type) filter.type = type
  if (status) filter.status = status
  if (region) filter.region = region

  return Station.find(filter)
    .populate('mediaGroupId', 'name')
    .sort({ [sortBy]: sortOrder })
    .skip(offset)
    .limit(limit)
    .lean()
}

export async function countStations(
  filter: {
    mediaGroupId?: Types.ObjectId
    status?: string
    type?: string
  } = {},
) {
  return Station.countDocuments({
    ...filter,
    deletedAt: null,
  })
}

/* -------------------------------------------------------------------------- */
/* Update                                                                     */
/* -------------------------------------------------------------------------- */

export async function updateStation(input: UpdateStationInput) {
  const { id, name, ...rest } = input

  const station = await Station.findOne({ _id: id, deletedAt: null })
  if (!station) {
    throw new Error('Station not found')
  }

  if (name && name !== station.name) {
    const slug = generateSlug(name)

    const exists = await Station.exists({
      slug,
      mediaGroupId: station.mediaGroupId,
      _id: { $ne: id },
      deletedAt: null,
    })

    if (exists) {
      throw new Error(
        'Station with this name already exists in this media group',
      )
    }

    station.name = name
    // slug is immutable — DO NOT update it
  }

  Object.assign(station, rest)
  await station.save()

  logger.info('Station updated', { stationId: id })
  return station
}

/* -------------------------------------------------------------------------- */
/* Delete / Archive                                                           */
/* -------------------------------------------------------------------------- */

export async function archiveStation(id: Types.ObjectId) {
  const station = await Station.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { status: 'archived' },
    { new: true },
  )

  if (!station) throw new Error('Station not found')
  return station
}

export async function restoreStation(id: Types.ObjectId) {
  const station = await Station.findByIdAndUpdate(
    id,
    { status: 'active' },
    { new: true },
  )

  if (!station) throw new Error('Station not found')
  return station
}

export async function deleteStation(id: Types.ObjectId) {
  const station = await Station.findOneAndUpdate(
    { _id: id, deletedAt: null },
    {
      deletedAt: new Date(),
      status: 'archived',
    },
    { new: true },
  )

  if (!station) throw new Error('Station not found')

  logger.info('Station soft-deleted', { stationId: id })
  return station
}
