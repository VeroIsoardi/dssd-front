'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import RequireAuth from '@/components/auth/RequireAuth'
import { USER_ROLES } from '@/lib/constants/roles'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingState } from '@/components/ui/loading-state'
import { formatDate } from '@/lib/utils/format'
import { compromiseService, CompromiseApiError } from '@/services/compromises'
import { Compromise, compromiseStatusLabels, compromiseStatusColors } from '@/types/compromise'

export default function CompromisesPage() {
  const [compromises, setCompromises] = useState<Compromise[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCompromises = async () => {
      try {
        const data = await compromiseService.getAll()
        setCompromises(data)
      } catch (error) {
        console.error('Error loading compromises:', error)
        if (error instanceof CompromiseApiError) {
          toast.error('Error al cargar compromisos', {
            description: error.message
          })
        } else {
          toast.error('Error inesperado al cargar compromisos')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadCompromises()
  }, [])

  const renderStatusBadge = (status: Compromise['status']) => {
    const label = compromiseStatusLabels[status]
    const colorClass = compromiseStatusColors[status]
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {label}
      </span>
    )
  }

  return (
    <RequireAuth allowedRoles={[USER_ROLES.ORGANIZATION]}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Compromisos</h1>
            <p className="text-gray-600 mt-2">Gestiona los compromisos con tareas de proyectos</p>
          </div>
          <Button size="lg">
            Crear Nuevo Compromiso
          </Button>
        </div>

        {isLoading ? (
          <LoadingState message="Cargando compromisos..." />
        ) : compromises.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Sin compromisos</CardTitle>
              <CardDescription>
                No hay compromisos registrados aún
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Como organización, puedes crear compromisos para colaborar con las ONGs
                en la ejecución de las tareas de sus proyectos.
              </p>
              <Button>
                Explorar Proyectos Disponibles
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {compromises.map((compromise) => (
              <Card key={compromise.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{compromise.taskName}</CardTitle>
                    {renderStatusBadge(compromise.status)}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {compromise.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="text-gray-500">Proyecto:</span>
                      <span className="ml-2 font-medium">{compromise.projectName}</span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-gray-500">ONG:</span>
                      <span className="ml-2">{compromise.ongName}</span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-gray-500">Organización:</span>
                      <span className="ml-2 font-medium">{compromise.organizationName}</span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-gray-500">Inicio:</span>
                      <span className="ml-2">{formatDate(compromise.startDate)}</span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-gray-500">Fin:</span>
                      <span className="ml-2">{formatDate(compromise.endDate)}</span>
                    </div>

                    {compromise.completedAt && (
                      <div className="text-sm">
                        <span className="text-gray-500">Completado:</span>
                        <span className="ml-2 text-green-600">{formatDate(compromise.completedAt)}</span>
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <Button 
                        className="w-full"
                        variant="outline"
                      >
                        Ver Detalles
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
