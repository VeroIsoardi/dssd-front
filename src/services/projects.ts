import { Project, ProjectFormData } from "@/types/project"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export interface CreateProjectResponse {
  success: boolean
  data: Project
  message?: string
}

export interface ApiError {
  message: string
  statusCode: number
  error?: string
}

export class ProjectApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public error?: string
  ) {
    super(message)
    this.name = 'ProjectApiError'
  }
}

/**
 * Creates a new project by sending data to the backend
 * @param data - Project form data to be sent
 * @returns Promise with the created project
 */
export async function createProject(
  data: ProjectFormData
): Promise<Project> {
  try {
    const payload = {
      name: data.name,
      description: data.description,
      country: data.country,
      startDate: data.startDate,
      endDate: data.endDate,
      budgetFile: data.budgetFile ? {
        name: data.budgetFile instanceof FileList ? data.budgetFile[0]?.name : data.budgetFile.name,
        size: data.budgetFile instanceof FileList ? data.budgetFile[0]?.size : data.budgetFile.size,
        type: data.budgetFile instanceof FileList ? data.budgetFile[0]?.type : data.budgetFile.type,
      } : null,
      tasks: data.tasks
    }

    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      let errorMessage = 'Error al crear el proyecto'
      let errorDetails: ApiError | undefined

      try {
        errorDetails = await response.json()
        errorMessage = errorDetails?.message || errorMessage
      } catch {
        errorMessage = `Error ${response.status}: ${response.statusText}`
      }

      throw new ProjectApiError(
        errorMessage,
        response.status,
        errorDetails?.error
      )
    }

    const result: CreateProjectResponse = await response.json()
    return result.data
  } catch (error) {
    if (error instanceof ProjectApiError) {
      throw error
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ProjectApiError(
        'No se pudo conectar con el servidor. Verifique su conexión a internet.',
        0
      )
    }

    throw new ProjectApiError(
      'Error inesperado al crear el proyecto',
      500
    )
  }
}
