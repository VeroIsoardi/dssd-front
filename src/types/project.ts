export interface Task {
  name: string
  description: string
  startDate: string
  endDate: string
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
  name: string
  description: string
  country: string
  startDate: string
  endDate: string
  tasks: Task[]
  status: 'draft' | 'active' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
  userId: string
}