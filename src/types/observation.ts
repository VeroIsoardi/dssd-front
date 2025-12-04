export type ObservationStatus = 'pending' | 'answered' | 'completed'

export interface Observation {
  id: string
  observation: string
  isFinished: boolean
  answer?: string
  endDate?: string | null
  createdAt: string
  updatedAt: string
  reviewId: string
  createdById: string
  director?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  answerer?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  // Computed property for UI
  status?: ObservationStatus
}

export interface CreateObservationPayload {
  observations: string[]
}

export interface AnswerObservationPayload {
  answer: string
}
