/* import { connectDB } from "@/lib/db";
import { requireAuth } from "@/middleware/auth";
import { toggleLike } from "@/services/content.service";
import { Types } from "mongoose";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await requireAuth(req);

  const { increment = true } = await req.json();
  const content = await toggleLike(
    new Types.ObjectId(params.id),
    increment
  );

  return Response.json({ data: content });
}
 */