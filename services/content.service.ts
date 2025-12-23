import { Content } from "@/lib/models";
import { Types } from "mongoose";

export async function publishContent(contentId: Types.ObjectId) {
    const content = await Content.findById(contentId);

    if (!content) {
        throw new Error("Content not found");
    }

    if (content.status === "published" ) {
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
    return Content.find({ stationId, status: "published", ...(type && { type }), })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();
}