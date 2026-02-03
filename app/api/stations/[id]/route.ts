// api/stations/[id]/route.ts

import { connectDB } from "@/lib/db";
import {
  getStationById,
  updateStation,
  deleteStation,
} from "@/services/station.service";
import { Types } from "mongoose";


export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  
  const { id } = await params;
  
  console.log("Searching for station ID:", id);
  console.log("Is valid ObjectId?", Types.ObjectId.isValid(id));
  
  const station = await getStationById(new Types.ObjectId(id));
  console.log("Found station:", station);
  
  return Response.json(station);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params
  const body = await req.json();

  const station = await updateStation({
    id: new Types.ObjectId(id),
    ...body,
  });

  return Response.json(station);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params
  await deleteStation(new Types.ObjectId(id));
  return Response.json({ success: true });
}
