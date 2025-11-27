export interface Compromise {
  id: string
  taskId: string
  taskName: string
  projectId: string
  projectName: string
  ongName: string
  organizationId: string
  organizationName: string
  organizationEmail: string
  description: string
  startDate: string
  endDate: string
  status: CompromiseStatus
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export type CompromiseStatus =
  | 'pending'      // Pending
  | 'in_progress'  // In Progress
  | 'completed'    // Completed


export const compromiseStatusLabels: Record<CompromiseStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  completed: 'Completado',
}

export const compromiseStatusColors: Record<CompromiseStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
}