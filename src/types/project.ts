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

export interface FileInfo {
  name: string
  size: number
  type: string
}

export interface ProjectFormData {
  name: string
  description: string
  country: string
  startDate: string
  endDate: string
  budgetFile: FileList | FileInfo | null
  tasks: Task[]
}

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
  budgetFile?: FileInfo | null
  tasks: Task[]
  status: 'draft' | 'active' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
  userId: string
}