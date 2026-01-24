// media-groups/slug/[slug]/route.ts

import { connectDB } from "@/lib/db";
import { getMediaGroupBySlug } from "@/services/mediaGroup.service";

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  await connectDB();
  const mediaGroup = await getMediaGroupBySlug(params.slug);
  return Response.json(mediaGroup);
}

