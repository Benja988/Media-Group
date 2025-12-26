import { verifyToken } from "@/lib/auth/token";
import { JWTPayload } from "@/types/auth";

export function requireAuth(req: Request): JWTPayload {
  
  const cookie = req.headers.get("cookie") || "";
  const token = cookie
    .split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    throw new Error("Unauthorized");
  }

  return verifyToken(token);
}
