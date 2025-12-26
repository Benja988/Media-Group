// app/api/content/route.ts

import { connectDB } from "@/lib/db";
import { requireAuth } from "@/middleware/auth";
import {
    createContent,
    getContentById,
    updateContent,
    deleteContent,
    listContent,
    publishContent
} from "@/services/content.service";
import { Types } from "mongoose";

export async function GET(req: Request) {
    await connectDB();
    await requireAuth(req);

    const url = new URL(req.url);
    const stationId = url.searchParams.get('stationId') || undefined;
    const channelId = url.searchParams.get('channelId') || undefined;
    const authorId = url.searchParams.get('authorId') || undefined;
    const type = url.searchParams.get('type') || undefined;
    const status = url.searchParams.get('status') || undefined;
    const categoryId = url.searchParams.get('categoryId') || undefined;
    const tagId = url.searchParams.get('tagId') || undefined;
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') === '1' ? 1 : -1;

    try {
        const contents = await listContent({
            stationId: stationId ? new Types.ObjectId(stationId) : undefined,
            channelId: channelId ? new Types.ObjectId(channelId) : undefined,
            authorId: authorId ? new Types.ObjectId(authorId) : undefined,
            type,
            status,
            categoryId: categoryId ? new Types.ObjectId(categoryId) : undefined,
            tagId: tagId ? new Types.ObjectId(tagId) : undefined,
            limit,
            offset,
            sortBy,
            sortOrder,
        });

        return Response.json({ data: contents });
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 });
    }
}

export async function POST(req: Request) {
    await connectDB();
    const payload = await requireAuth(req);

    const body = await req.json();

    try {
        const content = await createContent({
            ...body,
            authorId: new Types.ObjectId(payload.sub),
        });

        return Response.json({ data: content }, { status: 201 });
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
        return Response.json({ error: "Content ID required" }, { status: 400 });
    }

    const body = await req.json();

    try {
        const content = await updateContent({
            id: new Types.ObjectId(id),
            ...body,
        });

        return Response.json({ data: content });
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
        return Response.json({ error: "Content ID required" }, { status: 400 });
    }

    try {
        await deleteContent(new Types.ObjectId(id));
        return Response.json({ success: true });
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 });
    }
}

// Additional endpoint for publishing
export async function PATCH(req: Request) {
    await connectDB();
    await requireAuth(req);

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const action = url.searchParams.get('action');

    if (!id) {
        return Response.json({ error: "Content ID required" }, { status: 400 });
    }

    try {
        if (action === 'publish') {
            const content = await publishContent(new Types.ObjectId(id));
            return Response.json({ data: content });
        }

        return Response.json({ error: "Invalid action" }, { status: 400 });
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 });
    }
}