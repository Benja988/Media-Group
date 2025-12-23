import { connectDB } from "@/lib/db";
import { requireAuth } from "@/middleware/auth";
import User from "@/lib/models/User";

export async function GET(req: Request) {
  await connectDB();
  const payload = requireAuth(req);

  const user = await User.findById(payload.sub).lean();
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  return Response.json({
    id: user._id,
    email: user.email,
    role: user.role,
    scope: user.scope,
  });
}
