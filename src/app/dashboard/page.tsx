'use client'

import RequireAuth from '@/components/auth/RequireAuth'
import { USER_ROLES } from '@/lib/constants/roles'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <RequireAuth allowedRoles={[USER_ROLES.DIRECTOR]}>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Vista general de todos los proyectos y su estado</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Próximamente</CardTitle>
            <CardDescription>
              Esta sección está en desarrollo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Aquí podrás ver un resumen completo de todos los proyectos, su estado actual,
              y métricas importantes para la toma de decisiones.
            </p>
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Funcionalidades planeadas:</h3>
              <ul className="list-disc list-inside space-y-1 text-purple-800">
                <li>Vista general de todos los proyectos activos</li>
                <li>Métricas y estadísticas clave</li>
                <li>Estado de compromisos y tareas</li>
                <li>Gráficos de progreso por país y ONG</li>
                <li>Reportes exportables</li>
                <li>Filtros avanzados por fecha, país, ONG, etc.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </RequireAuth>
  )
}
