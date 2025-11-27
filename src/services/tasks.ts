import { Task } from '@/types/task'
import { API_CONFIG } from '@/lib/constants'
import { getToken } from '@/services/auth'
import { handleApiError } from '@/lib/api-client'

export interface CreateTaskPayload {
  name: string
  description: string
  startDate: string
  endDate: string
}

interface ApiError {
  message: string
  statusCode: number
  error?: string
}

export class TaskApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public error?: string
  ) {
    super(message)
    this.name = 'TaskApiError'
  }
}

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  
  return headers
}

export const taskService = {
  // Get tasks for a project
  getAll: async (projectId: string): Promise<Task[]> => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/projects/${projectId}/tasks`,
        { headers: getAuthHeaders() }
      )
      
      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          handleApiError(response)
          throw new TaskApiError('No autorizado - redirigiendo al login', 401)
        }

        let errorMessage = 'Error al obtener las tareas'
        let errorDetails: ApiError | undefined
        
        try {
          errorDetails = await response.json()
          errorMessage = errorDetails?.message || errorMessage
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`
        }
        
        throw new TaskApiError(errorMessage, response.status, errorDetails?.error)
      }
      
      const result = await response.json()
      console.log('Tasks API response:', result)
      // Handle different response formats: { data: Task[] } or Task[]
      const tasks = Array.isArray(result) ? result : (result.data || [])
      console.log('Parsed tasks:', tasks)
      return tasks
    } catch (error) {
      if (error instanceof TaskApiError) throw error
      throw new TaskApiError('Error al obtener las tareas', 500)
    }
  },

  // Get a single task by ID
  getById: async (projectId: string, taskId: string): Promise<Task | null> => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/projects/${projectId}/tasks/${taskId}`,
        { headers: getAuthHeaders() }
      )
      
      if (!response.ok) {
        if (response.status === 404) return null
        
        // Handle 401 Unauthorized
        if (response.status === 401) {
          handleApiError(response)
          throw new TaskApiError('No autorizado - redirigiendo al login', 401)
        }

        let errorMessage = 'Error al obtener la tarea'
        try {
          const errorDetails = await response.json()
          errorMessage = errorDetails?.message || errorMessage
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`
        }
        
        throw new TaskApiError(errorMessage, response.status)
      }
      
      return response.json()
    } catch (error) {
      if (error instanceof TaskApiError) throw error
      throw new TaskApiError('Error al obtener la tarea', 500)
    }
  },


}