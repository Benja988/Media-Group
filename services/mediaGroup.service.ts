import { MediaGroup } from "@/lib/models";

export async function createMediaGroup(data: { name: string; slug: string; description?: string; logoUrl?: string; })
{
    const exists = await MediaGroup.findOne({ slug: data.slug });
    if (exists) {
        throw new Error("Media group with this slug already exists");
    }
    return MediaGroup.create(data);
}

export async function getActiveMediaGroups()
{
    return MediaGroup.find({ status: "active" }).lean();
}