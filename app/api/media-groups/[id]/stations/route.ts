import { connectDB } from "@/lib/db";
import { listStations } from "@/services/station.service";
import { Types } from "mongoose";

export async function GET(
  _: Request,
  { params }: { params: { mediaGroupId: string } }
) {
  await connectDB();

  const stations = await listStations({
    mediaGroupId: new Types.ObjectId(params.mediaGroupId),
  });

  return Response.json(stations);
}
