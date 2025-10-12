import { Project, ProjectFormData } from "@/types/project"
import { API_CONFIG, MESSAGES } from "@/lib/constants"
import { getToken } from "@/services/auth"

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
