import { connectDB } from "@/lib/db";
import { archiveStation } from "@/services/station.service";
import { Types } from "mongoose";

export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const station = await archiveStation(new Types.ObjectId(id));
  return Response.json(station);
}
