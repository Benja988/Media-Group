import bcrypt from "bcrypt";
import { Types } from "mongoose";
import User from "@/lib/models/User";
import { signToken } from "@/lib/auth/token";
import { UserRole } from "@/types/auth";

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

export async function registerUser(input: RegisterInput) {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw new Error("Email already in use");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await User.create({
    email: input.email,
    passwordHash,
    role: input.role ?? "user",
    scope: input.scope,
  });

  return user;
}


export async function loginUser({ email, password }: LoginInput) {
  const user = await User.findOne({ email })
    .select("+passwordHash")
    .lean(false);

  if (!user || !user.isActive) {
    throw new Error("Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new Error("Invalid credentials");
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = signToken({
    sub: user._id.toString(),
    role: user.role,
    scope: user.scope || {},
  });

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      scope: user.scope,
    },
  };
}
