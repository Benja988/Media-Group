import jwt from "jsonwebtoken";
import { JWTPayload } from "@/types/auth";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error(
    "Missing JWT_SECRET environment variable. Set it in .env, .env.local, or export it before running."
  );
}

// Token expiration
const JWT_EXPIRES_IN = "7d";

/**
 * Sign a JWT token
 * @param payload JWTPayload
 * @returns token string
 */
export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify a JWT token
 * @param token JWT string
 * @returns JWTPayload
 * @throws Error if invalid or expired
 */
export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (err) {
    throw new Error("Unauthorized"); // unified error for all invalid/expired tokens
  }
}

/**
 * Optional: helper to parse token from cookie string
 */
export function getTokenFromCookie(cookieHeader?: string): string | null {
  if (!cookieHeader) return null;
  const token = cookieHeader
    .split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];
  return token || null;
}
