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
const JWT_EXPIRES_IN = "7d";

export function signToken(payload: JWTPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}
