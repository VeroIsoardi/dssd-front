'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import RequireAuth from '@/components/auth/RequireAuth'
import { USER_ROLES } from '@/lib/constants/roles'
import { LoadingState } from '@/components/ui/loading-state'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getProjects, ProjectApiError } from '@/services/projects'
import type { Project } from '@/types/project'
import { formatDate } from '@/lib/utils/format'
import { Calendar, MapPin } from 'lucide-react'

export default function DirectorProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProjects()
        setProjects(data)
      } catch (err) {
        console.error('Failed to load projects', err)
        if (err instanceof ProjectApiError) {
          toast.error('Error al cargar proyectos', { description: err.message })
        } else {
          toast.error('Error inesperado al cargar proyectos')
        }
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  return (
    <RequireAuth allowedRoles={[USER_ROLES.DIRECTOR]}>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Proyectos</h1>
          <p className="text-gray-600 mt-2">Visualiza todos los proyectos activos</p>
        </div>

        {isLoading ? (
          <LoadingState message="Cargando proyectos..." />
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">No hay proyectos disponibles</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/director-projects/${project.id}`)}>
                <CardHeader>
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-600 text-sm line-clamp-3">{project.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{project.country}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                  </div>

                  <div className="pt-3">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/director-projects/${project.id}`)
                      }}
                    >
                      Ver Detalles
                    </Button>
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
