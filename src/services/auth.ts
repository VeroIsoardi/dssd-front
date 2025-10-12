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

export function saveUserData(user: AuthResponse['user']) {
  localStorage.setItem('user', JSON.stringify(user))
}

export function getUserData(): AuthResponse['user'] | null {
  const data = localStorage.getItem('user')
  return data ? JSON.parse(data) : null
}

export function clearUserData() {
  localStorage.removeItem('user')
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
  const url = `${API_CONFIG.BASE_URL}/auth/admin/login`

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
const TOKEN_KEY = 'dssd_token'

export function saveToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // ignore
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // ignore
  }
}

export { AuthApiError }
