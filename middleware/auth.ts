import { verifyToken } from "@/lib/auth/token";
import { JWTPayload } from "@/types/auth";

export function requireAuth(req: Request): JWTPayload {
  const authHeader = req.headers.get("authorization");
  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    // fallback to cookie named 'token'
    const cookie = req.headers.get("cookie") || "";
    token = cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];
  }

  if (!token) {
    // Return a proper 401 JSON response
    throw new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    return verifyToken(token);
  } catch (err) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
}

/* export function requireAuth(req: Request): JWTPayload {

  const authHeader = req.headers.get("authorization");
  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
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
 */