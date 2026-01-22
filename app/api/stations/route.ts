import { connectDB } from "@/lib/db";
import { listStations, createStation, deleteStation } from "@/services/station.service";
import { Types } from "mongoose";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const data = await listStations({
    mediaGroupId: searchParams.get("mediaGroupId") as any,
    type: searchParams.get("type") as any,
    status: searchParams.get("status") as any,
    region: searchParams.get("region") ?? undefined,
  });

  return Response.json(data);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const station = await createStation(body);
  return Response.json(station, { status: 201 });
}

export async function DELETE(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id || !Types.ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid station id" }, { status: 400 });
  }

  const station = await deleteStation(new Types.ObjectId(id));
  return Response.json(station);
}
