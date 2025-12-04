import { UseFormReturn, UseFieldArrayReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DatePicker } from "@/components/ui/date-picker"
import { ErrorMessage } from "@/components/ui/error-message"
import { FormField } from "@/components/ui/form-field"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft, Plus, Trash2 } from "lucide-react"
import { ProjectFormData } from "@/lib/validations/project"
import { MESSAGES } from "@/lib/constants"
import { formatDateForInput, parseDateFromInput } from "@/lib/utils/date"

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

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField 
                    label="Nombre de la tarea" 
                    htmlFor={`tasks.${index}.name`} 
                    required 
                    error={errors.tasks?.[index]?.name?.message}
                  >
                    <Input
                      {...register(`tasks.${index}.name`)}
                      placeholder={MESSAGES.PLACEHOLDERS.TASK_NAME}
                      className={errors.tasks?.[index]?.name ? "border-destructive" : ""}
                    />
                  </FormField>

                  <FormField 
                    label="Descripción" 
                    htmlFor={`tasks.${index}.description`} 
                    required 
                    error={errors.tasks?.[index]?.description?.message}
                    className="md:col-span-1"
                  >
                    <Textarea
                      {...register(`tasks.${index}.description`)}
                      placeholder={MESSAGES.PLACEHOLDERS.TASK_DESCRIPTION}
                      rows={2}
                      className={errors.tasks?.[index]?.description ? "border-destructive" : ""}
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField 
                    label="Fecha de inicio" 
                    required 
                    error={errors.tasks?.[index]?.startDate?.message}
                  >
                    <DatePicker
                      value={watch(`tasks.${index}.startDate`) ? parseDateFromInput(watch(`tasks.${index}.startDate`)) : undefined}
                      onChange={(date) => setValue(`tasks.${index}.startDate`, date ? formatDateForInput(date) : "")}
                      placeholder={MESSAGES.PLACEHOLDERS.SELECT_START_DATE}
                      className={errors.tasks?.[index]?.startDate ? "border-destructive" : ""}
                    />
                  </FormField>

                  <FormField 
                    label="Fecha de fin" 
                    required 
                    error={errors.tasks?.[index]?.endDate?.message}
                  >
                    <DatePicker
                      value={watch(`tasks.${index}.endDate`) ? parseDateFromInput(watch(`tasks.${index}.endDate`)) : undefined}
                      onChange={(date) => setValue(`tasks.${index}.endDate`, date ? formatDateForInput(date) : "")}
                      placeholder={MESSAGES.PLACEHOLDERS.SELECT_END_DATE}
                      className={errors.tasks?.[index]?.endDate ? "border-destructive" : ""}
                    />
                  </FormField>
                </div>

                <FormField label="Visibilidad">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={watch(`tasks.${index}.isPrivate`) || false}
                      onCheckedChange={(checked) => setValue(`tasks.${index}.isPrivate`, checked)}
                    />
                    <span className="text-sm">
                      {watch(`tasks.${index}.isPrivate`) ? 'Tarea privada' : 'Tarea pública'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {watch(`tasks.${index}.isPrivate`) 
                      ? 'Solo tú podrás ver y resolver esta tarea' 
                      : 'Cualquier miembro del proyecto puede ver y resolver esta tarea'
                    }
                  </p>
                </FormField>
              </div>
            </Card>
          ))}
        </div>

        <ErrorMessage>
          {typeof errors.tasks?.message === 'string' ? errors.tasks.message : ''}
        </ErrorMessage>
      </div>

      <div className="flex justify-between">
        <Button type="button" onClick={onPrev} variant="outline" disabled={isLoading}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        
        <Button type="submit" loading={isLoading}>
          {isLoading ? 'Creando proyecto...' : 'Guardar Proyecto'}
        </Button>
      </div>
    </div>
  )
}