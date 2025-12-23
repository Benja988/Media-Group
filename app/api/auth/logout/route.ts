import { connectDB } from "@/lib/db";
import { logout } from "@/services/auth.service";

export async function POST(req: Request) {
  await connectDB();
  const { refreshToken } = await req.json();

  await logout(refreshToken);
  return Response.json({ success: true });
}
