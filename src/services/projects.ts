import { Project, ProjectFormData } from "@/types/project"
import { API_CONFIG, MESSAGES } from "@/lib/constants"
import { getToken } from "@/services/auth"
import { handleApiError } from "@/lib/api-client"

export interface CreateProjectResponse {
  success: boolean
  data: Project
  message?: string
}

export interface GetProjectsResponse {
  success: boolean
  data: Project[]
  total: number
  page: number
  limit: number
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
 * Fetches all projects from the backend
 * @returns Promise with array of projects
 */
export async function getProjects(): Promise<Project[]> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROJECTS}`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      // Handle 401 Unauthorized
      if (response.status === 401) {
        handleApiError(response)
        throw new ProjectApiError('No autorizado - redirigiendo al login', 401)
      }

      let errorMessage: string = 'Failed to fetch projects'
      let errorDetails: ApiError | undefined

      try {
        errorDetails = await response.json()
        errorMessage = errorDetails?.message || 'Failed to fetch projects'
      } catch {
        errorMessage = `Error ${response.status}: ${response.statusText}`
      }

      throw new ProjectApiError(
        errorMessage,
        response.status,
        errorDetails?.error
      )
    }

    const result: GetProjectsResponse = await response.json()
    return result.data
  } catch (error) {
    if (error instanceof ProjectApiError) {
      throw error
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ProjectApiError(
        MESSAGES.ERROR.NETWORK_ERROR,
        0
      )
    }

    throw new ProjectApiError(
      'Failed to fetch projects',
      500
    )
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
      ongName: data.ongName,
      ongMail: data.ongMail,
      name: data.name,
      description: data.description,
      country: data.country,
      startDate: data.startDate,
      endDate: data.endDate,
      tasks: data.tasks
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROJECTS}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      // Handle 401 Unauthorized
      if (response.status === 401) {
        handleApiError(response)
        throw new ProjectApiError('No autorizado - redirigiendo al login', 401)
      }

      let errorMessage: string = MESSAGES.ERROR.PROJECT_CREATE_FAILED
      let errorDetails: ApiError | undefined

      try {
        errorDetails = await response.json()
        errorMessage = errorDetails?.message || MESSAGES.ERROR.PROJECT_CREATE_FAILED
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
        MESSAGES.ERROR.NETWORK_ERROR,
        0
      )
    }

    throw new ProjectApiError(
      MESSAGES.ERROR.PROJECT_CREATE_FAILED,
      500
    )
  }
}

/**
 * Marks a project as finished
 * @param projectId - The ID of the project to finish
 * @returns Promise<void>
 */
export async function finishProject(projectId: string): Promise<void> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`

    const response = await fetch(
      `${API_CONFIG.BASE_URL}/projects/${projectId}/finish`,
      {
        method: 'POST',
        headers,
      }
    )

    if (!response.ok) {
      // Handle 401 Unauthorized
      if (response.status === 401) {
        handleApiError(response)
        throw new ProjectApiError('No autorizado - redirigiendo al login', 401)
      }

      let errorMessage: string = 'Error al finalizar el proyecto'
      let errorDetails: ApiError | undefined

      try {
        errorDetails = await response.json()
        errorMessage = errorDetails?.message || 'Error al finalizar el proyecto'
      } catch {
        errorMessage = `Error ${response.status}: ${response.statusText}`
      }

      throw new ProjectApiError(
        errorMessage,
        response.status,
        errorDetails?.error
      )
    }
  } catch (error) {
    if (error instanceof ProjectApiError) {
      throw error
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ProjectApiError(
        MESSAGES.ERROR.NETWORK_ERROR,
        0
      )
    }

    throw new ProjectApiError(
      'Error al finalizar el proyecto',
      500
    )
  }
}
