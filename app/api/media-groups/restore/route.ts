import { connectDB } from "@/lib/db";
import { requireAuth } from "@/middleware/auth";
import { restoreMediaGroup } from "@/services/mediaGroup.service";

export async function POST(req: Request) {
  try {
    await connectDB();
    const user = requireAuth(req);

    const { id } = await req.json();
    
    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    const mediaGroup = await restoreMediaGroup(id);
    return Response.json(mediaGroup, { status: 200 });
  } catch (err: any) {
    if (err.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    return Response.json({ error: err.message }, { status: 400 });
  }
}