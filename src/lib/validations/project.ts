import * as z from "zod"

export const taskSchema = z.object({
  name: z.string().min(1, "El nombre de la tarea es obligatorio"),
  description: z.string().min(1, "La descripción de la tarea es obligatoria"),
  startDate: z.string().min(1, "La fecha de inicio es obligatoria"),
  endDate: z.string().min(1, "La fecha de fin es obligatoria"),
  isPrivate: z.boolean().optional(),
}).refine((data) => {
  const startDate = new Date(data.startDate)
  const endDate = new Date(data.endDate)
  return endDate >= startDate
}, {
  message: "La fecha de fin no puede ser anterior a la fecha de inicio",
  path: ["endDate"],
})

export const projectFormSchema = z.object({
  ongName: z.string().min(1, "El nombre de la ONG es obligatorio"),
  ongMail: z.string().min(1, "El email de la ONG es obligatorio").email("Debe ser un email válido"),
  name: z.string().min(1, "El nombre del proyecto es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  country: z.string().min(1, "Debe seleccionar un país"),
  startDate: z.string().min(1, "La fecha de inicio es obligatoria"),
  endDate: z.string().min(1, "La fecha de fin es obligatoria"),
  tasks: z.array(taskSchema).min(1, "Debe agregar al menos una tarea al plan de trabajo"),
}).refine((data) => {
  const startDate = new Date(data.startDate)
  const endDate = new Date(data.endDate)
  return endDate >= startDate
}, {
  message: "La fecha de fin no puede ser anterior a la fecha de inicio",
  path: ["endDate"],
})

export type ProjectFormData = z.infer<typeof projectFormSchema>