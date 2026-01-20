import { connectDB } from "@/lib/db";
import { requireAuth } from "@/middleware/auth";
import {
  listMediaGroups,
  createMediaGroup,
} from "@/services/mediaGroup.service";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const mediaGroups = await listMediaGroups({
    status: searchParams.get("status") as any,
  });

  return Response.json(mediaGroups);
}

export async function POST(req: Request) {
  await connectDB();
  await requireAuth(req);

  const body = await req.json();

  const mediaGroup = await createMediaGroup(body);
  return Response.json(mediaGroup, { status: 201 });
}
