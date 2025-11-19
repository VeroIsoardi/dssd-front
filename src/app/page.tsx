"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Form, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { loginSchema, type LoginForm as LoginFormType } from '@/lib/validations/auth'
import { useAuth } from "@/hooks/useAuth"

export default function Home() {
  const { user, loading, login, getDefaultRoute } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  })

  useEffect(() => {
    if (!loading && user) {
      router.push(getDefaultRoute())
    }
  }, [loading, user, router, getDefaultRoute])

  const onSubmit = async (values: LoginFormType) => {
    setIsSubmitting(true)
    try {
      await login(values)
    } catch (err: unknown) {
      console.error('Login error', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión'
      toast.error('Error al iniciar sesión', {
        description: errorMessage
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ProjectPlanning
            </h1>
            <p className="text-gray-600">
              Administración de proyectos de ONGs
            </p>
          </div>

          <Form {...form}>
            <form className="w-full bg-white p-6 rounded shadow" onSubmit={form.handleSubmit(onSubmit)}>
              <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>

              <div className="space-y-4">
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...form.register('email')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...form.register('password')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>

              <Button className="w-full mt-4" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
    </div>
  )
}
