export const USER_ROLES = {
  ADMIN: 1, // Admins - CRUD only of users.
  ONG: 2, // ONGs - can create projects
  ORGANIZATION: 3, // Organizations - can create compromises for project tasks
  DIRECTOR: 4, // Directors - can view dashboard with project info
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ROLE_NAMES: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]: "Administrador",
  [USER_ROLES.ONG]: "ONG",
  [USER_ROLES.ORGANIZATION]: "Organización",
  [USER_ROLES.DIRECTOR]: "Director",
};

export function getUserRole(userRoles: number[]): UserRole | null {
  if (!userRoles || userRoles.length === 0) return null;
  return userRoles[0] as UserRole;
}

export function hasRole(userRoles: number[], role: UserRole): boolean {
  if (!Array.isArray(userRoles)) return false;
  return userRoles.includes(role);
}

export function hasAnyRole(userRoles: number[], roles: UserRole[]): boolean {
  if (!Array.isArray(userRoles) || !Array.isArray(roles)) return false;
  return roles.some((r) => userRoles.includes(r));
}

export function getRoleName(userRoles: number[]): string {
  if (!Array.isArray(userRoles) || userRoles.length === 0) return "Usuario";
  const names = userRoles
    .filter(
      (r): r is UserRole =>
        r === USER_ROLES.ADMIN ||
        r === USER_ROLES.ONG ||
        r === USER_ROLES.ORGANIZATION ||
        r === USER_ROLES.DIRECTOR
    )
    .map((r) => ROLE_NAMES[r]);
  return names.length ? names.join(", ") : "Usuario";
}
