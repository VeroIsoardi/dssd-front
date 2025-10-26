export interface Task {
  id: string
  name: string
  description: string
  startDate: string           // Format: YYYY-MM-DD
  endDate: string            // Format: YYYY-MM-DD
  status: TaskStatus
  completedAt?: string       // When the task was marked as completed
  projectId: string         // The project this task belongs to
  createdAt: string
  updatedAt: string
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed'

export const statusLabels: Record<TaskStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  completed: 'Completado'
}