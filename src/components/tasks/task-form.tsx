'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { FormField } from '@/components/ui/form-field'
import { Switch } from '@/components/ui/switch'
import { type CreateTaskPayload } from '@/services/tasks'

interface FormProps {
  initialData?: Partial<CreateTaskPayload>
  onSubmit: (data: CreateTaskPayload) => void
  isLoading?: boolean
}

export function TaskForm(props: FormProps) {
  const { initialData = {}, onSubmit, isLoading = false } = props

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch
  } = useForm<CreateTaskPayload>({
    defaultValues: {
      name: initialData.name ?? '',
      description: initialData.description ?? '',
      startDate: initialData.startDate ?? '',
      endDate: initialData.endDate ?? '',
      isPrivate: initialData.isPrivate ?? false
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField label="Nombre" error={errors.name?.message}>
        <Input
          {...register('name', { required: 'El nombre es requerido' })}
          placeholder="Nombre de la tarea"
        />
      </FormField>

      <FormField label="Descripción" error={errors.description?.message}>
        <Textarea
          {...register('description', { required: 'La descripción es requerida' })}
          placeholder="Descripción de la tarea"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Fecha de inicio" error={errors.startDate?.message}>
          <DatePicker
            value={watch('startDate') ? new Date(watch('startDate')) : undefined}
            onChange={(date) => {
              if (date) {
                setValue('startDate', date.toISOString().split('T')[0])
              }
            }}
          />
        </FormField>

        <FormField label="Fecha de fin" error={errors.endDate?.message}>
          <DatePicker
            value={watch('endDate') ? new Date(watch('endDate')) : undefined}
            onChange={(date) => {
              if (date) {
                setValue('endDate', date.toISOString().split('T')[0])
              }
            }}
          />
        </FormField>
      </div>

      <FormField label="Visibilidad">
        <div className="flex items-center space-x-3">
          <Switch
            checked={watch('isPrivate')}
            onCheckedChange={(checked) => setValue('isPrivate', checked)}
          />
          <span className="text-sm">
            {watch('isPrivate') ? 'Tarea privada' : 'Tarea pública'}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {watch('isPrivate') 
            ? 'Solo tú podrás ver y resolver esta tarea' 
            : 'Cualquier miembro del proyecto puede ver y resolver esta tarea'
          }
        </p>
      </FormField>

      <div className="flex justify-end">
        <Button type="submit" loading={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar Tarea'}
        </Button>
      </div>
    </form>
  )
}

export type TaskFormData = CreateTaskPayload
export default TaskForm
