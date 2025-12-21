import crypto from "crypto";
import { RefreshToken } from "@/lib/models";

export async function createRefreshToken(userId: string) {
    const token = crypto.randomBytes(40).toString("hex");

    await RefreshToken.create({
        userId,
        token,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return token;
}