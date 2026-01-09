// services/content.services.ts

import { Content } from "@/lib/models";
import { Types } from "mongoose";
import { logger } from "@/lib/logger";


/* ----------------------------------
   Types
----------------------------------- */
export interface CreateContentInput {
  type: "news" | "podcast" | "video" | "show";
  title: string;
  description?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  stationId: Types.ObjectId;
  channelId?: Types.ObjectId;
  authorId: Types.ObjectId;
  categoryIds?: Types.ObjectId[];
  tagIds?: Types.ObjectId[];
  status?: "draft" | "scheduled" | "published";
  scheduledFor?: Date;
}

export interface UpdateContentInput extends Partial<CreateContentInput> {
  id: Types.ObjectId;
  slug?: string;
}

export interface ListContentParams {
  stationId?: Types.ObjectId;
  channelId?: Types.ObjectId;
  authorId?: Types.ObjectId;
  type?: string;
  status?: string;
  categoryId?: Types.ObjectId;
  tagId?: Types.ObjectId;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 1 | -1;
}




/* ----------------------------------
   Helpers
----------------------------------- */

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function ensureUniqueSlug(
  slug: string,
  stationId: Types.ObjectId,
  excludeId?: Types.ObjectId
) {
  const query: any = { slug, stationId };
  if (excludeId) query._id = { $ne: excludeId };

  const exists = await Content.findOne(query);
  if (exists) {
    throw new Error("Content with this title already exists in this station");
  }
}

/* ----------------------------------
   Create
----------------------------------- */

export async function createContent(input: CreateContentInput) {
  const slug = generateSlug(input.title);
  await ensureUniqueSlug(slug, input.stationId);

  const content = await Content.create({
    ...input,
    slug,
    status: input.status ?? "draft",
  });

  logger.info("Content created", { id: content._id });
  return content;
}

/* ----------------------------------
   Read
----------------------------------- */

export async function getContentById(id: Types.ObjectId) {
  return Content.findById(id)
    .populate("stationId", "name")
    .populate("channelId", "name")
    .populate("authorId", "name email")
    .populate("categoryIds", "name")
    .populate("tagIds", "name")
    .lean();
}

export async function getContentBySlug(
  slug: string,
  stationId: Types.ObjectId
) {
  return Content.findOne({ slug, stationId, status: "published" })
    .populate("authorId", "name")
    .populate("categoryIds", "name")
    .lean();
}

/* ----------------------------------
   Update
----------------------------------- */

export async function updateContent(input: UpdateContentInput) {
  const { id, ...updateData } = input;

  if (updateData.title) {
    const slug = generateSlug(updateData.title);
    const content = await Content.findById(id).select("stationId");
    if (!content) throw new Error("Content not found");

    await ensureUniqueSlug(slug, content.stationId, id);
    updateData.slug = slug;
  }

  const updated = await Content.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (!updated) throw new Error("Content not found");

  logger.info("Content updated", { id });
  return updated;
}

/* ----------------------------------
   Delete
----------------------------------- */

export async function deleteContent(id: Types.ObjectId) {
  const deleted = await Content.findByIdAndDelete(id);
  if (!deleted) throw new Error("Content not found");

  logger.info("Content deleted", { id });
  return deleted;
}

/* ----------------------------------
   Listing & Feed
----------------------------------- */

export async function listContent({
  stationId,
  channelId,
  authorId,
  type,
  status,
  categoryId,
  tagId,
  limit = 20,
  offset = 0,
  sortBy = "createdAt",
  sortOrder = -1,
}: ListContentParams = {}) {
  const filter: any = {
    ...(stationId && { stationId }),
    ...(channelId && { channelId }),
    ...(authorId && { authorId }),
    ...(type && { type }),
    ...(status && { status }),
    ...(categoryId && { categoryIds: categoryId }),
    ...(tagId && { tagIds: tagId }),
  };

  const [items, total] = await Promise.all([
    Content.find(filter)
      .populate("authorId", "name")
      .sort({ [sortBy]: sortOrder })
      .limit(limit)
      .skip(offset)
      .lean(),
    Content.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  };
}

export async function getPublishedFeed({
  stationId,
  type,
  limit = 20,
}: {
  stationId: Types.ObjectId;
  type?: string;
  limit?: number;
}) {
  return Content.find({
    stationId,
    status: "published",
    ...(type && { type }),
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();
}

/* ----------------------------------
   Publishing
----------------------------------- */

export async function publishContent(contentId: Types.ObjectId) {
  const content = await Content.findById(contentId);

  if (!content) throw new Error("Content not found");
  if (content.status === "published") {
    throw new Error("Content already published");
  }

  if (
    ["video", "podcast"].includes(content.type) &&
    !content.mediaUrl
  ) {
    throw new Error("Media URL is required before publishing");
  }

  content.status = "published";
  content.publishedAt = new Date();
  content.scheduledFor = undefined;

  return content.save();
}

/**
 * Cron job friendly
 */
export async function publishScheduledContent() {
  const now = new Date();

  const result = await Content.updateMany(
    {
      status: "scheduled",
      scheduledFor: { $lte: now },
    },
    {
      $set: {
        status: "published",
        publishedAt: now,
      },
      $unset: { scheduledFor: "" },
    }
  );

  logger.info("Scheduled content published", { count: result.modifiedCount });
  return result.modifiedCount;
}

/* ----------------------------------
   Metrics
----------------------------------- */

export async function incrementViews(contentId: Types.ObjectId) {
  return Content.findByIdAndUpdate(
    contentId,
    { $inc: { "metrics.views": 1 } },
    { new: true }
  );
}

export async function toggleLike(contentId: Types.ObjectId, increment = true) {
  return Content.findByIdAndUpdate(
    contentId,
    { $inc: { "metrics.likes": increment ? 1 : -1 } },
    { new: true }
  );
}

/* ----------------------------------
   Discovery
----------------------------------- */

export async function getRelatedContent(
  contentId: Types.ObjectId,
  limit = 6
) {
  const content = await Content.findById(contentId).select(
    "categoryIds stationId"
  );
  if (!content) return [];

  return Content.find({
    _id: { $ne: contentId },
    stationId: content.stationId,
    categoryIds: { $in: content.categoryIds },
    status: "published",
  })
    .limit(limit)
    .lean();
}
