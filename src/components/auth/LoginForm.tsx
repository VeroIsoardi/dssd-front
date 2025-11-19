"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { Form, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { loginSchema, type LoginForm } from '@/lib/validations/auth'
import { useAuth } from '@/hooks/useAuth'

export default function LoginForm() {
  const { login, getDefaultRoute } = useAuth()
  const router = useRouter()

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  })

  const onSubmit = async (values: LoginForm) => {
    try {
      await login(values)
      router.push(getDefaultRoute())
    } catch (err: unknown) {
      console.error('Login error', err)
    }
  }

  return (
    <div className="flex items-center justify-center">
      <Form {...form}>
        <form className="w-full max-w-md p-6" onSubmit={form.handleSubmit(onSubmit)}>
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

          <Button className="w-full mt-4" type="submit">Ingresar</Button>

          <p className="text-center text-sm text-gray-600 mt-4">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </form>
      </Form>
    </div>
  )
}