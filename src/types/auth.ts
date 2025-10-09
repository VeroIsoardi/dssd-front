export interface AuthResponse {
  accessToken: string
  refreshToken?: string
  user: {
    id: string
    name: string
    email: string
    role?: string
  }
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface ApiError {
  message: string
  statusCode?: number
}
