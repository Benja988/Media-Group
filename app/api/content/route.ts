import { connectDB } from "@/lib/db";
import { requireAuth } from "@/middleware/auth";
import { listContent, createContent } from "@/services/content.service";
import { Types } from "mongoose";

export async function GET(req: Request) {
  await connectDB();
  await requireAuth(req);

  const url = new URL(req.url);

  try {
    const result = await listContent({
      stationId: url.searchParams.get("stationId")
        ? new Types.ObjectId(url.searchParams.get("stationId")!)
        : undefined,
      channelId: url.searchParams.get("channelId")
        ? new Types.ObjectId(url.searchParams.get("channelId")!)
        : undefined,
      authorId: url.searchParams.get("authorId")
        ? new Types.ObjectId(url.searchParams.get("authorId")!)
        : undefined,
      type: url.searchParams.get("type") || undefined,
      status: url.searchParams.get("status") || undefined,
      categoryId: url.searchParams.get("categoryId")
        ? new Types.ObjectId(url.searchParams.get("categoryId")!)
        : undefined,
      tagId: url.searchParams.get("tagId")
        ? new Types.ObjectId(url.searchParams.get("tagId")!)
        : undefined,
      limit: Number(url.searchParams.get("limit") || 20),
      offset: Number(url.searchParams.get("offset") || 0),
      sortBy: url.searchParams.get("sortBy") || "createdAt",
      sortOrder: url.searchParams.get("sortOrder") === "1" ? 1 : -1,
    });

    return Response.json(result);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  await connectDB();
  const payload = await requireAuth(req);

  try {
    const body = await req.json();

    const content = await createContent({
      ...body,
      authorId: new Types.ObjectId(payload.sub),
    });

    return Response.json({ data: content }, { status: 201 });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
