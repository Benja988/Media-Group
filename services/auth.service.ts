import bcrypt from "bcrypt";
import crypto from "crypto";
import { Types } from "mongoose";

import User from "@/lib/models/User";
import RefreshToken from "@/lib/models/RefreshToken";

import { signToken } from "@/lib/auth/token";
import { UserRole } from "@/types/auth";
import { logger } from "@/lib/logger";

import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "./email.service";


interface RegisterInput {
  email: string;
  password: string;
  role?: UserRole;
  scope?: {
    mediaGroupId?: Types.ObjectId;
    stationIds?: Types.ObjectId[];
  };
}

interface LoginInput {
  email: string;
  password: string;
}

interface ResetPasswordInput {
  token: string;
  newPassword: string;
}


function generateToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}


export async function registerUser(input: RegisterInput) {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    logger.warn("Registration failed: email exists", { email: input.email });
    throw new Error("Email already in use");
  }

  const passwordHash = await hashPassword(input.password);
  const emailVerificationToken = generateToken();

  const user = await User.create({
    email: input.email,
    passwordHash,
    role: input.role ?? "user",
    scope: input.scope,
    emailVerificationToken,
    emailVerified: false,
  });

  await sendVerificationEmail(user.email, emailVerificationToken);

  logger.info("User registered", {
    userId: user._id,
    email: user.email,
  });

  return {
    id: user._id,
    email: user.email,
  };
}


export async function loginUser({ email, password }: LoginInput) {
  const user = await User.findOne({ email }).select("+passwordHash");

  if (!user || !user.isActive) {
    logger.warn("Login failed: invalid user", { email });
    throw new Error("Invalid credentials");
  }

  const rolesRequiringVerification = ["user", "editor", "contributor"];

  // Only force email verification for non-admin roles
  if (
    rolesRequiringVerification.includes(user.role) &&
    !user.emailVerified
  ) {
    throw new Error("Please verify your email before logging in");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    logger.warn("Login failed: wrong password", { email });
    throw new Error("Invalid credentials");
  }

  user.lastLoginAt = new Date();
  await user.save();

  const accessToken = signToken({
    sub: user._id.toString(),
    role: user.role,
    scope: user.scope || {},
  });

  const refreshToken = generateToken(40);
  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  const name =
    user.profile?.firstName && user.profile?.lastName
      ? `${user.profile.firstName} ${user.profile.lastName}`
      : user.profile?.firstName ||
        user.profile?.lastName ||
        user.email.split("@")[0];

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      name,
      role: user.role,
      scope: user.scope || {},
    },
    accessToken,
    refreshToken,
  };
}


export async function verifyEmail(token: string) {
  const user = await User.findOne({ emailVerificationToken: token });
  if (!user) {
    throw new Error("Invalid or expired verification token");
  }

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  logger.info("Email verified", { userId: user._id });

  return true;
}


export async function resendVerificationEmail(email: string) {
  const user = await User.findOne({ email });
  if (!user || user.emailVerified) {
    return;
  }

  const token = generateToken();
  user.emailVerificationToken = token;
  await user.save();

  await sendVerificationEmail(user.email, token);
  logger.info("Verification email resent", { userId: user._id });
}

export async function forgotPassword(email: string) {
  const user = await User.findOne({ email });
  if (!user) {
    return;
  }

  const token = generateToken();
  user.passwordResetToken = token;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  await sendPasswordResetEmail(user.email, token);

  logger.info("Password reset requested", { userId: user._id });
}


export async function resetPassword({
  token,
  newPassword,
}: ResetPasswordInput) {
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  user.passwordHash = await hashPassword(newPassword);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  logger.info("Password reset successful", { userId: user._id });
}


export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  const user = await User.findById(userId).select("+passwordHash");
  if (!user) {
    throw new Error("User not found");
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    throw new Error("Current password is incorrect");
  }

  user.passwordHash = await hashPassword(newPassword);
  await user.save();

  logger.info("Password changed", { userId });
}


export async function logout(refreshToken: string) {
  await RefreshToken.updateOne(
    { token: refreshToken },
    { revoked: true }
  );

  logger.info("User logged out", { refreshToken });
}

export async function refreshAccessToken(token: string) {
  const stored = await RefreshToken.findOne({
    token,
    revoked: false,
    expiresAt: { $gt: new Date() },
  });

  if (!stored) {
    throw new Error("Invalid refresh token");
  }

  const user = await User.findById(stored.userId);
  if (!user || !user.isActive) {
    throw new Error("User no longer active");
  }

  const accessToken = signToken({
    sub: user._id.toString(),
    role: user.role,
    scope: user.scope || {},
  });

  logger.info("Access token refreshed", { userId: user._id });

  return accessToken;
}
