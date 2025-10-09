import { API_CONFIG } from "@/lib/constants"
import type { RegisterPayload, LoginPayload, AuthResponse } from "@/types/auth"

class AuthApiError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message)
    this.name = 'AuthApiError'
  }
}

const parseError = async (res: Response) => {
  try {
    const body = await res.json()
    return (body && body.message) || `Error ${res.status}: ${res.statusText}`
  } catch {
    return `Error ${res.status}: ${res.statusText}`
  }
}

export async function registerOng(payload: RegisterPayload): Promise<AuthResponse> {
  const url = `${API_CONFIG.BASE_URL}/auth/register`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const message = await parseError(res)
    throw new AuthApiError(message, res.status)
  }

  const data = await res.json()
  return data as AuthResponse
}

export async function loginOng(payload: LoginPayload): Promise<AuthResponse> {
  const url = `${API_CONFIG.BASE_URL}/auth/login`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const message = await parseError(res)
    throw new AuthApiError(message, res.status)
  }

  const data = await res.json()
  return data as AuthResponse
}

// Local storage helpers
const ACCESS_TOKEN_KEY = 'dssd_access_token'
const REFRESH_TOKEN_KEY = 'dssd_refresh_token'

export function saveAccessToken(token: string) {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  } catch {
    // ignore
  }
}

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  } catch {
    return null
  }
}

export function clearAccessToken() {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  } catch {
    // ignore
  }
}

export function saveRefreshToken(token: string) {
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  } catch {
    // ignore
  }
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  } catch {
    return null
  }
}

export function clearRefreshToken() {
  try {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  } catch {
    // ignore
  }
}

/**
 * Request a fresh access token using the stored refresh token
 */
export async function refreshAccessToken(): Promise<AuthResponse> {
  const refresh = getRefreshToken()
  if (!refresh) throw new AuthApiError('No refresh token', 401)

  const url = `${API_CONFIG.BASE_URL}/auth/refresh`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: refresh }),
  })

  if (!res.ok) {
    const message = await parseError(res)
    throw new AuthApiError(message, res.status)
  }

  const data = await res.json()
  return data as AuthResponse
}

export { AuthApiError }
