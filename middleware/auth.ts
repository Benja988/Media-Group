import { verifyToken } from "@/lib/auth/token";
import { JWTPayload } from "@/types/auth";

export function requireAuth(req: Request): JWTPayload {
    const auth = req.headers.get("authorization");
    if (!auth) {
        throw new Error("Unauthorized");
    }

    const token = auth.replace("Bearer ", "");
    return verifyToken(token);
}