import { MediaGroup } from "@/lib/models";
import { logger } from "@/lib/logger";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface CreateMediaGroupInput {
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
    websiteUrl?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  status?: "active" | "inactive" | "archived";
}

export interface UpdateMediaGroupInput
  extends Omit<CreateMediaGroupInput, "slug"> {
  id: string;
}

/* -------------------------------------------------------------------------- */
/* Create                                                                     */
/* -------------------------------------------------------------------------- */

export async function createMediaGroup(data: CreateMediaGroupInput) {
  const exists = await MediaGroup.exists({
    slug: data.slug,
    deletedAt: null,
  });

  if (exists) {
    throw new Error("Media group with this slug already exists");
  }

  const mediaGroup = await MediaGroup.create(data);

  logger.info("MediaGroup created", { mediaGroupId: mediaGroup._id });
  return mediaGroup;
}

/* -------------------------------------------------------------------------- */
/* Read                                                                       */
/* -------------------------------------------------------------------------- */

export async function getMediaGroupById(id: string) {
  return MediaGroup.findOne({
    _id: id,
    deletedAt: null,
  }).lean();
}

export async function getMediaGroupBySlug(slug: string) {
  return MediaGroup.findOne({
    slug,
    deletedAt: null,
  }).lean();
}

export async function listMediaGroups({
  status,
  limit = 20,
  offset = 0,
  sortBy = "createdAt",
  sortOrder = -1,
}: {
  status?: "active" | "inactive" | "archived";
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 1 | -1;
} = {}) {
  const filter: any = { deletedAt: null };
  if (status) filter.status = status;

  return MediaGroup.find(filter)
    .sort({ [sortBy]: sortOrder })
    .skip(offset)
    .limit(limit)
    .lean();
}

export async function getActiveMediaGroups() {
  return MediaGroup.find({
    status: "active",
    deletedAt: null,
  }).lean();
}

export async function countMediaGroups(filter: {
  status?: string;
} = {}) {
  return MediaGroup.countDocuments({
    ...filter,
    deletedAt: null,
  });
}

/* -------------------------------------------------------------------------- */
/* Update                                                                     */
/* -------------------------------------------------------------------------- */

export async function updateMediaGroup(input: UpdateMediaGroupInput) {
  const { id, ...updateData } = input;

  const mediaGroup = await MediaGroup.findOne({
    _id: id,
    deletedAt: null,
  });

  if (!mediaGroup) {
    throw new Error("Media group not found");
  }

  Object.assign(mediaGroup, updateData);
  await mediaGroup.save();

  logger.info("MediaGroup updated", { mediaGroupId: id });
  return mediaGroup;
}

/* -------------------------------------------------------------------------- */
/* Archive / Restore / Delete                                                  */
/* -------------------------------------------------------------------------- */

export async function archiveMediaGroup(id: string) {
  const mediaGroup = await MediaGroup.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { status: "archived" },
    { new: true }
  );

  if (!mediaGroup) throw new Error("Media group not found");
  return mediaGroup;
}

export async function restoreMediaGroup(id: string) {
  const mediaGroup = await MediaGroup.findByIdAndUpdate(
    id,
    { status: "active" },
    { new: true }
  );

  if (!mediaGroup) throw new Error("Media group not found");
  return mediaGroup;
}

export async function deleteMediaGroup(id: string) {
  const mediaGroup = await MediaGroup.findOneAndUpdate(
    { _id: id, deletedAt: null },
    {
      deletedAt: new Date(),
      status: "archived",
    },
    { new: true }
  );

  if (!mediaGroup) throw new Error("Media group not found");

  logger.info("MediaGroup soft-deleted", { mediaGroupId: id });
  return mediaGroup;
}
