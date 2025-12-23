import { Station } from "@/lib/models";
import { Types } from "mongoose";

export async function createStation(
    data: { 
        mediaGroupId: Types.ObjectId; 
        name: string; 
        slug: string;  
        type: "rdaio" | "tv"; 
        frequency?: string; 
        region?: string
    }) {
    const exists = await Station.findOne({
        slug: data.slug,
        mediaGroupId: data.mediaGroupId,
    });

    if (exists) {
        throw new Error("Station already exists in this media group");
    }

    return Station.create(data);
}


export async function getStationsByMediaGroup(
    mediaGroupId: Types.ObjectId
) {
    return Station.find({
        mediaGroupId,
        status: "active",
    }).lean();
}