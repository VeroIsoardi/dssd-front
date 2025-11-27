import { Task, statusLabels } from '@/types/task'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils/format'

interface TaskCardProps {
  task: Task
  onEdit?: () => void
  onDelete?: () => void
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const getStatusColor = (status: Task['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    }
    return colors[status]
  }

  return (
    <Card className="p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg">{task.name}</h3>
            <Badge
              variant={task.isPrivate ? "secondary" : "outline"}
              className="ml-2"
            >
              {task.isPrivate ? 'Privada' : 'Pública'}
            </Badge>
          </div>
          <p className="text-gray-600 mb-4">{task.description}</p>
          <div className="space-y-2">
            <Badge className={getStatusColor(task.status)}>
              {statusLabels[task.status]}
            </Badge>
          </div>
        </div>
        {(onEdit || onDelete) && (
          <div className="flex space-x-2 ml-4">
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
        {task.completedAt && (
          <p>
            Completado: {formatDate(task.completedAt)}
          </p>
        )}
      </div>
    </Card>
  )
}