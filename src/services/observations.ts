import { Observation, CreateObservationPayload, AnswerObservationPayload } from '@/types/observation'
import { API_CONFIG } from '@/lib/constants'
import { getToken } from '@/services/auth'
import { handleApiError } from '@/lib/api-client'

export class ObservationApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public error?: string
  ) {
    super(message)
    this.name = 'ObservationApiError'
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

/**
 * Get all observations for a project review
 */
export async function getObservations(reviewId: string): Promise<Observation[]> {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/projects/reviews/${reviewId}/observations`,
      { headers: getAuthHeaders() }
    )
    
    if (!response.ok) {
      if (response.status === 401) handleApiError(response)
      
      let errorMessage = 'Error al cargar observaciones'
      try {
        const errorData = await response.json()
        errorMessage = errorData?.message || errorMessage
      } catch {
        errorMessage = `Error ${response.status}: ${response.statusText}`
      }
      
      throw new ObservationApiError(errorMessage, response.status)
    }
    
    return await response.json()
  } catch (error) {
    if (error instanceof ObservationApiError) throw error
    throw new ObservationApiError('Error inesperado al cargar observaciones', 500)
  }
}

/**
 * Create new observations for a project
 * @param projectId - The project ID
 * @param payload - Object containing array of observation strings
 * @returns Promise with created observations
 */
export async function createObservation(
  projectId: string,
  payload: CreateObservationPayload
): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/projects/${projectId}/observations`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      }
    )
    if (!response.ok) {
      if (response.status === 401) handleApiError(response)
      
      let errorMessage = 'Error al crear observaciones'
      try {
        const errorData = await response.json()
        errorMessage = errorData?.message || errorMessage
      } catch {
        errorMessage = `Error ${response.status}: ${response.statusText}`
      }
      
      throw new ObservationApiError(errorMessage, response.status)
    }

    return true
  } catch (error) {
    if (error instanceof ObservationApiError) throw error
    throw new ObservationApiError('Error inesperado al crear observaciones', 500)
  }
}

/**
 * Answer an observation (ONG only)
 */
export async function answerObservation(
  projectId: string,
  observationId: string,
  payload: AnswerObservationPayload
): Promise<Observation> {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/projects/${projectId}/observations/${observationId}/answer`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      }
    )
    
    if (!response.ok) {
      if (response.status === 401) handleApiError(response)
      
      let errorMessage = 'Error al responder observación'
      try {
        const errorData = await response.json()
        errorMessage = errorData?.message || errorMessage
      } catch {
        errorMessage = `Error ${response.status}: ${response.statusText}`
      }
      
      throw new ObservationApiError(errorMessage, response.status)
    }
    
    return await response.json()
  } catch (error) {
    if (error instanceof ObservationApiError) throw error
    throw new ObservationApiError('Error inesperado al responder observación', 500)
  }
}

/**
 * Mark an observation as completed (ONG only)
 */
export async function completeObservation(
  projectId: string,
  observationId: string
): Promise<Observation> {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/projects/${projectId}/observations/${observationId}/finish`,
      {
        method: 'POST',
        headers: getAuthHeaders()
      }
    )
    
    if (!response.ok) {
      if (response.status === 401) handleApiError(response)
      
      let errorMessage = 'Error al completar observación'
      try {
        const errorData = await response.json()
        errorMessage = errorData?.message || errorMessage
      } catch {
        errorMessage = `Error ${response.status}: ${response.statusText}`
      }
      
      throw new ObservationApiError(errorMessage, response.status)
    }
    
    return await response.json()
  } catch (error) {
    if (error instanceof ObservationApiError) throw error
    throw new ObservationApiError('Error inesperado al completar observación', 500)
  }
}
