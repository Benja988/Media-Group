import { connectDB } from "@/lib/db";
import {
  getStationById,
  updateStation,
  deleteStation,
} from "@/services/station.service";
import { Types } from "mongoose";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const station = await getStationById(new Types.ObjectId(params.id));
  return Response.json(station);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const body = await req.json();

  const station = await updateStation({
    id: new Types.ObjectId(params.id),
    ...body,
  });

  return Response.json(station);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await deleteStation(new Types.ObjectId(params.id));
  return Response.json({ success: true });
}
