"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth'
import { loginOng as authLogin, registerOng as authRegister, saveToken, getToken, clearToken, saveUserData, getUserData, clearUserData } from '@/services/auth'
import { USER_ROLES, hasRole } from '@/lib/constants/roles'

type AuthContextValue = {
  user: AuthResponse['user'] | null
  token: string | null
  loading: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  getDefaultRoute: () => string
}

function getDefaultRouteForRole(userRoles: number[]): string {
  if (hasRole(userRoles, USER_ROLES.ADMIN)) return '/users'
  if (hasRole(userRoles, USER_ROLES.ONG)) return '/projects'
  if (hasRole(userRoles, USER_ROLES.ORGANIZATION)) return '/compromises'
  if (hasRole(userRoles, USER_ROLES.DIRECTOR)) return '/dashboard'
  return '/'
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = getToken()
    const u = getUserData()
    if (t && u) {
      setToken(t)
      setUser(u)
    }
    setLoading(false)
  }, [])

  const login = async (payload: LoginPayload) => {
    const res = await authLogin(payload)
    saveToken(res.token)
    saveUserData(res.user)
    setToken(res.token)
    setUser(res.user)
  }

  const register = async (payload: RegisterPayload) => {
    const res = await authRegister(payload)
    saveToken(res.token)
    saveUserData(res.user)
    setToken(res.token)
    setUser(res.user)
  }

  const logout = () => {
    clearToken()
    clearUserData()
    setToken(null)
    setUser(null)
  }

  const getDefaultRoute = (): string => {
    if (!user) return '/'
    return getDefaultRouteForRole(user.roles)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, getDefaultRoute }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
