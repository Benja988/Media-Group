// api/media-groups/[id]/route.ts

import { connectDB } from "@/lib/db";
import {
  getMediaGroupById,
  updateMediaGroup,
  deleteMediaGroup,
} from "@/services/mediaGroup.service";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const mediaGroup = await getMediaGroupById(params.id);
  return Response.json(mediaGroup);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const body = await req.json();

  const mediaGroup = await updateMediaGroup({
    id: params.id,
    ...body,
  });

  return Response.json(mediaGroup);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await deleteMediaGroup(params.id);
  return Response.json({ success: true });
}
