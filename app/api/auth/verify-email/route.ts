import { connectDB } from "@/lib/db";
import { verifyEmail } from "@/services/auth.service";

export async function POST(req: Request) {
  await connectDB();
  const { token } = await req.json();

  try {
    await verifyEmail(token);
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
