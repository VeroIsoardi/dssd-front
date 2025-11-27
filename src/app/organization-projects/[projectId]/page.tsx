'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getProjects, ProjectApiError } from '@/services/projects'
import { taskService, TaskApiError } from '@/services/tasks'
import { Project } from '@/types/project'
import { Task } from '@/types/task'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingState } from '@/components/ui/loading-state'
import RequireAuth from '@/components/auth/RequireAuth'
import { formatDate } from '@/lib/utils/format'
import { USER_ROLES } from '@/lib/constants/roles'

interface CompromiseFormData {
  collaboratorName: string
  collaboratorEmail: string
  description: string
}

export default function OrganizationProjectDetailPage({
  params
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = use(params)
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CompromiseFormData>({
    collaboratorName: '',
    collaboratorEmail: '',
    description: ''
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsData, tasksData] = await Promise.all([
          getProjects(),
          taskService.getAll(projectId)
        ])
        
        const currentProject = projectsData.find(p => p.id === projectId)
        if (!currentProject) {
          toast.error('Proyecto no encontrado')
          router.push('/organization-projects')
          return
        }

        setProject(currentProject)
        setTasks(tasksData.filter(task => !task.isPrivate))
      } catch (error) {
        console.error('Error loading data:', error)
        if (error instanceof ProjectApiError || error instanceof TaskApiError) {
          toast.error('Error al cargar datos', {
            description: error.message
          })
        } else {
          toast.error('Error inesperado al cargar datos')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [projectId, router])

  const handleTakeTask = async (taskId: string) => {
    try {
      await taskService.grabTask(taskId)
      toast.success('Tarea tomada exitosamente')
      
      // Reload tasks to update the list
      const tasksData = await taskService.getAll(projectId)
      setTasks(tasksData.filter(task => !task.isPrivate))
    } catch (error) {
      console.error('Error taking task:', error)
      if (error instanceof TaskApiError) {
        toast.error('Error al tomar la tarea', {
          description: error.message
        })
      } else {
        toast.error('Error inesperado al tomar la tarea')
      }
    }
  }

  if (isLoading) {
    return (
      <RequireAuth allowedRoles={[USER_ROLES.ORGANIZATION]}>
        <div className="container mx-auto py-8">
          <LoadingState message="Cargando proyecto..." />
        </div>
      </RequireAuth>
    )
  }

  if (!project) {
    return null
  }

  return (
    <RequireAuth allowedRoles={[USER_ROLES.ORGANIZATION]}>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => router.push('/organization-projects')}
            className="mb-4"
          >
            ← Volver a Proyectos
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{project.name}</CardTitle>
              <CardDescription className="text-base mt-2">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-sm">
                  <span className="text-gray-500">ONG:</span>
                  <span className="ml-2 font-medium">{project.ongName}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Email:</span>
                  <span className="ml-2">{project.ongMail}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">País:</span>
                  <span className="ml-2 uppercase">{project.country}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Inicio:</span>
                  <span className="ml-2">{formatDate(project.startDate)}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Fin:</span>
                  <span className="ml-2">{formatDate(project.endDate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Tareas Disponibles</h2>
          {tasks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500">No hay tareas públicas disponibles en este proyecto</p>
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
                          <span className="text-gray-500">Inicio:</span>
                          <span className="ml-2">{formatDate(task.startDate)}</span>
                        </div>
                        
                        <div className="text-sm">
                          <span className="text-gray-500">Fin:</span>
                          <span className="ml-2">{formatDate(task.endDate)}</span>
                        </div>

                        <div className="pt-4 border-t">
                          <Button 
                            onClick={() => handleTakeTask(task.id)}
                            className="w-full"
                            disabled={task.collaboratorId !== null}
                          >
                            Tomar Tarea
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
      </div>
    </RequireAuth>
  )
}
