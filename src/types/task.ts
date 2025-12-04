export interface Task {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  isFinished: boolean
  isPrivate?: boolean
  projectId: string
  collaboratorId: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  createdById: string
  updatedById: string | null
  deletedById: string | null
  isActive: boolean
  project?: {
    id: string
    name: string
    description: string
    country: string
    startDate: string
    endDate: string
    ongId: string
    caseId: number
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    createdById: string
    updatedById: string | null
    deletedById: string | null
    isActive: boolean
  }
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed'

export const statusLabels: Record<TaskStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  completed: 'Completado'
}

// Extended task interface for assigned tasks with related data
export interface AssignedTask {
  id: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  createdById: string | null
  updatedById: string | null
  deletedById: string | null
  isActive: boolean
  name: string
  description: string
  projectId: string
  collaboratorId: string
  isFinished: boolean
  startDate: string
  endDate: string
  collaborator: {
    id: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    createdById: string | null
    updatedById: string | null
    deletedById: string | null
    isActive: boolean
    name: string
    email: string
    taskId: string
  }
  project: {
    id: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    createdById: string
    updatedById: string | null
    deletedById: string | null
    isActive: boolean
    name: string
    description: string
    country: string
    startDate: string
    endDate: string
    ongId: string
    caseId: number
    ong: {
      id: string
      createdAt: string
      updatedAt: string
      deletedAt: string | null
      createdById: string | null
      updatedById: string | null
      deletedById: string | null
      isActive: boolean
      name: string
      email: string
    }
  }
}

export interface AssignedTasksResponse {
  data: AssignedTask[]
  total: number
  page: number
  limit: number
}