"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { registerSchema, type RegisterForm } from '@/lib/validations/auth'
import { useAuth } from '@/hooks/useAuth'

export default function RegisterForm() {
  const { register: registerUser } = useAuth()
  const router = useRouter()

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '' }
  })

  const onSubmit = async (values: RegisterForm) => {
    try {
      await registerUser(values)
      router.push('/')
    } catch (err: unknown) {
      console.error('Register error', err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Form {...form}>
        <form className="w-full max-w-md bg-white p-6 rounded shadow" onSubmit={form.handleSubmit(onSubmit)}>
          <h2 className="text-xl font-bold mb-4">Registro ONG</h2>

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

          <Button className="w-full mt-4" type="submit">Registrar</Button>
        </form>
      </Form>
    </div>
  )
}