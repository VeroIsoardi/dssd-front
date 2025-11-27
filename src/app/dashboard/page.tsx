'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import RequireAuth from '@/components/auth/RequireAuth'
import { USER_ROLES } from '@/lib/constants/roles'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingState } from '@/components/ui/loading-state'
import { getKPIs, KPIApiError } from '@/services/kpis'
import { KPIData } from '@/types/kpi'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Colors for charts
const CASE_COLORS = ['#10b981', '#f59e0b'] // green for finished, amber for ongoing
const TASK_COLORS = ['#ef4444', '#f59e0b', '#10b981'] // red for untaken, amber for pending, green for finished
const COUNTRY_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f97316']

export default function DashboardPage() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await getKPIs()
        setKpiData(data)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        if (error instanceof KPIApiError) {
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
          <p className="text-gray-600 mt-2">Indicadores clave de rendimiento (KPIs)</p>
        </div>

        {kpiData && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total de Casos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{kpiData.totalCases}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Casos Finalizados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{kpiData.finishedCases}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Casos en Progreso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600">{kpiData.ongoingCases}</div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart - Cases */}
              <Card>
                <CardHeader>
                  <CardTitle>Estado de Casos</CardTitle>
                  <CardDescription>Distribución de casos finalizados vs en progreso</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Finalizados', value: kpiData.finishedCases },
                          { name: 'En Progreso', value: kpiData.ongoingCases }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[0, 1].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CASE_COLORS[index % CASE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Total de Casos: <span className="font-bold">{kpiData.totalCases}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Bar Chart - Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle>Estado de Tareas</CardTitle>
                  <CardDescription>Tareas no tomadas, pendientes y finalizadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        {
                          name: 'No Tomadas',
                          cantidad: kpiData.unTakenTasks,
                          fill: TASK_COLORS[0]
                        },
                        {
                          name: 'Pendientes',
                          cantidad: kpiData.pendingTasks,
                          fill: TASK_COLORS[1]
                        },
                        {
                          name: 'Finalizadas',
                          cantidad: kpiData.finishedTasks,
                          fill: TASK_COLORS[2]
                        }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="cantidad" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Total de Tareas: <span className="font-bold">
                        {kpiData.unTakenTasks + kpiData.pendingTasks + kpiData.finishedTasks}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Stats */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Detalle de Tareas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Tareas No Tomadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600">{kpiData.unTakenTasks}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Tareas Pendientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-amber-600">{kpiData.pendingTasks}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Tareas Finalizadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{kpiData.finishedTasks}</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Projects per Country Chart */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Proyectos por País</CardTitle>
                  <CardDescription>Distribución de proyectos por país</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={kpiData.topCountries}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="country" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#3b82f6" name="Proyectos">
                        {kpiData.topCountries.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COUNTRY_COLORS[index % COUNTRY_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Total de Proyectos: <span className="font-bold">
                        {kpiData.topCountries.reduce((acc, item) => acc + (typeof item.count === 'string' ? parseInt(item.count) : item.count), 0)}
                      </span>
                    </p>
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
