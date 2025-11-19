"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { hasAnyRole, type UserRole } from '@/lib/constants/roles'

interface RequireAuthProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  fallbackPath?: string
}

export default function RequireAuth({
  children,
  allowedRoles,
  fallbackPath = '/'
}: RequireAuthProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/')
        return
      }

      if (allowedRoles && allowedRoles.length > 0) {
        const hasPermission = hasAnyRole(user.roles, allowedRoles)
        if (!hasPermission) {
          router.push(fallbackPath)
        }
      }
    }
  }, [loading, user, allowedRoles, fallbackPath, router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  if (!user) {
    return null
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasPermission = hasAnyRole(user.roles, allowedRoles)
    if (!hasPermission) {
      return null
    }
  }

  return <>{children}</>
}