'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getProjects, ProjectApiError } from '@/services/projects'
import { Project } from '@/types/project'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingState } from '@/components/ui/loading-state'
import RequireAuth from '@/components/auth/RequireAuth'
import { formatDate } from '@/lib/utils/format'
import { USER_ROLES } from '@/lib/constants/roles'
import { Badge } from '@/components/ui/badge'

export default function OrganizationProjectsPage() {
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

  const handleViewProject = (projectId: string) => {
    router.push(`/organization-projects/${projectId}`)
  }

  return (
    <RequireAuth allowedRoles={[USER_ROLES.ORGANIZATION]}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Proyectos Disponibles</h1>
            <p className="text-gray-600 mt-2">Explora proyectos y crea compromisos para colaborar</p>
          </div>
        </div>

        {isLoading ? (
          <LoadingState message="Cargando proyectos..." />
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">No hay proyectos disponibles en este momento</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      {project.tasks.length} {project.tasks.length === 1 ? 'tarea' : 'tareas'}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="text-gray-500">ONG:</span>
                      <span className="ml-2 font-medium">{project.ongName}</span>
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

                    <div className="pt-4 border-t">
                      <Button 
                        onClick={() => handleViewProject(project.id)}
                        className="w-full"
                      >
                        Ver Detalles y Tareas
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
