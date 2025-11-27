'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { USER_ROLES, hasRole, getRoleName } from '@/lib/constants/roles'

type NavItem = {
  label: string
  path: string
}

export function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }

  const getNavItems = (): NavItem[] => {
    if (!user) return []

    const items: NavItem[] = []

    if (hasRole(user.roles, USER_ROLES.ADMIN)) {
      items.push({ label: 'Usuarios', path: '/users' })
    }

    if (hasRole(user.roles, USER_ROLES.ONG)) {
      items.push({ label: 'Proyectos', path: '/projects' })
    }

    if (hasRole(user.roles, USER_ROLES.ORGANIZATION)) {
      items.push({ label: 'Compromisos', path: '/compromises' })
    }

    if (hasRole(user.roles, USER_ROLES.DIRECTOR)) {
      items.push({ label: 'Dashboard', path: '/dashboard' })
    }

    return items
  }

  const navItems = getNavItems()

  if (!user) return null

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">
          <div className="flex-1">
            <Link href="/" className="text-lg font-semibold">ProjectPlanning</Link>
          </div>

          <div className="flex-1">
            <div className="flex justify-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                    isActive(item.path)
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex-1 flex justify-end items-center space-x-4">
            <p className="text-sm text-gray-700">
              {user.firstName} {user.lastName}
              <span className="block text-gray-500 text-xs">{getRoleName(user.roles)}</span>
            </p>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}