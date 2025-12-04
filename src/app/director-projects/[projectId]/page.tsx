'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import RequireAuth from '@/components/auth/RequireAuth'
import { USER_ROLES } from '@/lib/constants/roles'
import { LoadingState } from '@/components/ui/loading-state'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getProjects, getProjectReviews, ProjectApiError } from '@/services/projects'
import { taskService, TaskApiError } from '@/services/tasks'
import { getObservations, createObservation, ObservationApiError } from '@/services/observations'
import { ObservationsLog } from '@/components/observations/observations-log'
import type { Project } from '@/types/project'
import type { Task } from '@/types/task'
import type { Observation } from '@/types/observation'
import { formatDate } from '@/lib/utils/format'
import { Calendar, MapPin, ArrowLeft, MessageSquarePlus } from 'lucide-react'

export default function DirectorProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params?.projectId as string

  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [observations, setObservations] = useState<Observation[]>([])
  const [reviewId, setReviewId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newObservation, setNewObservation] = useState('')
  const [isSubmittingObservation, setIsSubmittingObservation] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!projectId) return

      try {
        // Get tasks and reviews in parallel
        const [tasksData, reviews] = await Promise.all([
          taskService.getAll(projectId, false),
          getProjectReviews(projectId)
        ])
        
        setTasks(tasksData)

        // Get observations from the first review if available
        if (reviews && reviews.length > 0) {
          const latestReviewId = reviews[0].id
          setReviewId(latestReviewId)
          
          const observationsData = await getObservations(latestReviewId)
          setObservations(observationsData)
        }

        // Get all projects to find project details
        const allProjects = await getProjects()
        const projectData = allProjects.find(p => p.id === projectId)
        if (!projectData) {
          throw new ProjectApiError('Proyecto no encontrado', 404)
        }
        setProject(projectData)
      } catch (err) {
        console.error('Failed to load project data', err)
        if (err instanceof ProjectApiError || err instanceof TaskApiError || err instanceof ObservationApiError) {
          toast.error('Error al cargar proyecto', { description: err.message })
        } else {
          toast.error('Error inesperado al cargar proyecto')
        }
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [projectId])

  if (isLoading) {
    return (
      <RequireAuth allowedRoles={[USER_ROLES.DIRECTOR]}>
        <div className="container mx-auto py-8 px-4">
          <LoadingState message="Cargando proyecto..." />
        </div>
      </RequireAuth>
    )
  }

  if (!project) {
    return (
      <RequireAuth allowedRoles={[USER_ROLES.DIRECTOR]}>
        <div className="container mx-auto py-8 px-4">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">Proyecto no encontrado</p>
              <Button onClick={() => router.push('/director-projects')}>
                Volver a Proyectos
              </Button>
            </CardContent>
          </Card>
        </div>
      </RequireAuth>
    )
  }

  const completedTasks = tasks.filter(t => t.isFinished).length
  const totalTasks = tasks.length
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const handleCreateObservation = async () => {
    if (!newObservation.trim()) {
      toast.error('Por favor ingrese una observación')
      return
    }

    setIsSubmittingObservation(true)
    try {
      await createObservation(projectId, { content: newObservation })
      toast.success('Observación creada')
      setNewObservation('')
      
      // Reload observations from the review
      if (reviewId) {
        const observationsData = await getObservations(reviewId)
        setObservations(observationsData)
      }
    } catch (err) {
      console.error('Error creating observation', err)
      if (err instanceof ObservationApiError) {
        toast.error('Error al crear observación', { description: err.message })
      } else {
        toast.error('Error inesperado al crear observación')
      }
    } finally {
      setIsSubmittingObservation(false)
    }
  }

  const handleObservationsUpdate = async () => {
    if (!reviewId) return
    
    try {
      const observationsData = await getObservations(reviewId)
      setObservations(observationsData)
    } catch (err) {
      console.error('Error reloading observations', err)
    }
  }

  return (
    <RequireAuth allowedRoles={[USER_ROLES.DIRECTOR]}>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/director-projects')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Proyectos
          </Button>
        </div>

        {/* Project Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl mb-2">{project.name}</CardTitle>
            <p className="text-gray-600">{project.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="font-medium">País:</span>
                <span className="text-gray-600">{project.country}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Período:</span>
                <span className="text-gray-600">
                  {formatDate(project.startDate)} - {formatDate(project.endDate)}
                </span>
              </div>
            </div>

            <Separator />

            {/* Progress Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Progreso del Proyecto</span>
                <span className="text-gray-600">{completedTasks} / {totalTasks} tareas completadas</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 text-right">{progressPercentage}% completado</p>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Tasks and Observations */}
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks">
              Tareas ({totalTasks})
            </TabsTrigger>
            <TabsTrigger value="observations">
              Observaciones ({observations.length})
            </TabsTrigger>
          </TabsList>

          {/* Tasks Tab */}
          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Tareas del Proyecto</CardTitle>
              </CardHeader>
              <CardContent>
                {tasks.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No hay tareas en este proyecto</p>
                ) : (
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <Card key={task.id} className="shadow-sm">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2">{task.name}</h3>
                              <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                              
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Inicio: {formatDate(task.startDate)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Fin: {formatDate(task.endDate)}</span>
                                </div>
                              </div>

                              {task.collaboratorId && (
                                <div className="mt-2 text-xs text-gray-500">
                                  Asignada a colaborador
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Observations Tab */}
          <TabsContent value="observations">
            <Card>
              <CardHeader>
                <CardTitle>Observaciones del Proyecto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Create New Observation Form */}
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MessageSquarePlus className="h-4 w-4" />
                    <span>Nueva Observación</span>
                  </div>
                  <Textarea
                    placeholder="Escribe tu observación aquí..."
                    value={newObservation}
                    onChange={(e) => setNewObservation(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <Button
                    onClick={handleCreateObservation}
                    loading={isSubmittingObservation}
                    disabled={!newObservation.trim()}
                  >
                    {isSubmittingObservation ? 'Creando...' : 'Crear Observación'}
                  </Button>
                </div>

                <Separator />

                {/* Observations Log */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Historial de Observaciones</h3>
                  <ObservationsLog
                    observations={observations}
                    projectId={projectId}
                    canResolve={true}
                    onUpdate={handleObservationsUpdate}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RequireAuth>
  )
}
