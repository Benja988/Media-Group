import { connectDB } from "@/lib/db";
import { restoreMediaGroup } from "@/services/mediaGroup.service";

export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const mediaGroup = await restoreMediaGroup(id);
  return Response.json(mediaGroup);
}
