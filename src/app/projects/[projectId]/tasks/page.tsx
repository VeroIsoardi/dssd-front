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
  const [publicTasks, setPublicTasks] = useState<Task[]>([])
  const [privateTasks, setPrivateTasks] = useState<Task[]>([])
  const [isLoadingPublic, setIsLoadingPublic] = useState(true)
  const [isLoadingPrivate, setIsLoadingPrivate] = useState(true)
  const [activeTab, setActiveTab] = useState('public')

  useEffect(() => {
    const loadPublicTasks = async () => {
      try {
        const data = await taskService.getAll(projectId, false)
        setPublicTasks(data)
      } catch (error) {
        console.error('Error loading public tasks:', error)
        if (error instanceof TaskApiError) {
          toast.error('Error al cargar compromisos', {
            description: error.message
          })
        } else {
          toast.error('Error inesperado al cargar compromisos')
        }
      } finally {
        setIsLoadingPublic(false)
      }
    }

    loadPublicTasks()
  }, [projectId])

  useEffect(() => {
    const loadPrivateTasks = async () => {
      try {
        const data = await taskService.getAll(projectId, true)
        setPrivateTasks(data)
      } catch (error) {
        console.error('Error loading private tasks:', error)
        if (error instanceof TaskApiError) {
          toast.error('Error al cargar tareas privadas', {
            description: error.message
          })
        } else {
          toast.error('Error inesperado al cargar tareas privadas')
        }
      } finally {
        setIsLoadingPrivate(false)
      }
    }

    loadPrivateTasks()
  }, [projectId])

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Tareas</h1>
      </div>

      <Tabs defaultValue="public" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="public">
            Compromisos ({publicTasks.length})
          </TabsTrigger>
          <TabsTrigger value="private">
            Mis Tareas ({privateTasks.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="public">
          {isLoadingPublic ? (
            <LoadingState message="Cargando compromisos..." />
          ) : (
            <TaskList 
              tasks={publicTasks}
            />
          )}
        </TabsContent>
        
        <TabsContent value="private">
          {isLoadingPrivate ? (
            <LoadingState message="Cargando tareas privadas..." />
          ) : (
            <TaskList 
              tasks={privateTasks}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}