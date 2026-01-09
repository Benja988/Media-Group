import { connectDB } from "@/lib/db";
import { requireAuth } from "@/middleware/auth";
import {
  getContentById,
  updateContent,
  deleteContent,
} from "@/services/content.service";
import { Types } from "mongoose";

interface Params {
  params: { id: string };
}

export async function GET(_: Request, { params }: Params) {
  await connectDB();
  await requireAuth(_);

  const content = await getContentById(new Types.ObjectId(params.id));
  return Response.json({ data: content });
}

export async function PUT(req: Request, { params }: Params) {
  await connectDB();
  await requireAuth(req);

  const body = await req.json();

  const content = await updateContent({
    id: new Types.ObjectId(params.id),
    ...body,
  });

  return Response.json({ data: content });
}

export async function DELETE(_: Request, { params }: Params) {
  await connectDB();
  await requireAuth(_);

  await deleteContent(new Types.ObjectId(params.id));
  return Response.json({ success: true });
}
