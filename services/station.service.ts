import { Station } from "@/lib/models";
import { Types } from "mongoose";
import { logger } from "@/lib/logger";

interface CreateStationInput {
    mediaGroupId: Types.ObjectId;
    name: string;
    type: "radio" | "tv";
    frequency?: string;
    region?: string;
    logoUrl?: string;
    description?: string;
    status?: "active" | "inactive" | "archived";
}

interface UpdateStationInput extends Partial<CreateStationInput> {
    id: Types.ObjectId;
    slug?: string;
}

export async function createStation(input: CreateStationInput) {
    const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    const exists = await Station.findOne({
        slug,
        mediaGroupId: input.mediaGroupId,
    });

    if (exists) {
        throw new Error("Station already exists in this media group");
    }

    const station = await Station.create({
        ...input,
        slug,
    });

    logger.info("Station created", { stationId: station._id, name: station.name });
    return station;
}

export async function getStationById(id: Types.ObjectId) {
    return Station.findById(id)
        .populate('mediaGroupId', 'name')
        .lean();
}

export async function updateStation(input: UpdateStationInput) {
    const { id, ...updateData } = input;

    if (updateData.name) {
        const slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        updateData.slug = slug;

        const existing = await Station.findOne({
            slug,
            mediaGroupId: updateData.mediaGroupId || (await Station.findById(id)).mediaGroupId,
            _id: { $ne: id }
        });
        if (existing) {
            throw new Error("Station with this name already exists in this media group");
        }
    }

    const station = await Station.findByIdAndUpdate(id, updateData, { new: true });
    if (!station) {
        throw new Error("Station not found");
    }

    logger.info("Station updated", { stationId: station._id });
    return station;
}

export async function deleteStation(id: Types.ObjectId) {
    const station = await Station.findByIdAndUpdate(id, { deletedAt: new Date() });
    if (!station) {
        throw new Error("Station not found");
    }

    logger.info("Station deleted", { stationId: station._id });
    return station;
}

export async function listStations({
    mediaGroupId,
    type,
    status = "active",
    region,
    limit = 20,
    offset = 0,
    sortBy = 'createdAt',
    sortOrder = -1,
}: {
    mediaGroupId?: Types.ObjectId;
    type?: string;
    status?: string;
    region?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 1 | -1;
} = {}) {
    const filter: any = { deletedAt: null };
    if (mediaGroupId) filter.mediaGroupId = mediaGroupId;
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (region) filter.region = region;

    const sort: any = {};
    sort[sortBy] = sortOrder;

    return Station.find(filter)
        .populate('mediaGroupId', 'name')
        .sort(sort)
        .limit(limit)
        .skip(offset)
        .lean();
}

export async function getStationsByMediaGroup(mediaGroupId: Types.ObjectId) {
    return Station.find({
        mediaGroupId,
        status: "active",
        deletedAt: null,
    }).lean();
}