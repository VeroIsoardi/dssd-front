import * as z from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().min(1, 'El email es obligatorio').email('Debe ser un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export const loginSchema = z.object({
  email: z.string().min(1, 'El email es obligatorio').email('Debe ser un email válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

export type RegisterForm = z.infer<typeof registerSchema>
export type LoginForm = z.infer<typeof loginSchema>
