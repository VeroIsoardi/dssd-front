'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { TaskCard } from '@/components/tasks/task-card'
import { taskService, TaskApiError } from '@/services/tasks'
import { Button } from '@/components/ui/button'
import { LoadingState } from '@/components/ui/loading-state'
import type { Task } from '@/types/task'

export default function TaskDetailPage({
  params
}: {
  params: { projectId: string; id: string }
}) {
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadTask = async () => {
      try {
        const data = await taskService.getById(params.projectId, params.id)
        if (data) {
          setTask(data)
        } else {
          toast.error('Tarea no encontrada')
          router.push(`/projects/${params.projectId}/tasks`)
        }
      } catch (error) {
        console.error('Error loading task:', error)
        if (error instanceof TaskApiError) {
          toast.error('Error al cargar tarea', {
            description: error.message
          })
        } else {
          toast.error('Error inesperado al cargar tarea')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadTask()
  }, [params.projectId, params.id, router])

  const handleEdit = () => {
    router.push(`/projects/${params.projectId}/tasks/${params.id}/edit`)
  }

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      return
    }

    try {
      await taskService.delete(params.projectId, params.id)
      toast.success('Tarea eliminada exitosamente')
      router.push(`/projects/${params.projectId}/tasks`)
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

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <LoadingState message="Cargando tarea..." />
      </div>
    )
  }

  if (!task) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Tarea no encontrada</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Detalles de la Tarea</h1>
        <div className="space-x-4">
          <Button variant="outline" onClick={() => router.push(`/projects/${params.projectId}/tasks`)}>
            Volver a Lista
          </Button>
          <Button onClick={handleEdit}>
            Editar
          </Button>
        </div>
      </div>
      
      <div className="max-w-2xl">
        <TaskCard 
          task={task}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}