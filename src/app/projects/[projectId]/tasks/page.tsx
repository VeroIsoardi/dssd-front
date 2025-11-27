'use client'

import { use, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Task } from '@/types/task'
import { taskService, TaskApiError } from '@/services/tasks'
import { TaskList } from '@/components/tasks/task-list'
import { LoadingState } from '@/components/ui/loading-state'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function TasksPage({
  params
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = use(params)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await taskService.getAll(projectId)
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
  }, [projectId])

  const publicTasks = tasks.filter(task => !task.isPrivate)
  const privateTasks = tasks.filter(task => task.isPrivate)

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Tareas</h1>
      </div>

      {isLoading ? (
        <LoadingState message="Cargando tareas..." />
      ) : (
        <Tabs defaultValue="public" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="public">
              Tareas públicas
            </TabsTrigger>
            <TabsTrigger value="private">
              Tareas privadas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="public">
            <TaskList 
              tasks={publicTasks}
            />
          </TabsContent>
          
          <TabsContent value="private">
            <TaskList 
              tasks={privateTasks}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}