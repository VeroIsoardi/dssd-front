'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getProjects, finishProject, ProjectApiError } from '@/services/projects'
import { Project } from '@/types/project'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingState } from '@/components/ui/loading-state'
import RequireAuth from '@/components/auth/RequireAuth'
import { formatDate } from '@/lib/utils/format'
import { USER_ROLES } from '@/lib/constants/roles'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects()
        setProjects(data)
      } catch (error) {
        console.error('Error loading projects:', error)
        if (error instanceof ProjectApiError) {
          toast.error('Error al cargar proyectos', {
            description: error.message
          })
        } else {
          toast.error('Error inesperado al cargar proyectos')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])

  const handleViewTasks = (projectId: string) => {
    router.push(`/projects/${projectId}/tasks`)
  }

  const handleFinishProject = async (projectId: string) => {
    try {
      await finishProject(projectId)
      toast.success('Proyecto finalizado exitosamente')
      
      // Reload projects to reflect the change
      const data = await getProjects()
      setProjects(data)
    } catch (error) {
      console.error('Error finishing project:', error)
      if (error instanceof ProjectApiError) {
        toast.error('Error al finalizar el proyecto', {
          description: error.message
        })
      } else {
        toast.error('Error inesperado al finalizar el proyecto')
      }
    }
  }

  return (
    <RequireAuth allowedRoles={[USER_ROLES.ONG]}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Proyectos</h1>
            <p className="text-gray-600 mt-2">Gestiona todos tus proyectos de ONGs</p>
          </div>
          <Button 
            onClick={() => router.push('/project-form')}
            size="lg"
          >
            Crear Nuevo Proyecto
          </Button>
        </div>

        {isLoading ? (
          <LoadingState message="Cargando proyectos..." />
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">No hay proyectos creados aún</p>
              <Button onClick={() => router.push('/project-form')}>
                Creá tu primer proyecto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl mb-2">{project.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="text-gray-500">País:</span>
                      <span className="ml-2 font-medium">{project.country}</span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-gray-500">Inicio:</span>
                      <span className="ml-2">{formatDate(project.startDate)}</span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-gray-500">Fin:</span>
                      <span className="ml-2">{formatDate(project.endDate)}</span>
                    </div>

                    <div className="pt-4 border-t space-y-2">
                      <Button 
                        onClick={() => router.push(`/projects/${project.id}`)}
                        className="w-full"
                      >
                        Ver proyecto
                      </Button>
                      <Button 
                        onClick={() => handleViewTasks(project.id)}
                        className="w-full"
                        variant="outline"
                      >
                        Ver tareas
                      </Button>
                      <Button 
                        onClick={() => handleFinishProject(project.id)}
                        className="w-full"
                        variant="secondary"
                        disabled={project.canBeFinished === false }
                      >
                        { 'Marcar como finalizado'}
                      </Button>
                    </div>
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