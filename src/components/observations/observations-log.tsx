'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Observation, ObservationStatus } from '@/types/observation'
import { completeObservation, ObservationApiError } from '@/services/observations'
import { formatDate } from '@/lib/utils/format'
import { MessageSquare, CheckCircle2, Clock, User } from 'lucide-react'

interface ObservationsLogProps {
  observations: Observation[]
  projectId: string
  canComplete?: boolean
  onUpdate?: () => void
}

const statusConfig: Record<ObservationStatus, { label: string; variant: 'default' | 'secondary' | 'outline'; icon: typeof Clock }> = {
  pending: { label: 'Pendiente', variant: 'secondary', icon: Clock },
  answered: { label: 'Respondida', variant: 'default', icon: MessageSquare },
  completed: { label: 'Completada', variant: 'outline', icon: CheckCircle2 }
}

export function ObservationsLog({ 
  observations, 
  projectId, 
  canComplete = false,
  onUpdate 
}: ObservationsLogProps) {
  const [completingId, setCompletingId] = useState<string | null>(null)

  const handleComplete = async (observationId: string) => {
    setCompletingId(observationId)
    try {
      await completeObservation(projectId, observationId)
      toast.success('Observación completada')
      onUpdate?.()
    } catch (err) {
      console.error('Error completing observation', err)
      if (err instanceof ObservationApiError) {
        toast.error('Error al completar', { description: err.message })
      } else {
        toast.error('Error inesperado al completar')
      }
    } finally {
      setCompletingId(null)
    }
  }

  if (observations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p>No hay observaciones aún</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {observations.map((observation) => {
        // Determine status based on API fields
        const status: ObservationStatus = observation.isFinished 
          ? 'completed' 
          : observation.answer 
            ? 'answered' 
            : 'pending'
        const statusInfo = statusConfig[status]
        const StatusIcon = statusInfo.icon

        return (
          <Card key={observation.id} className="shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">
                      {observation.director 
                        ? `${observation.director.firstName} ${observation.director.lastName}`
                        : 'Director'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(observation.createdAt)}
                    </span>
                  </div>
                  <Badge variant={statusInfo.variant}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>

                {/* Observation Content */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{observation.observation}</p>
                </div>

                {/* Answer Section */}
                {observation.answer && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Respuesta de la ONG</span>
                        {observation.answeredAt && (
                          <span className="text-xs text-gray-500">
                            {formatDate(observation.answeredAt)}
                          </span>
                        )}
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700">{observation.answer}</p>
                      </div>
                      {observation.answerer && (
                        <p className="text-xs text-gray-500">
                          Respondida por: {observation.answerer.firstName} {observation.answerer.lastName}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Actions */}
                {canComplete && !observation.isFinished && (
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleComplete(observation.id)}
                      loading={completingId === observation.id}
                    >
                      {completingId === observation.id ? 'Completando...' : 'Marcar como Completada'}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
