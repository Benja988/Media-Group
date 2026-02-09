// media-groups/slug/[slug]/route.ts

import { connectDB } from "@/lib/db";
import { getMediaGroupBySlug } from "@/services/mediaGroup.service";
import { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  await connectDB();

  const { slug } = await params;

  const mediaGroup = await getMediaGroupBySlug(slug);

  return Response.json(mediaGroup);
}

