import { connectDB } from "@/lib/db";
import { getStationBySlug } from "@/services/station.service";
import { Types } from "mongoose";

export async function GET(
  _: Request,
  {
    params,
  }: { params: { mediaGroupId: string; slug: string } }
) {
  await connectDB();

  const station = await getStationBySlug(
    new Types.ObjectId(params.mediaGroupId),
    params.slug
  );

  return Response.json(station);
}
