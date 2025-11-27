'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import RequireAuth from '@/components/auth/RequireAuth'
import { USER_ROLES } from '@/lib/constants/roles'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingState } from '@/components/ui/loading-state'
import { getProjects, ProjectApiError } from '@/services/projects'
import { compromiseService, CompromiseApiError } from '@/services/compromises'
import { Project } from '@/types/project'
import { Compromise } from '@/types/compromise'
import { PROJECT_STATUS } from '@/lib/constants'

interface DashboardStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalTasks: number
  completedTasks: number
  totalCompromises: number
  activeCompromises: number
  completedCompromises: number
  topCountries: Array<{ country: string; count: number }>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load projects and compromises in parallel
        const [projects, compromises] = await Promise.all([
          getProjects(),
          compromiseService.getAll()
        ])

        // Calculate statistics
        const totalProjects = projects.length
        const activeProjects = projects.filter(p => p.status === PROJECT_STATUS.ACTIVE).length
        const completedProjects = projects.filter(p => p.status === PROJECT_STATUS.COMPLETED).length
        
        const totalTasks = projects.reduce((acc, project) => acc + project.tasks.length, 0)
        const completedTasks = projects.reduce((acc, project) => 
          acc + project.tasks.filter(task => task.status === 'completed').length, 0
        )

        const totalCompromises = compromises.length
        const activeCompromises = compromises.filter(c => 
          c.status === 'in_progress' || c.status === 'approved'
        ).length
        const completedCompromises = compromises.filter(c => c.status === 'completed').length

        // Calculate top countries by project count
        const countryCount = projects.reduce((acc, project) => {
          acc[project.country] = (acc[project.country] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        const topCountries = Object.entries(countryCount)
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)

        setStats({
          totalProjects,
          activeProjects,
          completedProjects,
          totalTasks,
          completedTasks,
          totalCompromises,
          activeCompromises,
          completedCompromises,
          topCountries
        })
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        if (error instanceof ProjectApiError || error instanceof CompromiseApiError) {
          toast.error('Error al cargar datos del dashboard', {
            description: error.message
          })
        } else {
          toast.error('Error inesperado al cargar el dashboard')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (isLoading) {
    return (
      <RequireAuth allowedRoles={[USER_ROLES.DIRECTOR]}>
        <div className="container mx-auto py-8 px-4">
          <LoadingState message="Cargando datos del dashboard..." />
        </div>
      </RequireAuth>
    )
  }

  return (
    <RequireAuth allowedRoles={[USER_ROLES.DIRECTOR]}>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Vista general de todos los proyectos y su estado</p>
        </div>

        {stats && (
          <div className="space-y-8">
            {/* Projects Overview */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Resumen de Proyectos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Proyectos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{stats.totalProjects}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Proyectos Activos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{stats.activeProjects}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Proyectos Completados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">{stats.completedProjects}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Tasa de Finalización</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">
                      {stats.totalProjects > 0 
                        ? Math.round((stats.completedProjects / stats.totalProjects) * 100)
                        : 0}%
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Tasks Overview */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Resumen de Tareas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Tareas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{stats.totalTasks}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Tareas Completadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{stats.completedTasks}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Progreso de Tareas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">
                      {stats.totalTasks > 0 
                        ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
                        : 0}%
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Compromises Overview */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Resumen de Compromisos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Compromisos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{stats.totalCompromises}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Compromisos Activos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">{stats.activeCompromises}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Compromisos Completados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{stats.completedCompromises}</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Top Countries */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Países con Más Proyectos</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Top 5 Países</CardTitle>
                  <CardDescription>Países con mayor número de proyectos activos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.topCountries.map((country, index) => (
                      <div key={country.country} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                            index === 0 ? 'bg-yellow-500' :
                            index === 1 ? 'bg-gray-400' :
                            index === 2 ? 'bg-amber-600' :
                            'bg-blue-500'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="font-medium">{country.country}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="bg-gray-200 rounded-full h-2 w-24">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(country.count / stats.topCountries[0].count) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8 text-right">{country.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </RequireAuth>
  )
}
