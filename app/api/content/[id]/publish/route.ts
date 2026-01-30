/* import { connectDB } from "@/lib/db";
import { requireAuth } from "@/middleware/auth";
import { publishContent } from "@/services/content.service";
import { Types } from "mongoose";

export async function PATCH(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await requireAuth(_);

  const content = await publishContent(new Types.ObjectId(params.id));
  return Response.json({ data: content });
}
 */