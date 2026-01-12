import { connectDB } from "@/lib/db";
import { restoreMediaGroup } from "@/services/mediaGroup.service";

export async function POST(
  _: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const mediaGroup = await restoreMediaGroup(params.id);
  return Response.json(mediaGroup);
}
