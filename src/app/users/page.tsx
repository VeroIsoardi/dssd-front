'use client'

import { useEffect, useState } from 'react'
// removed useRouter; opening edit/create in a new tab instead
import { toast } from 'sonner'
import RequireAuth from '@/components/auth/RequireAuth'
import { getRoleName, USER_ROLES } from '@/lib/constants/roles'
import { LoadingState } from '@/components/ui/loading-state'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getUsers, changeUserPassword, deleteUser, UsersApiError } from '@/services/users'
import type { User } from '@/types/user'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils/format'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [passwordEditingUser, setPasswordEditingUser] = useState<string | null>(null)
  const [passwordValue, setPasswordValue] = useState('')
  const [repeatPasswordValue, setRepeatPasswordValue] = useState('')

  

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getUsers(0, 20)
        setUsers(data)
      } catch (err) {
        console.error('Failed to load users', err)
        if (err instanceof UsersApiError) {
          toast.error('Error al cargar usuarios', { description: err.message })
        } else {
          toast.error('Error inesperado al cargar usuarios')
        }
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  const handleOpenPassword = (userId: string) => {
    setPasswordEditingUser(userId)
    setPasswordValue('')
    setRepeatPasswordValue('')
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Seguro que desea eliminar este usuario?')) return
    try {
      await deleteUser(userId)
      setUsers(prev => prev.filter(u => u.id !== userId))
      toast.success('Usuario eliminado')
    } catch (err) {
      console.error('Delete user', err)
      if (err instanceof UsersApiError) {
        toast.error('Error al eliminar usuario', { description: err.message })
      } else {
        toast.error('Error inesperado al eliminar usuario')
      }
    }
  }

  const handleChangePassword = async (userId: string) => {
    if (passwordValue !== repeatPasswordValue) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    try {
      await changeUserPassword(userId, { password: passwordValue, repeatPassword: repeatPasswordValue })
      toast.success('Contraseña actualizada')
      setPasswordEditingUser(null)
    } catch (err) {
      console.error('Change password', err)
      toast.error('Error al cambiar la contraseña')
    }
  }

  return (
    <RequireAuth allowedRoles={[USER_ROLES.ADMIN]}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
            <p className="text-gray-600 mt-2">Lista de usuarios registrados</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => window.open('/user-form', '_blank')}>Crear Usuario</Button>
          </div>
        </div>

        {isLoading ? (
          <LoadingState message="Cargando usuarios..." />
        ) : users.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">No hay usuarios aún</p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.firstName} {u.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getRoleName(u.roles)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.createdAt ? formatDate(u.createdAt) : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-2">
                        <Button variant="outline" onClick={() => window.open(`/user-form/${u.id}`, '_blank')}>Editar</Button>
                        <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteUser(u.id)}>Eliminar</Button>
                      </div>

                      {passwordEditingUser === u.id && (
                        <div className="mt-2 space-y-2">
                          <Input type="password" placeholder="Nueva contraseña" value={passwordValue} onChange={(e) => setPasswordValue((e.target as HTMLInputElement).value)} />
                          <Input type="password" placeholder="Repetir contraseña" value={repeatPasswordValue} onChange={(e) => setRepeatPasswordValue((e.target as HTMLInputElement).value)} />
                          <div className="flex justify-end space-x-2 mt-2">
                            <Button onClick={() => handleChangePassword(u.id)}>Guardar</Button>
                            <Button variant="outline" onClick={() => setPasswordEditingUser(null)}>Cancelar</Button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RequireAuth>
  )
}
