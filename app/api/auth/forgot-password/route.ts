import { connectDB } from "@/lib/db";
import { forgotPassword } from "@/services/auth.service";

export async function POST(req: Request) {
  await connectDB();
  const { email } = await req.json();

  await forgotPassword(email);
  return Response.json({ success: true });
}
