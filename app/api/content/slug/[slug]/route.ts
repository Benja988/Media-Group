import { connectDB } from "@/lib/db";
import { getContentBySlug } from "@/services/content.service";
import { Types } from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  await connectDB();

  const stationId = new URL(req.url).searchParams.get("stationId");
  if (!stationId) {
    return Response.json({ error: "stationId required" }, { status: 400 });
  }

  const content = await getContentBySlug(
    params.slug,
    new Types.ObjectId(stationId)
  );

  return Response.json({ data: content });
}
