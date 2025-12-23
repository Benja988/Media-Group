import { Types } from "mongoose";

export type UserRole =
  | "super_admin"
  | "group_admin"
  | "station_admin"
  | "editor"
  | "contributor"
  | "user";

export interface UserScope {
  mediaGroupId?: Types.ObjectId;
  stationIds?: Types.ObjectId[];
}

export interface JWTPayload {
  sub: string;
  role: UserRole;
  scope: UserScope;
}
