import { Task, AssignedTask, AssignedTasksResponse } from '@/types/task'
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
  getAll: async (projectId: string, privateTasks: boolean = false): Promise<Task[]> => {
    try {
      const url = `${API_CONFIG.BASE_URL}/projects/${projectId}/tasks?privateTask=${privateTasks}`
      const response = await fetch(
        url,
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
      // Handle different response formats: 
      // [[Task[]], count] or { data: Task[] } or Task[]
      let tasks: Task[] = []
      if (Array.isArray(result)) {
        if (result.length === 2 && Array.isArray(result[0])) {
          // Format: [[Task[]], count]
          tasks = result[0]
        } else {
          // Format: Task[]
          tasks = result
        }
      } else {
        // Format: { data: Task[] }
        tasks = result.data || []
      }
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

  // Get assigned tasks for the logged organization
  getAssignedTasks: async (): Promise<AssignedTasksResponse> => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/tasks/assigned`,
        { headers: getAuthHeaders() }
      )
      
      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          handleApiError(response)
          throw new TaskApiError('No autorizado - redirigiendo al login', 401)
        }

        let errorMessage = 'Error al obtener las tareas asignadas'
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
      return result
    } catch (error) {
      if (error instanceof TaskApiError) throw error
      throw new TaskApiError('Error al obtener las tareas asignadas', 500)
    }
  },

  // Mark a task as finished
  finishTask: async (taskId: string, projectId?: string): Promise<void> => {
    try {
      const body = projectId ? JSON.stringify({ projectId }) : undefined
      
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/tasks/${taskId}/finish`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body
        }
      )
      
      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          handleApiError(response)
          throw new TaskApiError('No autorizado - redirigiendo al login', 401)
        }

        let errorMessage = 'Error al completar la tarea'
        let errorDetails: ApiError | undefined
        
        try {
          errorDetails = await response.json()
          errorMessage = errorDetails?.message || errorMessage
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`
        }
        
        throw new TaskApiError(errorMessage, response.status, errorDetails?.error)
      }
    } catch (error) {
      if (error instanceof TaskApiError) throw error
      throw new TaskApiError('Error al completar la tarea', 500)
    }
  },

  // Grab/assign a task to the current user
  grabTask: async (taskId: string, projectId?: string): Promise<void> => {
    try {
      const body = projectId ? JSON.stringify({ projectId }) : undefined
      
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/tasks/${taskId}/take`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body
        }
      )
      
      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          handleApiError(response)
          throw new TaskApiError('No autorizado - redirigiendo al login', 401)
        }

        let errorMessage = 'Error al tomar la tarea'
        let errorDetails: ApiError | undefined
        
        try {
          errorDetails = await response.json()
          errorMessage = errorDetails?.message || errorMessage
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`
        }
        
        throw new TaskApiError(errorMessage, response.status, errorDetails?.error)
      }
    } catch (error) {
      if (error instanceof TaskApiError) throw error
      throw new TaskApiError('Error al tomar la tarea', 500)
    }
  },

}