"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'
import RequireAuth from '@/components/auth/RequireAuth'
import { USER_ROLES } from '@/lib/constants/roles'
import { Form, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { getUser, updateUser, UsersApiError } from '@/services/users'
import { RoleSelect } from '@/components/RoleSelect'

type EditForm = {
  firstName: string
  lastName: string
}

export default function EditUserPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params?.id as string

  const [loading, setLoading] = useState(true)
  const [selectedRoles, setSelectedRoles] = useState<number[]>([])

  const form = useForm<EditForm>({ defaultValues: { firstName: '', lastName: '' } })

  useEffect(() => {
    const load = async () => {
      if (!userId) return
      try {
        const u = await getUser(userId)
        form.reset({ firstName: u.firstName || '', lastName: u.lastName || '' })
        setSelectedRoles(u.roles || [])
      } catch (err) {
        console.error('Load user', err)
        if (err instanceof UsersApiError) {
          toast.error('Error al cargar usuario', { description: err.message })
        } else {
          toast.error('Error al cargar usuario')
        }
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [userId, form])

  const onSubmit = async (values: EditForm) => {
    try {
      await updateUser(userId, { firstName: values.firstName, lastName: values.lastName, roles: selectedRoles })
      toast.success('Usuario actualizado')
      router.push('/users')
    } catch (err) {
      console.error('Update user', err)
      if (err instanceof UsersApiError) toast.error('Error al actualizar usuario', { description: err.message })
      else toast.error('Error inesperado al actualizar usuario')
    }
  }

  return (
    <RequireAuth allowedRoles={[USER_ROLES.ADMIN]}>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Usuario</h1>
            <p className="text-gray-600">Edita los campos del usuario</p>
          </div>

          {loading ? (
            <div className="text-center">Cargando...</div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow">
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...form.register('firstName')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input {...form.register('lastName')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <FormControl>
                    <RoleSelect selectedRoles={selectedRoles} onChange={setSelectedRoles} />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => router.push('/users')}>Cancelar</Button>
                  <Button type="submit">Guardar cambios</Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </RequireAuth>
  )
}
