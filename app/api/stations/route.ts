import { connectDB } from "@/lib/db";
import { listStations, createStation } from "@/services/station.service";

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
