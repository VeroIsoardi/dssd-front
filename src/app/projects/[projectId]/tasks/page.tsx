'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Task } from '@/types/task'
import { taskService, TaskApiError } from '@/services/tasks'
import { TaskList } from '@/components/tasks/task-list'
import { Button } from '@/components/ui/button'
import { LoadingState } from '@/components/ui/loading-state'

export default function TasksPage({
  params
}: {
  params: { projectId: string }
}) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await taskService.getAll(params.projectId)
        setTasks(data)
      } catch (error) {
        console.error('Error loading tasks:', error)
        if (error instanceof TaskApiError) {
          toast.error('Error al cargar tareas', {
            description: error.message
          })
        } else {
          toast.error('Error inesperado al cargar tareas')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [params.projectId])

  const handleEdit = (task: Task) => {
    router.push(`/projects/${params.projectId}/tasks/${task.id}/edit`)
  }

  const handleDelete = async (task: Task) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      return
    }

    try {
      await taskService.delete(params.projectId, task.id)
      setTasks(prevTasks => 
        prevTasks.filter(t => t.id !== task.id)
      )
      toast.success('Tarea eliminada exitosamente')
    } catch (error) {
      console.error('Error deleting task:', error)
      if (error instanceof TaskApiError) {
        toast.error('Error al eliminar tarea', {
          description: error.message
        })
      } else {
        toast.error('Error inesperado al eliminar tarea')
      }
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Tareas</h1>
        <div className="space-x-4">
          <Button variant="outline" onClick={() => router.push('/projects')}>
            Volver a Proyectos
          </Button>
          <Button onClick={() => router.push(`/projects/${params.projectId}/tasks/new`)}>
            Crear nueva tarea
          </Button>
        </div>
      </div>

      {isLoading ? (
        <LoadingState message="Cargando tareas..." />
      ) : (
        <TaskList 
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}