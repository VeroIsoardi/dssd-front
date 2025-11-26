import { API_CONFIG, MESSAGES } from '@/lib/constants'
import { getToken } from '@/services/auth'
import type { User, GetUsersResponse, CreateUserPayload, ChangePasswordPayload } from '@/types/user'

export class UsersApiError extends Error {
  constructor(message: string, public statusCode: number = 500, public error?: string) {
    super(message)
    this.name = 'UsersApiError'
  }
}

const parseJsonSafely = async (res: Response) => {
  try {
    return await res.json()
  } catch {
    return undefined
  }
}

export async function getUsers(page = 0, limit = 10): Promise<User[]> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`

    const url = `${API_CONFIG.BASE_URL}/users?page=${page}&limit=${limit}`

    const res = await fetch(url, { method: 'GET', headers })

    if (!res.ok) {
      const body = await parseJsonSafely(res)
      const message = body?.message || `Error ${res.status}: ${res.statusText}`
      throw new UsersApiError(message, res.status, body?.error)
    }

    const data = (await res.json()) as GetUsersResponse
    return data.data
  } catch (err: unknown) {
    if (err instanceof UsersApiError) throw err
    throw new UsersApiError(MESSAGES.ERROR.NETWORK_ERROR, 0)
  }
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${API_CONFIG.BASE_URL}/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const body = await parseJsonSafely(res)
      const message = body?.message || `Error ${res.status}: ${res.statusText}`
      throw new UsersApiError(message, res.status, body?.error)
    }

    const result = await res.json()
    return result.data as User
  } catch (err: unknown) {
    if (err instanceof UsersApiError) throw err
    throw new UsersApiError(MESSAGES.ERROR.UNEXPECTED_ERROR, 500)
  }
}

export async function changeUserPassword(id: string, payload: ChangePasswordPayload): Promise<void> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${API_CONFIG.BASE_URL}/users/${id}/password`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const body = await parseJsonSafely(res)
      const message = body?.message || `Error ${res.status}: ${res.statusText}`
      throw new UsersApiError(message, res.status, body?.error)
    }

    return
  } catch (err: unknown) {
    if (err instanceof UsersApiError) throw err
    throw new UsersApiError(MESSAGES.ERROR.UNEXPECTED_ERROR, 500)
  }
}
