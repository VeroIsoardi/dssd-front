import { Task } from '@/types/task'
import { TaskCard } from './task-card'

interface TaskListProps {
  tasks: Task[]
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
  onComplete?: (task: Task) => void
  onGrab?: (task: Task) => void
}

export function TaskList({ tasks, onEdit, onDelete, onComplete, onGrab }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay tareas disponibles que coincidan con los criterios seleccionados.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task, index) => (
        <TaskCard
          key={task.id || `task-${index}`}
          task={task}
          onEdit={onEdit ? () => onEdit(task) : undefined}
          onDelete={onDelete ? () => onDelete(task) : undefined}
          onComplete={onComplete ? () => onComplete(task) : undefined}
          onGrab={onGrab ? () => onGrab(task) : undefined}
        />
      ))}
    </div>
  )
}