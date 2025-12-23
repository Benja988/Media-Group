import { connectDB } from "@/lib/db";
import { refreshAccessToken } from "@/services/auth.service";

export async function POST(req: Request) {
  await connectDB();
  const { refreshToken } = await req.json();

  try {
    const accessToken = await refreshAccessToken(refreshToken);
    return Response.json({ accessToken });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 401 });
  }
}
