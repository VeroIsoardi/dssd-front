'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import RequireAuth from '@/components/auth/RequireAuth'
import { USER_ROLES } from '@/lib/constants/roles'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingState } from '@/components/ui/loading-state'
import { formatDate } from '@/lib/utils/format'
import { taskService, TaskApiError } from '@/services/tasks'
import { AssignedTask } from '@/types/task'

export default function CompromisesPage() {
  const [tasks, setTasks] = useState<AssignedTask[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null)

  const loadTasks = async () => {
    try {
      const response = await taskService.getAssignedTasks()
      setTasks(response.data)
    } catch (error) {
      console.error('Error loading assigned tasks:', error)
      if (error instanceof TaskApiError) {
        toast.error('Error al cargar las tareas', {
          description: error.message
        })
      } else {
        toast.error('Error inesperado al cargar las tareas')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const handleFinishTask = async (taskId: string) => {
    setLoadingTaskId(taskId)
    try {
      await taskService.finishTask(taskId)
      toast.success('Tarea completada exitosamente')
      // Reload tasks to update the UI
      await loadTasks()
    } catch (error) {
      console.error('Error finishing task:', error)
      if (error instanceof TaskApiError) {
        toast.error('Error al completar la tarea', {
          description: error.message
        })
      } else {
        toast.error('Error inesperado al completar la tarea')
      }
    } finally {
      setLoadingTaskId(null)
    }
  }

  return (
    <RequireAuth allowedRoles={[USER_ROLES.ORGANIZATION]}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Compromisos</h1>
            <p className="text-gray-600 mt-2">Gestiona las tareas asignadas a tu organización</p>
          </div>
        </div>

        {isLoading ? (
          <LoadingState message="Cargando tareas..." />
        ) : tasks.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Sin compromisos</CardTitle>
              <CardDescription>
                No tenés compromisos asignados todavía
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Las compromisos asignados a tu organización aparecerán aquí cuando sean creados.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <Card key={task.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{task.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {task.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="text-gray-500">Proyecto:</span>
                      <span className="ml-2 font-medium">{task.project.name}</span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-gray-500">ONG:</span>
                      <span className="ml-2">{task.project.ong.name}</span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-gray-500">Colaborador:</span>
                      <span className="ml-2 font-medium">{task.collaborator.name}</span>
                    </div>

                    <div className="text-sm">
                      <span className="text-gray-500">Email:</span>
                      <span className="ml-2">{task.collaborator.email}</span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-gray-500">Inicio:</span>
                      <span className="ml-2">{formatDate(task.startDate)}</span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-gray-500">Fin:</span>
                      <span className="ml-2">{formatDate(task.endDate)}</span>
                    </div>

                    <div className="text-sm">
                      <span className="text-gray-500">País:</span>
                      <span className="ml-2 uppercase">{task.project.country}</span>
                    </div>

                    {!task.isFinished && (
                      <div className="pt-4 border-t">
                        <Button 
                          className="w-full"
                          onClick={() => handleFinishTask(task.id)}
                          disabled={loadingTaskId === task.id}
                        >
                          {loadingTaskId === task.id ? 'Completando...' : 'Marcar como Completada'}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>
    </RequireAuth>
  )
}
