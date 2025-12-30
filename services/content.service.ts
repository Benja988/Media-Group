import { Content } from "@/lib/models";
import { Types } from "mongoose";
import { logger } from "@/lib/logger";

interface CreateContentInput {
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

interface UpdateContentInput extends Partial<CreateContentInput> {
    id: Types.ObjectId;
    slug?: string;
}

export async function createContent(input: CreateContentInput) {
    const slug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    // Check for unique slug within station
    const existing = await Content.findOne({ slug, stationId: input.stationId });
    if (existing) {
        throw new Error("Content with this title already exists in this station");
    }

    const content = await Content.create({
        ...input,
        slug,
    });

    logger.info("Content created", { contentId: content._id, title: content.title });
    return content;
}

export async function getContentById(id: Types.ObjectId) {
    return Content.findById(id)
        .populate('stationId', 'name')
        .populate('channelId', 'name')
        .populate('authorId', 'name email')
        .populate('categoryIds', 'name')
        .populate('tagIds', 'name')
        .lean();
}

export async function updateContent(input: UpdateContentInput) {
    const { id, ...updateData } = input;

    if (updateData.title) {
        const slug = updateData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        updateData.slug = slug;

        const existing = await Content.findOne({
            slug,
            stationId: updateData.stationId || (await Content.findById(id)).stationId,
            _id: { $ne: id }
        });
        if (existing) {
            throw new Error("Content with this title already exists in this station");
        }
    }

    const content = await Content.findByIdAndUpdate(id, updateData, { new: true });
    if (!content) {
        throw new Error("Content not found");
    }

    logger.info("Content updated", { contentId: content._id });
    return content;
}

export async function deleteContent(id: Types.ObjectId) {
    const content = await Content.findByIdAndDelete(id);
    if (!content) {
        throw new Error("Content not found");
    }

    logger.info("Content deleted", { contentId: content._id });
    return content;
}

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
    sortBy = 'createdAt',
    sortOrder = -1,
}: {
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
} = {}) {
    const filter: any = {};
    if (stationId) filter.stationId = stationId;
    if (channelId) filter.channelId = channelId;
    if (authorId) filter.authorId = authorId;
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (categoryId) filter.categoryIds = categoryId;
    if (tagId) filter.tagIds = tagId;

    const sort: any = {};
    sort[sortBy] = sortOrder;

    return Content.find(filter)
        .populate('stationId', 'name')
        .populate('channelId', 'name')
        .populate('authorId', 'name email')
        .populate('categoryIds', 'name')
        .populate('tagIds', 'name')
        .sort(sort)
        .limit(limit)
        .skip(offset)
        .lean();
}

export async function publishContent(contentId: Types.ObjectId) {
    const content = await Content.findById(contentId);

    if (!content) {
        throw new Error("Content not found");
    }

    if (content.status === "published") {
        throw new Error("Content already published");
    }

    content.status = "published";
    content.publishedAt = new Date();

    return content.save();
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
    return Content.find({ stationId, status: "published", ...(type && { type }) })
        .sort({ publishedAt: -1 })
        .limit(limit)
        .lean();
}