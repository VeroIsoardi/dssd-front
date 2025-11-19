export interface Task {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  status: TaskStatus
  isPrivate: boolean
  completedAt?: string
  projectId: string
  createdAt: string
  updatedAt: string
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed'

export const statusLabels: Record<TaskStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  completed: 'Completado'
}