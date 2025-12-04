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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getProjects, getProjectReviews, ProjectApiError } from '@/services/projects'
import { taskService, TaskApiError } from '@/services/tasks'
import { getObservations, ObservationApiError } from '@/services/observations'
import { ObservationsLog } from '@/components/observations/observations-log'
import type { Project } from '@/types/project'
import type { Task } from '@/types/task'
import type { Observation } from '@/types/observation'
import { formatDate } from '@/lib/utils/format'
import { Calendar, MapPin, ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function OngProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params?.projectId as string

  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [reviews, setReviews] = useState<Array<{ id: string; observations: Observation[] }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!projectId) return

      try {
        // Get tasks and reviews in parallel
        const [tasksData, reviewsData] = await Promise.all([
          taskService.getAll(projectId, false),
          getProjectReviews(projectId)
        ])
        
        setTasks(tasksData)

        // Get observations for each review
        if (reviewsData && reviewsData.length > 0) {
          const reviewsWithObservations: Array<{ id: string; observations: Observation[] }> = []
          for (const review of reviewsData) {
            try {
              const observationsData = await getObservations(review.id)
              reviewsWithObservations.push({ id: review.id, observations: observationsData })
            } catch (err) {
              console.error(`Failed to load observations for review ${review.id}`, err)
              reviewsWithObservations.push({ id: review.id, observations: [] })
            }
          }
          setReviews(reviewsWithObservations)
          // Set the first review as active by default
          if (reviewsWithObservations.length > 0) {
            setActiveReviewId(reviewsWithObservations[0].id)
          }
        } else {
          setReviews([])
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

  const handleObservationsUpdate = async () => {
    try {
      const reviewsData = await getProjectReviews(projectId)
      if (reviewsData && reviewsData.length > 0) {
        const reviewsWithObservations = await Promise.all(
          reviewsData.map(async (review) => {
            const observationsData = await getObservations(review.id)
            return { id: review.id, observations: observationsData }
          })
        )
        setReviews(reviewsWithObservations)
      } else {
        setReviews([])
      }
    } catch (err) {
      console.error('Error reloading observations', err)
      toast.error('Error al recargar observaciones')
    }
  }

  const activeReview = reviews.find(r => r.id === activeReviewId)
  const activeObservations = activeReview?.observations || []
  const totalObservations = reviews.reduce((sum, r) => sum + r.observations.length, 0)

  if (isLoading) {
    return (
      <RequireAuth allowedRoles={[USER_ROLES.ONG]}>
        <div className="container mx-auto py-8 px-4">
          <LoadingState message="Cargando proyecto..." />
        </div>
      </RequireAuth>
    )
  }

  if (!project) {
    return (
      <RequireAuth allowedRoles={[USER_ROLES.ONG]}>
        <div className="container mx-auto py-8 px-4">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">Proyecto no encontrado</p>
              <Button onClick={() => router.push('/projects')}>
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

  return (
    <RequireAuth allowedRoles={[USER_ROLES.ONG]}>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/projects')}
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
              Observaciones ({totalObservations})
            </TabsTrigger>
          </TabsList>

          {/* Tasks Tab */}
          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Tareas del Proyecto</CardTitle>
                  <Button
                    onClick={() => router.push(`/projects/${projectId}/tasks`)}
                    variant="outline"
                  >
                    Ver Todas las Tareas
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {tasks.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No hay tareas en este proyecto</p>
                ) : (
                  <div className="space-y-4">
                    {tasks.slice(0, 5).map((task) => (
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
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {tasks.length > 5 && (
                      <p className="text-center text-sm text-gray-500">
                        Y {tasks.length - 5} tareas más...
                      </p>
                    )}
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
                <p className="text-sm text-gray-600 mt-2">
                  {reviews.length === 0 && 'No hay revisiones con observaciones aún'}
                  {reviews.length === 1 && '1 revisión con observaciones'}
                  {reviews.length > 1 && `${reviews.length} revisiones con observaciones`}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No hay revisiones con observaciones aún</p>
                ) : (
                  <Tabs value={activeReviewId || undefined} onValueChange={setActiveReviewId} className="w-full">
                    <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
                      {reviews.map((review, index) => {
                        const allCompleted = review.observations.every(o => o.isFinished)
                        const hasObservations = review.observations.length > 0
                        return (
                          <TabsTrigger 
                            key={review.id} 
                            value={review.id}
                            className="flex items-center gap-2"
                          >
                            Revisión {reviews.length - index}
                            {allCompleted && hasObservations && (
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                            )}
                            <span className="text-xs opacity-70">
                              ({review.observations.length})
                            </span>
                          </TabsTrigger>
                        )
                      })}
                    </TabsList>

                    {reviews.map((review) => (
                      <TabsContent key={review.id} value={review.id} className="space-y-4">
                        {review.observations.length === 0 ? (
                          <p className="text-center text-gray-500 py-8">No hay observaciones en esta revisión</p>
                        ) : (
                          <ObservationsLog
                            observations={review.observations}
                            projectId={projectId}
                            canComplete={true}
                            onUpdate={handleObservationsUpdate}
                          />
                        )}
                      </TabsContent>
                    ))}
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RequireAuth>
  )
}
