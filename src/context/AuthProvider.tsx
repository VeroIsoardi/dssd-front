"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth'
import { loginOng, registerOng, saveAccessToken, getAccessToken, clearAccessToken, saveRefreshToken, refreshAccessToken, getRefreshToken, clearRefreshToken } from '@/services/auth'

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
    let mounted = true

    const init = async () => {
      const t = getAccessToken()
      if (t) {
        setToken(t)
        setUser(null)
      }

      // Try refresh if refresh token exists to get fresh access and user
      const refresh = getRefreshToken()
      if (refresh && mounted) {
        try {
          const res = await refreshAccessToken()
          saveAccessToken(res.accessToken)
          if (res.refreshToken) saveRefreshToken(res.refreshToken)
          setToken(res.accessToken)
          setUser(res.user)
        } catch {
          // On refresh failure, clear tokens
          clearAccessToken()
          clearRefreshToken()
          setToken(null)
          setUser(null)
        }
      }

      setLoading(false)
    }

    init()

    return () => { mounted = false }
  }, [])

  const login = async (payload: LoginPayload) => {
    const res = await loginOng(payload)
    saveAccessToken(res.accessToken)
    if (res.refreshToken) saveRefreshToken(res.refreshToken)
    setToken(res.accessToken)
    setUser(res.user)
  }

  const register = async (payload: RegisterPayload) => {
    const res = await registerOng(payload)
    saveAccessToken(res.accessToken)
    if (res.refreshToken) saveRefreshToken(res.refreshToken)
    setToken(res.accessToken)
    setUser(res.user)
  }

  const logout = () => {
    clearAccessToken()
    clearRefreshToken()
    setToken(null)
    setUser(null)
  }

  // Periodic silent refresh: attempt to refresh every 10 minutes if refresh token exists
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const refresh = getRefreshToken()
        if (!refresh) return
        const res = await refreshAccessToken()
        saveAccessToken(res.accessToken)
        if (res.refreshToken) saveRefreshToken(res.refreshToken)
        setToken(res.accessToken)
        setUser(res.user)
      } catch {
        // If refresh fails, logout
        clearAccessToken()
        clearRefreshToken()
        setToken(null)
        setUser(null)
      }
    }, 1000 * 60 * 10)

    return () => clearInterval(interval)
  }, [])

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
