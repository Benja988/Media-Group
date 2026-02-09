import { connectDB } from "@/lib/db";
import { listStations } from "@/services/station.service";
import { Types } from "mongoose";
import { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;

  const stations = await listStations({
    mediaGroupId: new Types.ObjectId(id),
  });

  return Response.json(stations);
}
