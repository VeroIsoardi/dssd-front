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
    const reviewId = '990e8400-e29b-41d4-a716-446655440003';
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
 * Create a new observation for a project
 */
export async function createObservation(
  projectId: string,
  payload: CreateObservationPayload
): Promise<Observation> {
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
      
      let errorMessage = 'Error al crear observación'
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
    throw new ObservationApiError('Error inesperado al crear observación', 500)
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
 * Mark an observation as resolved/finished
 */
export async function resolveObservation(
  observationId: string
): Promise<Observation> {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/projects/observations/${observationId}/finish`,
      {
        method: 'POST',
        headers: getAuthHeaders()
      }
    )
    
    if (!response.ok) {
      if (response.status === 401) handleApiError(response)
      
      let errorMessage = 'Error al resolver observación'
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
    throw new ObservationApiError('Error inesperado al resolver observación', 500)
  }
}
