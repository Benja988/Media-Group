import { connectDB } from "@/lib/db";
import { getStationBySlug } from "@/services/station.service";
import { Types } from "mongoose";
import { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; slug: string }> }
) {
  await connectDB();

  const { id, slug } = await params;

  const station = await getStationBySlug(
    new Types.ObjectId(id),
    slug
  );

  return Response.json(station);
}
