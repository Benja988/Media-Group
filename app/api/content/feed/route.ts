import { connectDB } from "@/lib/db";
import { getPublishedFeed } from "@/services/content.service";
import { Types } from "mongoose";

export async function GET(req: Request) {
  await connectDB();

  const url = new URL(req.url);
  const stationId = url.searchParams.get("stationId");
  const type = url.searchParams.get("type") || undefined;

  if (!stationId) {
    return Response.json({ error: "stationId required" }, { status: 400 });
  }

  const feed = await getPublishedFeed({
    stationId: new Types.ObjectId(stationId),
    type,
  });

  return Response.json({ data: feed });
}
