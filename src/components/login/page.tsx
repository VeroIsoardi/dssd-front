"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { loginSchema, type LoginForm } from '@/lib/validations/auth'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  })

  const onSubmit = async (values: LoginForm) => {
    try {
      await login(values)
      router.push('/')
    } catch (err: unknown) {
      // react-hook-form will show server errors via setError if needed
      console.error('Login error', err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Form {...form}>
        <form className="w-full max-w-md bg-white p-6 rounded shadow" onSubmit={form.handleSubmit(onSubmit)}>
          <h2 className="text-xl font-bold mb-4">Login ONG</h2>

          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" {...form.register('email')} />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" {...form.register('password')} />
            </FormControl>
            <FormMessage />
          </FormItem>

          <Button className="w-full mt-4" type="submit">Entrar</Button>
        </form>
      </Form>
    </div>
  )
}
