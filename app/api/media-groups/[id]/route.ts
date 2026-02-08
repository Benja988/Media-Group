// api/media-groups/[id]/route.ts

import { connectDB } from "@/lib/db";
import {
  getMediaGroupById,
  updateMediaGroup,
  deleteMediaGroup,
} from "@/services/mediaGroup.service";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const mediaGroup = await getMediaGroupById(id);
  return Response.json(mediaGroup);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const body = await req.json();

  const mediaGroup = await updateMediaGroup({
    id: id,
    ...body,
  });

  return Response.json(mediaGroup);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  await deleteMediaGroup(id);
  return Response.json({ success: true });
}
