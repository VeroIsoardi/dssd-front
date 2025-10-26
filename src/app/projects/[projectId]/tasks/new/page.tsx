'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { TaskForm } from '@/components/tasks/task-form'
import { taskService, TaskApiError } from '@/services/tasks'
import type { TaskFormData } from '@/components/tasks/task-form'

export default function NewTaskPage({
  params
}: {
  params: { projectId: string }
}) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (data: TaskFormData) => {
    setIsLoading(true)
    try {
      await taskService.create(params.projectId, [data])
      toast.success('Tarea creada exitosamente')
      router.push(`/projects/${params.projectId}/tasks`)
    } catch (error) {
      console.error('Error creating task:', error)
      if (error instanceof TaskApiError) {
        toast.error('Error al crear tarea', {
          description: error.message
        })
      } else {
        toast.error('Error inesperado al crear tarea')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Crear nueva tarea</h1>
      <div className="max-w-2xl">
        <TaskForm 
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

