'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { FormField } from '@/components/ui/form-field'
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
      endDate: initialData.endDate ?? ''
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField label="Name" error={errors.name?.message}>
        <Input
          {...register('name', { required: 'Name is required' })}
          placeholder="Task name"
        />
      </FormField>

      <FormField label="Description" error={errors.description?.message}>
        <Textarea
          {...register('description', { required: 'Description is required' })}
          placeholder="Task description"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Start Date" error={errors.startDate?.message}>
          <DatePicker
            value={watch('startDate') ? new Date(watch('startDate')) : undefined}
            onChange={(date) => {
              if (date) {
                setValue('startDate', date.toISOString().split('T')[0])
              }
            }}
          />
        </FormField>

        <FormField label="End Date" error={errors.endDate?.message}>
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

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Task'}
        </Button>
      </div>
    </form>
  )
}

export type TaskFormData = CreateTaskPayload
export default TaskForm
