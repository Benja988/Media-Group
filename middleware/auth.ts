import { verifyToken } from "@/lib/auth/token";
import { JWTPayload } from "@/types/auth";

export function requireAuth(req: Request): JWTPayload {

  // Check Authorization header first (Bearer token)
  const authHeader = req.headers.get("authorization");
  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    // Fallback to cookie
    const cookie = req.headers.get("cookie") || "";
    token = cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];
  }

  if (!token) {
    throw new Error("Unauthorized");
  }

  return verifyToken(token);
}
