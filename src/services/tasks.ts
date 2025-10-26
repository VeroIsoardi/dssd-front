import { Task } from '@/types/task'
import { API_CONFIG } from '@/lib/constants'
import { getToken } from '@/services/auth'

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
      
      return response.json()
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

  // Create new tasks for a project
  create: async (projectId: string, tasks: CreateTaskPayload[]): Promise<Task[]> => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/projects/${projectId}/tasks`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(tasks)
        }
      )
      
      if (!response.ok) {
        let errorMessage = 'Error al crear las tareas'
        let errorDetails: ApiError | undefined
        
        try {
          errorDetails = await response.json()
          errorMessage = errorDetails?.message || errorMessage
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`
        }
        
        throw new TaskApiError(errorMessage, response.status, errorDetails?.error)
      }
      
      return response.json()
    } catch (error) {
      if (error instanceof TaskApiError) throw error
      throw new TaskApiError('Error al crear las tareas', 500)
    }
  },

  // Update an existing task
  update: async (projectId: string, taskId: string, task: Partial<CreateTaskPayload>): Promise<Task> => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/projects/${projectId}/tasks/${taskId}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(task)
        }
      )
      
      if (!response.ok) {
        let errorMessage = 'Error al actualizar la tarea'
        let errorDetails: ApiError | undefined
        
        try {
          errorDetails = await response.json()
          errorMessage = errorDetails?.message || errorMessage
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`
        }
        
        throw new TaskApiError(errorMessage, response.status, errorDetails?.error)
      }
      
      return response.json()
    } catch (error) {
      if (error instanceof TaskApiError) throw error
      throw new TaskApiError('Error al actualizar la tarea', 500)
    }
  },

  // Delete a task
  delete: async (projectId: string, taskId: string): Promise<void> => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/projects/${projectId}/tasks/${taskId}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders()
        }
      )
      
      if (!response.ok) {
        let errorMessage = 'Error al eliminar la tarea'
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
      throw new TaskApiError('Error al eliminar la tarea', 500)
    }
  }
}