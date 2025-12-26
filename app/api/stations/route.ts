import { connectDB } from "@/lib/db";
import { requireAuth } from "@/middleware/auth";
import {
    createStation,
    getStationById,
    updateStation,
    deleteStation,
    listStations
} from "@/services/station.service";
import { Types } from "mongoose";

export async function GET(req: Request) {
    await connectDB();
    await requireAuth(req);

    const url = new URL(req.url);
    const mediaGroupId = url.searchParams.get('mediaGroupId') || undefined;
    const type = url.searchParams.get('type') || undefined;
    const status = url.searchParams.get('status') || undefined;
    const region = url.searchParams.get('region') || undefined;
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') === '1' ? 1 : -1;

    try {
        const stations = await listStations({
            mediaGroupId: mediaGroupId ? new Types.ObjectId(mediaGroupId) : undefined,
            type,
            status,
            region,
            limit,
            offset,
            sortBy,
            sortOrder,
        });

        return Response.json({ data: stations });
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 });
    }
}

export async function POST(req: Request) {
    await connectDB();
    const payload = await requireAuth(req);

    const body = await req.json();

    try {
        const station = await createStation(body);
        return Response.json({ data: station }, { status: 201 });
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 });
    }
}

export async function PUT(req: Request) {
    await connectDB();
    await requireAuth(req);

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
        return Response.json({ error: "Station ID required" }, { status: 400 });
    }

    const body = await req.json();

    try {
        const station = await updateStation({
            id: new Types.ObjectId(id),
            ...body,
        });

        return Response.json({ data: station });
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 });
    }
}

export async function DELETE(req: Request) {
    await connectDB();
    await requireAuth(req);

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
        return Response.json({ error: "Station ID required" }, { status: 400 });
    }

    try {
        await deleteStation(new Types.ObjectId(id));
        return Response.json({ success: true });
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 });
    }
}