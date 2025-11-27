import * as z from 'zod'

export const registerSchema = z.object({
  firstName: z.string().min(1, 'El nombre es obligatorio'),
  lastName: z.string().min(1, 'El apellido es obligatorio'),
  email: z.string().min(1, 'El email es obligatorio').email('Debe ser un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  userBonita: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().min(1, 'El email es obligatorio').email('Debe ser un email válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

export type RegisterForm = z.infer<typeof registerSchema>
export type LoginForm = z.infer<typeof loginSchema>
