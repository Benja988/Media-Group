import { connectDB } from "@/lib/db";
import { requireAuth } from "@/middleware/auth";
import User from "@/lib/models/User";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const payload = requireAuth(req);

    if (!payload?.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(payload.userId).lean();
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const name =
      user.profile?.firstName && user.profile?.lastName
        ? `${user.profile.firstName} ${user.profile.lastName}`
        : user.profile?.firstName ||
          user.profile?.lastName ||
          user.email.split("@")[0];

    return Response.json({
      data: {
        id: user._id,
        email: user.email,
        name,
        role: user.role,
        scope: user.scope || [],
      },
    });
  } catch (err: any) {
    return Response.json(
      { error: err.message || "Unauthorized" },
      { status: 401 }
    );
  }
}
