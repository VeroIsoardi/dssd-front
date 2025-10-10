"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth'
import { loginOng, registerOng, saveToken, getToken, clearToken } from '@/services/auth'

type AuthContextValue = {
  user: AuthResponse['user'] | null
  token: string | null
  loading: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = getToken()
    if (t) {
      setToken(t)
      // We could decode the JWT here to get user info
      setUser(null)
    }
    setLoading(false)
  }, [])

  const login = async (payload: LoginPayload) => {
    const res = await loginOng(payload)
    saveToken(res.token)
    setToken(res.token)
    setUser(res.user)
  }

  const register = async (payload: RegisterPayload) => {
    const res = await registerOng(payload)
    saveToken(res.token)
    setToken(res.token)
    setUser(res.user)
  }

  const logout = () => {
    clearToken()
    setToken(null)
    setUser(null)
  }

  // No refresh interval needed - using a single JWT token

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
