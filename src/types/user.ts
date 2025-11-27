export type User = {
  id: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  createdById: string | null
  updatedById: string | null
  deletedById: string | null
  isActive: boolean
  firstName: string
  lastName: string
  email: string
  document: string | null
  position: string | null
  userBonita?: string
  roles: number[]
}

export type GetUsersResponse = {
  data: User[]
  total: number
  limit: number | string
  page: number | string
}

export type CreateUserPayload = {
  email: string
  firstName: string
  lastName: string
  password: string
  roles: number[]
}

export type ChangePasswordPayload = {
  password: string
  repeatPassword: string
}
