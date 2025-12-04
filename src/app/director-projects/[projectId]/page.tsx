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
import { getProjects, getProjectReviews, finishReview, ProjectApiError } from '@/services/projects'
import { taskService, TaskApiError } from '@/services/tasks'
import { getObservations, createObservation, ObservationApiError } from '@/services/observations'
import { ObservationsLog } from '@/components/observations/observations-log'
import type { Project } from '@/types/project'
import type { Task } from '@/types/task'
import type { Observation } from '@/types/observation'
import { formatDate } from '@/lib/utils/format'
import { Calendar, MapPin, ArrowLeft, MessageSquarePlus, CheckCircle2 } from 'lucide-react'

export default function DirectorProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params?.projectId as string

  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [reviews, setReviews] = useState<Array<{ id: string; observations: Observation[] }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newObservations, setNewObservations] = useState<string[]>([''])
  const [isSubmittingObservation, setIsSubmittingObservation] = useState(false)
  const [isFinishingReview, setIsFinishingReview] = useState<string | null>(null)
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
        console.log('Reviews data received:', reviewsData)
        if (reviewsData && reviewsData.length > 0) {
          const reviewsWithObservations: Array<{ id: string; observations: Observation[] }> = []
          for (const review of reviewsData) {
            try {
              const observationsData = await getObservations(review.id)
              console.log(`Observations for review ${review.id}:`, observationsData)
              reviewsWithObservations.push({ id: review.id, observations: observationsData })
            } catch (err) {
              console.error(`Failed to load observations for review ${review.id}`, err)
              // Still add the review but with empty observations
              reviewsWithObservations.push({ id: review.id, observations: [] })
            }
          }
          console.log('Reviews with observations:', reviewsWithObservations)
          setReviews(reviewsWithObservations)
          // Set the first review as active by default
          if (reviewsWithObservations.length > 0) {
            setActiveReviewId(reviewsWithObservations[0].id)
          }
        } else {
          console.log('No reviews found, setting empty array')
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

  // Get the last review (most recent)
  const lastReview = reviews.length > 0 ? reviews[reviews.length - 1] : null
  const lastReviewObservations = lastReview?.observations || []
  const totalObservations = reviews.reduce((sum, r) => sum + r.observations.length, 0)
  console.log('Reviews:', reviews.length, 'Total observations:', totalObservations)
  const activeReview = reviews.find(r => r.id === activeReviewId)
  const activeObservations = activeReview?.observations || []
  const allObservationsCompleted = activeObservations.length > 0 && activeObservations.every(o => o.isFinished)

  const handleCreateObservation = async () => {
    // Filter out empty observations
    const validObservations = newObservations.filter(obs => obs.trim())
    
    if (validObservations.length === 0) {
      toast.error('Por favor ingrese al menos una observación')
      return
    }

    setIsSubmittingObservation(true)
    try {
      // Send observations in the required format
      await createObservation(projectId, { observations: validObservations })
      toast.success(`${validObservations.length} observación(es) creada(s)`)
      setNewObservations([''])
      
      // Reload all reviews because creating observations creates a new review
      const reviewsData = await getProjectReviews(projectId)
      console.log('Reviews data after creation:', reviewsData)
      if (reviewsData && reviewsData.length > 0) {
        const reviewsWithObservations = await Promise.all(
          reviewsData.map(async (review) => {
            const observationsData = await getObservations(review.id)
            return { id: review.id, observations: observationsData }
          })
        )
        setReviews(reviewsWithObservations)
      }
    } catch (err) {
      console.error('Error creating observation', err)
      if (err instanceof ObservationApiError) {
        toast.error('Error al crear observaciones', { description: err.message })
      } else {
        toast.error('Error inesperado al crear observaciones')
      }
    } finally {
      setIsSubmittingObservation(false)
    }
  }

  const handleAddObservation = () => {
    setNewObservations([...newObservations, ''])
  }

  const handleRemoveObservation = (index: number) => {
    if (newObservations.length > 1) {
      setNewObservations(newObservations.filter((_, i) => i !== index))
    }
  }

  const handleObservationChange = (index: number, value: string) => {
    const updated = [...newObservations]
    updated[index] = value
    setNewObservations(updated)
  }

  const handleObservationsUpdate = async () => {
    if (!activeReviewId) return
    
    try {
      const observationsData = await getObservations(activeReviewId)
      setReviews(prev => prev.map(r => 
        r.id === activeReviewId ? { ...r, observations: observationsData } : r
      ))
    } catch (err) {
      console.error('Error reloading observations', err)
    }
  }

  const handleFinishReview = async (reviewId: string) => {
    setIsFinishingReview(reviewId)
    try {
      await finishReview(reviewId)
      toast.success('Revisión finalizada exitosamente')
      
      // Reload observations to reflect the change
      const observationsData = await getObservations(reviewId)
      setReviews(prev => prev.map(r => 
        r.id === reviewId ? { ...r, observations: observationsData } : r
      ))
    } catch (err) {
      console.error('Error finishing review', err)
      if (err instanceof ProjectApiError) {
        toast.error('Error al finalizar revisión', { description: err.message })
      } else {
        toast.error('Error inesperado al finalizar revisión')
      }
    } finally {
      setIsFinishingReview(null)
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
              Observaciones ({totalObservations})
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
                <p className="text-sm text-gray-600 mt-2">
                  {reviews.length === 0 && 'No hay revisiones creadas aún'}
                  {reviews.length === 1 && '1 revisión del proyecto'}
                  {reviews.length > 1 && `${reviews.length} revisiones del proyecto`}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Create New Observations Form - Always visible for Directors */}
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <MessageSquarePlus className="h-4 w-4" />
                      <span>Nuevas Observaciones</span>
                    </div>
                    <Button
                      onClick={handleAddObservation}
                      variant="outline"
                      size="sm"
                      type="button"
                    >
                      Agregar Observación
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {newObservations.map((observation, index) => (
                      <div key={index} className="flex gap-2">
                        <Textarea
                          placeholder={`Observación ${index + 1}...`}
                          value={observation}
                          onChange={(e) => handleObservationChange(index, e.target.value)}
                          rows={3}
                          className="resize-none flex-1"
                        />
                        {newObservations.length > 1 && (
                          <Button
                            onClick={() => handleRemoveObservation(index)}
                            variant="ghost"
                            size="sm"
                            type="button"
                            className="self-start"
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={handleCreateObservation}
                    loading={isSubmittingObservation}
                    disabled={newObservations.every(obs => !obs.trim())}
                  >
                    {isSubmittingObservation ? 'Guardando...' : `Guardar ${newObservations.filter(obs => obs.trim()).length} Observación(es)`}
                  </Button>
                </div>

                <Separator />

                {/* Reviews Tabs */}
                {reviews.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No hay revisiones aún. Crea observaciones para comenzar una revisión.</p>
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

                    {reviews.map((review) => {
                      const allCompleted = review.observations.every(o => o.isFinished)
                      const hasObservations = review.observations.length > 0
                      const canFinishReview = allCompleted && hasObservations

                      return (
                        <TabsContent key={review.id} value={review.id} className="space-y-4">
                          {/* Finish Review Button - Only for Directors */}
                          {canFinishReview && (
                            <div className="flex justify-end">
                              <Button
                                onClick={() => handleFinishReview(review.id)}
                                loading={isFinishingReview === review.id}
                                variant="default"
                              >
                                {isFinishingReview === review.id ? 'Finalizando...' : 'Finalizar Revisión'}
                              </Button>
                            </div>
                          )}

                          {review.observations.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No hay observaciones en esta revisión</p>
                          ) : (
                            <ObservationsLog
                              observations={review.observations}
                              projectId={projectId}
                              canComplete={false}
                              onUpdate={async () => {
                                // Reload all reviews when any observation is updated
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
                              }}
                            />
                          )}
                        </TabsContent>
                      )
                    })}
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
