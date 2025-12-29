import { connectDB } from "@/lib/db";
import { logout } from "@/services/auth.service";

export async function POST(req: Request) {
  console.log("🔹 Logout API called");
  await connectDB();
  const { refreshToken } = await req.json();
  console.log("🔹 Refresh token received:", refreshToken ? "present" : "not present");

  await logout(refreshToken);
  console.log("🔹 Logout service completed");
  return Response.json({ success: true });
}
