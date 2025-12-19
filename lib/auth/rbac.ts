import { UserRole } from "@/types/auth";

const rolePermissions: Record<UserRole, string[]> = {
    super_admin: ["*"],
    group_admin: ["manage_group", "manage_stations"],
    station_admin: ["manage_station", "publish_content"],
    editor: ["publish_content"],
    contributor: ["create_content"],
    user: [],
}

export function hasPermission(
    role: UserRole,
    permission: string
): boolean {
    const perms = rolePermissions[role] || [];
    return perms.includes("*") || perms.includes(permission);
}