/* import { connectDB } from "@/lib/db";
import { incrementViews } from "@/services/content.service";
import { Types } from "mongoose";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await incrementViews(new Types.ObjectId(params.id));
  return Response.json({ success: true });
}
 */