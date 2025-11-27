import { Compromise } from '@/types/compromise'
import { API_CONFIG } from '@/lib/constants'
import { getToken } from '@/services/auth'
import { handleApiError } from '@/lib/api-client'

interface ApiError {
  message: string
  statusCode: number
  error?: string
}

export class CompromiseApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public error?: string
  ) {
    super(message)
    this.name = 'CompromiseApiError'
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

export const compromiseService = {
  // Get all compromises
  getAll: async (): Promise<Compromise[]> => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/compromises`,
        { headers: getAuthHeaders() }
      )
      
      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          handleApiError(response)
          throw new CompromiseApiError('No autorizado - redirigiendo al login', 401)
        }

        let errorMessage = 'Error al obtener los compromisos'
        let errorDetails: ApiError | undefined
        
        try {
          errorDetails = await response.json()
          errorMessage = errorDetails?.message || errorMessage
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`
        }
        
        throw new CompromiseApiError(errorMessage, response.status, errorDetails?.error)
      }
      
      const result = await response.json()
      // Handle different response formats: { data: Compromise[] } or Compromise[]
      const compromises = Array.isArray(result) ? result : (result.data || [])
      return compromises
    } catch (error) {
      if (error instanceof CompromiseApiError) throw error
      throw new CompromiseApiError('Error al obtener los compromisos', 500)
    }
  },

  // Get a single compromise by ID
  getById: async (compromiseId: string): Promise<Compromise | null> => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/compromises/${compromiseId}`,
        { headers: getAuthHeaders() }
      )
      
      if (!response.ok) {
        if (response.status === 404) return null
        
        // Handle 401 Unauthorized
        if (response.status === 401) {
          handleApiError(response)
          throw new CompromiseApiError('No autorizado - redirigiendo al login', 401)
        }

        let errorMessage = 'Error al obtener el compromiso'
        try {
          const errorDetails = await response.json()
          errorMessage = errorDetails?.message || errorMessage
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`
        }
        
        throw new CompromiseApiError(errorMessage, response.status)
      }
      
      const result = await response.json()
      return result.data || result
    } catch (error) {
      if (error instanceof CompromiseApiError) throw error
      throw new CompromiseApiError('Error al obtener el compromiso', 500)
    }
  },

  // Create a new compromise
  create: async (data: {
    taskId: string
    organizationId: string
    description: string
    startDate: string
    endDate: string
  }): Promise<Compromise> => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/compromises`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(data)
        }
      )
      
      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          handleApiError(response)
          throw new CompromiseApiError('No autorizado - redirigiendo al login', 401)
        }

        let errorMessage = 'Error al crear el compromiso'
        let errorDetails: ApiError | undefined
        
        try {
          errorDetails = await response.json()
          errorMessage = errorDetails?.message || errorMessage
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`
        }
        
        throw new CompromiseApiError(errorMessage, response.status, errorDetails?.error)
      }
      
      const result = await response.json()
      return result.data || result
    } catch (error) {
      if (error instanceof CompromiseApiError) throw error
      throw new CompromiseApiError('Error al crear el compromiso', 500)
    }
  },

  // Update compromise status
  updateStatus: async (compromiseId: string, status: Compromise['status']): Promise<Compromise> => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/compromises/${compromiseId}/status`,
        {
          method: 'PATCH',
          headers: getAuthHeaders(),
          body: JSON.stringify({ status })
        }
      )
      
      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          handleApiError(response)
          throw new CompromiseApiError('No autorizado - redirigiendo al login', 401)
        }

        let errorMessage = 'Error al actualizar el estado del compromiso'
        let errorDetails: ApiError | undefined
        
        try {
          errorDetails = await response.json()
          errorMessage = errorDetails?.message || errorMessage
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`
        }
        
        throw new CompromiseApiError(errorMessage, response.status, errorDetails?.error)
      }
      
      const result = await response.json()
      return result.data || result
    } catch (error) {
      if (error instanceof CompromiseApiError) throw error
      throw new CompromiseApiError('Error al actualizar el estado del compromiso', 500)
    }
  }
}
