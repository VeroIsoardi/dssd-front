'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getProjects, ProjectApiError } from '@/services/projects'
import { taskService, TaskApiError } from '@/services/tasks'
import { compromiseService, CompromiseApiError } from '@/services/compromises'
import { Project } from '@/types/project'
import { Task } from '@/types/task'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingState } from '@/components/ui/loading-state'
import RequireAuth from '@/components/auth/RequireAuth'
import { formatDate } from '@/lib/utils/format'
import { USER_ROLES } from '@/lib/constants/roles'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

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

  const handleCreateCompromise = (task: Task) => {
    setSelectedTask(task)
    setFormData({
      collaboratorName: '',
      collaboratorEmail: '',
      description: ''
    })
  }

  const handleSubmitCompromise = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedTask) return

    setIsSubmitting(true)
    try {
      await compromiseService.create({
        taskId: selectedTask.id,
        organizationId: '',
        description: formData.description,
        startDate: selectedTask.startDate,
        endDate: selectedTask.endDate
      })

      toast.success('Compromiso creado exitosamente')
      setSelectedTask(null)
      setFormData({
        collaboratorName: '',
        collaboratorEmail: '',
        description: ''
      })
    } catch (error) {
      console.error('Error creating compromise:', error)
      if (error instanceof CompromiseApiError) {
        toast.error('Error al crear compromiso', {
          description: error.message
        })
      } else {
        toast.error('Error inesperado al crear compromiso')
      }
    } finally {
      setIsSubmitting(false)
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

        {selectedTask ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Crear Compromiso para: {selectedTask.name}</CardTitle>
              <CardDescription>
                Completa el formulario para crear un compromiso y asignar un colaborador
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitCompromise} className="space-y-4">
                <div>
                  <Label htmlFor="collaboratorName">Nombre del Colaborador</Label>
                  <Input
                    id="collaboratorName"
                    value={formData.collaboratorName}
                    onChange={(e) => setFormData({ ...formData, collaboratorName: e.target.value })}
                    required
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                <div>
                  <Label htmlFor="collaboratorEmail">Email del Colaborador</Label>
                  <Input
                    id="collaboratorEmail"
                    type="email"
                    value={formData.collaboratorEmail}
                    onChange={(e) => setFormData({ ...formData, collaboratorEmail: e.target.value })}
                    required
                    placeholder="colaborador@ejemplo.com"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descripción del Compromiso</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    placeholder="Describe el compromiso y los detalles de la colaboración"
                    rows={4}
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-500">Fecha de inicio:</span>
                    <span className="ml-2 font-medium">{formatDate(selectedTask.startDate)}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Fecha de fin:</span>
                    <span className="ml-2 font-medium">{formatDate(selectedTask.endDate)}</span>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedTask(null)}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creando...' : 'Crear Compromiso'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
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
                            onClick={() => handleCreateCompromise(task)}
                            className="w-full"
                            disabled={task.collaboratorId !== null }
                          >
                            Crear Compromiso
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </RequireAuth>
  )
}
