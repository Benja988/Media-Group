import { connectDB } from "@/lib/db";
import { changePassword } from "@/services/auth.service";
import { requireAuth } from "@/middleware/auth";

export async function POST(req: Request) {
  await connectDB();
  const payload = requireAuth(req);
  const { currentPassword, newPassword } = await req.json();

  try {
    await changePassword(payload.sub, currentPassword, newPassword);
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
