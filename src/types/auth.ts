export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    roles: number[]
  }
}

export interface RegisterPayload {
  firstName: string
  lastName: string
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
