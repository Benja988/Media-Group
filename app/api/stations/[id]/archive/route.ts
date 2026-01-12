import { connectDB } from "@/lib/db";
import { archiveStation } from "@/services/station.service";
import { Types } from "mongoose";

export async function POST(
  _: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const station = await archiveStation(new Types.ObjectId(params.id));
  return Response.json(station);
}
