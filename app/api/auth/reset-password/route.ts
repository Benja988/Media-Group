import { connectDB } from "@/lib/db";
import { resetPassword } from "@/services/auth.service";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  try {
    await resetPassword(body);
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
