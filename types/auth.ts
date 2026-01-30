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

/* export interface JWTPayload {
  sub: string;
  role: UserRole;
  scope: UserScope;
} */

export interface JWTPayload {
  userId: string;          
  email: string;
  role: UserRole;
  roles?: string[];       
  stationId?: string;       
  groupId?: string;        
  iat?: number;            
  exp?: number;  
  scope: UserScope;     
}