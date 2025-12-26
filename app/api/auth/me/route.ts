import { connectDB } from "@/lib/db";
import { requireAuth } from "@/middleware/auth";
import User from "@/lib/models/User";

export async function GET(req: Request) {
  try {
    await connectDB();

    // Extract payload from JWT / cookie
    const payload = await requireAuth(req); // make sure requireAuth returns payload or throws

    if (!payload?.sub) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const user = await User.findById(payload.sub).lean();
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const name = user.profile?.firstName && user.profile?.lastName
      ? `${user.profile.firstName} ${user.profile.lastName}`
      : user.profile?.firstName || user.profile?.lastName || user.email.split('@')[0];

    return new Response(
      JSON.stringify({
        data: {
          id: user._id,
          email: user.email,
          name,
          role: user.role,
          scope: user.scope || [],
        },
      }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error("❌ /api/auth/me error:", err.message || err);
    return new Response(JSON.stringify({ error: err.message || "Unauthorized" }), { status: 401 });
  }
}
