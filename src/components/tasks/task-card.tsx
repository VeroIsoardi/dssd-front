import { Task, statusLabels } from '@/types/task'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { format } from 'date-fns'

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
        <div>
          <h3 className="font-semibold text-lg mb-2">{task.name}</h3>
          <p className="text-gray-600 mb-4">{task.description}</p>
          <div className="space-y-2">
            <Badge className={getStatusColor(task.status)}>
              {statusLabels[task.status]}
            </Badge>
          </div>
        </div>
        {(onEdit || onDelete) && (
          <div className="space-x-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="text-blue-600 hover:text-blue-800"
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="text-red-600 hover:text-red-800"
              >
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>
          Period: {format(new Date(task.startDate), 'MMM d, yyyy')} -{' '}
          {format(new Date(task.endDate), 'MMM d, yyyy')}
        </p>
        {task.completedAt && (
          <p>
            Completed: {format(new Date(task.completedAt), 'MMM d, yyyy')}
          </p>
        )}
      </div>
    </Card>
  )
}