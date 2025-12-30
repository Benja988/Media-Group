import User from "@/lib/models/User";
import { Types } from "mongoose";
import { logger } from "@/lib/logger";
import { hashPassword } from "./auth.service";

interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role?: "user" | "station_admin" | "group_admin" | "super_admin";
  scope?: {
    mediaGroupId?: Types.ObjectId;
    stationIds?: Types.ObjectId[];
  };
}

interface UpdateUserInput {
  id: Types.ObjectId;
  email?: string;
  name?: string;
  role?: "user" | "station_admin" | "group_admin" | "super_admin";
  scope?: {
    mediaGroupId?: Types.ObjectId;
    stationIds?: Types.ObjectId[];
  };
  isActive?: boolean;
}

export async function createUser(input: CreateUserInput) {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw new Error("Email already in use");
  }

  const passwordHash = await hashPassword(input.password);

  const user = await User.create({
    email: input.email,
    passwordHash,
    role: input.role || "user",
    scope: input.scope,
    profile: {
      firstName: input.name.split(' ')[0],
      lastName: input.name.split(' ').slice(1).join(' '),
    },
    isActive: true,
  });

  logger.info("User created", { userId: user._id, email: user.email });
  return user;
}

export async function getUserById(id: Types.ObjectId) {
  return User.findById(id).select('-passwordHash').lean();
}

export async function updateUser(input: UpdateUserInput) {
  const { id, ...updateData } = input;

  const user = await User.findByIdAndUpdate(id, updateData, { new: true });
  if (!user) {
    throw new Error("User not found");
  }

  logger.info("User updated", { userId: user._id });
  return user;
}

export async function deleteUser(id: Types.ObjectId) {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new Error("User not found");
  }

  logger.info("User deleted", { userId: user._id });
  return user;
}

export async function listUsers({
  role,
  isActive,
  limit = 20,
  offset = 0,
  sortBy = 'createdAt',
  sortOrder = -1,
}: {
  role?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 1 | -1;
} = {}) {
  const filter: any = {};
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive;

  const sort: any = {};
  sort[sortBy] = sortOrder;

  return User.find(filter)
    .select('-passwordHash')
    .sort(sort)
    .limit(limit)
    .skip(offset)
    .lean();
}

export async function activateUser(id: Types.ObjectId) {
  const user = await User.findByIdAndUpdate(id, { isActive: true }, { new: true });
  if (!user) {
    throw new Error("User not found");
  }

  logger.info("User activated", { userId: user._id });
  return user;
}

export async function deactivateUser(id: Types.ObjectId) {
  const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!user) {
    throw new Error("User not found");
  }

  logger.info("User deactivated", { userId: user._id });
  return user;
}

export async function changeUserPassword(id: Types.ObjectId, newPassword: string) {
  const passwordHash = await hashPassword(newPassword);

  const user = await User.findByIdAndUpdate(id, { passwordHash }, { new: true });
  if (!user) {
    throw new Error("User not found");
  }

  logger.info("User password changed", { userId: user._id });
  return user;
}