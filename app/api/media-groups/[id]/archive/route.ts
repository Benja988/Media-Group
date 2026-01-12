import { connectDB } from "@/lib/db";
import { archiveMediaGroup } from "@/services/mediaGroup.service";

export async function POST(
  _: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const mediaGroup = await archiveMediaGroup(params.id);
  return Response.json(mediaGroup);
}
