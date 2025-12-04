export type ObservationStatus = 'pending' | 'answered' | 'resolved'

export interface Observation {
  id: string
  projectId: string
  directorId: string
  content: string
  status: ObservationStatus
  answer?: string
  answeredAt?: string
  answeredBy?: string
  createdAt: string
  updatedAt: string
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
}

export interface CreateObservationPayload {
  content: string
}

export interface AnswerObservationPayload {
  answer: string
}
