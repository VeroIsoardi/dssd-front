import * as z from "zod"

export const taskSchema = z.object({
  name: z.string().min(1, "El nombre de la tarea es obligatorio"),
  description: z.string().min(1, "La descripción de la tarea es obligatoria"),
  startDate: z.string().min(1, "La fecha de inicio es obligatoria"),
  endDate: z.string().min(1, "La fecha de fin es obligatoria"),
}).refine((data) => {
  const startDate = new Date(data.startDate)
  const endDate = new Date(data.endDate)
  return endDate >= startDate
}, {
  message: "La fecha de fin no puede ser anterior a la fecha de inicio",
  path: ["endDate"],
})

export const projectFormSchema = z.object({
  name: z.string().min(1, "El nombre del proyecto es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  country: z.string().min(1, "Debe seleccionar un país"),
  startDate: z.string().min(1, "La fecha de inicio es obligatoria"),
  endDate: z.string().min(1, "La fecha de fin es obligatoria"),
  budgetFile: z.any().refine((files) => files?.length > 0, "Debe seleccionar un archivo del plan económico"),
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