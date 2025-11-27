export interface Task {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  status: 'pending' | 'in_progress' | 'completed'
  completedAt?: string
  projectId: string
  createdAt: string
  updatedAt: string
}

export interface Country {
  cca2: string
  name: { common: string }
  translations?: { spa?: { common: string } }
}

export interface CountryOption {
  value: string
  label: string
}

import type { ProjectFormData } from "@/lib/validations/project"
export type { ProjectFormData }

export interface ProjectFormProps {
  onSubmit?: (data: ProjectFormData) => void
}

export interface Project {
  id: string
  ongName: string
  ongMail: string
  name: string
  description: string
  country: string
  startDate: string
  endDate: string
  tasks: Task[]
  status: 'draft' | 'active' | 'completed'
  createdAt: string
  updatedAt: string
  userId: string
  canBeFinished?: boolean
}