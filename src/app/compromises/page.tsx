'use client'

import RequireAuth from '@/components/auth/RequireAuth'
import { USER_ROLES } from '@/lib/constants/roles'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function CompromisesPage() {
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

        <Card>
          <CardHeader>
            <CardTitle>Próximamente</CardTitle>
            <CardDescription>
              Esta sección está en desarrollo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Aquí podrás ver y gestionar los compromisos relacionados con las tareas de los proyectos.
              Como organización, podrás crear compromisos para colaborar con las ONGs en la ejecución
              de las tareas de sus proyectos.
            </p>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Funcionalidades planeadas:</h3>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>Ver proyectos disponibles y sus tareas</li>
                <li>Crear compromisos para tareas específicas</li>
                <li>Gestionar el estado de tus compromisos</li>
                <li>Comunicarte con las ONGs</li>
                <li>Ver historial de compromisos completados</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </RequireAuth>
  )
}
