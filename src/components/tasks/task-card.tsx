import { Task } from '@/types/task'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils/format'

interface TaskCardProps {
  task: Task
  onEdit?: () => void
  onDelete?: () => void
  onComplete?: () => void
  onGrab?: () => void
  isGrabbing?: boolean
  isCompleting?: boolean
}

export function TaskCard({ task, onEdit, onDelete, onComplete, onGrab, isGrabbing, isCompleting }: TaskCardProps) {
  return (
    <Card className="p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">{task.name}</h3>
          <p className="text-gray-600 mb-4">{task.description}</p>
        </div>
        {(onEdit || onDelete || onComplete || onGrab) && (
          <div className="flex space-x-2 ml-4">
            {onGrab && !task.collaboratorId && !task.isFinished && (
              <Button 
                variant="default"
                onClick={onGrab}
                loading={isGrabbing}
              >
                {isGrabbing ? 'Tomando...' : 'Tomar Tarea'}
              </Button>
            )}
            {onComplete && !task.isFinished && (
              <Button 
                variant="default"
                onClick={onComplete}
                loading={isCompleting}
              >
                {isCompleting ? 'Completando...' : 'Completar'}
              </Button>
            )}
            {onEdit && (
              <Button variant="outline" onClick={onEdit}>
                Editar
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="ghost" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={onDelete}
              >
                Eliminar
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>
          Período: {formatDate(task.startDate)} - {formatDate(task.endDate)}
        </p>
      </div>
    </Card>
  )
}