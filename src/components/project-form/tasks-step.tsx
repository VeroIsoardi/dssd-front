import { UseFormReturn, UseFieldArrayReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DatePicker } from "@/components/ui/date-picker"
import { ChevronLeft, Loader2, Plus, Trash2 } from "lucide-react"
import { ProjectFormData } from "@/lib/validations/project"

interface TasksStepProps {
  form: UseFormReturn<ProjectFormData>
  fields: UseFieldArrayReturn<ProjectFormData, "tasks", "id">["fields"]
  isLoading: boolean
  onPrev: () => void
  onAddTask: () => void
  onRemoveTask: (index: number) => void
}

export function TasksStep({ 
  form, 
  fields, 
  isLoading, 
  onPrev, 
  onAddTask, 
  onRemoveTask 
}: TasksStepProps) {
  const { register, watch, setValue, formState: { errors } } = form

  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold mb-4">Paso 2: Plan de Trabajo</div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base">Tareas del proyecto *</Label>
          <Button type="button" onClick={onAddTask} variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Tarea
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary">Tarea {index + 1}</Badge>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => onRemoveTask(index)}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`tasks.${index}.name`}>Nombre de la tarea *</Label>
                  <Input
                    {...register(`tasks.${index}.name`)}
                    placeholder="Nombre de la tarea"
                    className={errors.tasks?.[index]?.name ? "border-destructive" : ""}
                  />
                  {errors.tasks?.[index]?.name && (
                    <p className="text-sm text-destructive">
                      {errors.tasks[index]?.name?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor={`tasks.${index}.description`}>Descripción *</Label>
                  <Textarea
                    {...register(`tasks.${index}.description`)}
                    placeholder="Descripción de la tarea"
                    rows={2}
                    className={errors.tasks?.[index]?.description ? "border-destructive" : ""}
                  />
                  {errors.tasks?.[index]?.description && (
                    <p className="text-sm text-destructive">
                      {errors.tasks[index]?.description?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Fecha de inicio *</Label>
                  <DatePicker
                    value={watch(`tasks.${index}.startDate`) ? new Date(watch(`tasks.${index}.startDate`)) : undefined}
                    onChange={(date) => setValue(`tasks.${index}.startDate`, date ? date.toISOString().split('T')[0] : "")}
                    placeholder="Seleccionar fecha de inicio"
                    className={errors.tasks?.[index]?.startDate ? "border-destructive" : ""}
                  />
                  {errors.tasks?.[index]?.startDate && (
                    <p className="text-sm text-destructive">
                      {errors.tasks[index]?.startDate?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Fecha de fin *</Label>
                  <DatePicker
                    value={watch(`tasks.${index}.endDate`) ? new Date(watch(`tasks.${index}.endDate`)) : undefined}
                    onChange={(date) => setValue(`tasks.${index}.endDate`, date ? date.toISOString().split('T')[0] : "")}
                    placeholder="Seleccionar fecha de fin"
                    className={errors.tasks?.[index]?.endDate ? "border-destructive" : ""}
                  />
                  {errors.tasks?.[index]?.endDate && (
                    <p className="text-sm text-destructive">
                      {errors.tasks[index]?.endDate?.message}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {errors.tasks && typeof errors.tasks.message === 'string' && (
          <p className="text-sm text-destructive">{errors.tasks.message}</p>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" onClick={onPrev} variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando proyecto...
            </>
          ) : (
            "Guardar Proyecto"
          )}
        </Button>
      </div>
    </div>
  )
}