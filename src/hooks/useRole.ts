"use client"

import { useAuth } from './useAuth'
import { hasRole, hasAnyRole, type UserRole, USER_ROLES } from '@/lib/constants/roles'

export function useRole() {
  const { user } = useAuth()

  const checkRole = (role: UserRole): boolean => {
    if (!user) return false
    return hasRole(user.roles, role)
  }

  const checkAnyRole = (roles: UserRole[]): boolean => {
    if (!user) return false
    return hasAnyRole(user.roles, roles)
  }

  const roles = user ? user.roles : []

  return {
    user,
    hasRole: checkRole,
    hasAnyRole: checkAnyRole,
    userRoles: roles,
    isONG: checkRole(USER_ROLES.ONG),
    isOrganization: checkRole(USER_ROLES.ORGANIZATION),
    isDirector: checkRole(USER_ROLES.DIRECTOR),
  }
}
