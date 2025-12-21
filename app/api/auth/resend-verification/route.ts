import { connectDB } from "@/lib/db";
import { resendVerificationEmail } from "@/services/auth.service";

export async function POST(req: Request) {
  await connectDB();
  const { email } = await req.json();

  await resendVerificationEmail(email);
  return Response.json({ success: true });
}
