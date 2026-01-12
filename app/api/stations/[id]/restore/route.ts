import { connectDB } from "@/lib/db";
import { restoreStation } from "@/services/station.service";
import { Types } from "mongoose";

export async function POST(
  _: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const station = await restoreStation(new Types.ObjectId(params.id));
  return Response.json(station);
}
