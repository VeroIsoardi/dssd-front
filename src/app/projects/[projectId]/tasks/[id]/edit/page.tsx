'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { TaskForm } from '@/components/tasks/task-form'
import { taskService, TaskApiError } from '@/services/tasks'
import { LoadingState } from '@/components/ui/loading-state'
import type { TaskFormData } from '@/components/tasks/task-form'
import type { Task } from '@/types/task'

export default function EditTaskPage({
  params
}: {
  params: { projectId: string; id: string }
}) {
  const [task, setTask] = useState<Task | null>(null)
  const [isFetching, setIsFetching] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
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
        setIsFetching(false)
      }
    }

    loadTask()
  }, [params.projectId, params.id, router])

  const handleSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true)
    try {
      await taskService.update(params.projectId, params.id, data)
      toast.success('Tarea actualizada exitosamente')
      router.push(`/projects/${params.projectId}/tasks`)
    } catch (error) {
      console.error('Error updating task:', error)
      if (error instanceof TaskApiError) {
        toast.error('Error al actualizar tarea', {
          description: error.message
        })
      } else {
        toast.error('Error inesperado al actualizar tarea')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isFetching) {
    return (
      <div className="container text-center mx-auto py-8">
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
      <h1 className="text-2xl font-bold mb-8">Editar Tarea</h1>
      <div className="max-w-2xl">
        <TaskForm 
          initialData={task}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  )
}