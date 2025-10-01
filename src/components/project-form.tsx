"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectFormProps } from "@/types/project"
import { useProjectForm } from "@/hooks/useProjectForm"
import { FormSteps } from "./project-form/form-steps"
import { BasicInfoStep } from "./project-form/basic-info-step"
import { TasksStep } from "./project-form/tasks-step"

export function ProjectForm({ onSubmit }: ProjectFormProps) {
  const {
    form,
    fields,
    isLoading,
    currentStep,
    handleSubmit,
    nextStep,
    prevStep,
    addTask,
    removeTask,
  } = useProjectForm(onSubmit)

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Crear Nuevo Proyecto</CardTitle>
        <CardDescription>
          Complete el formulario para dar de alta un nuevo proyecto de ONG
        </CardDescription>
        
        <FormSteps currentStep={currentStep} />
      </CardHeader>
      
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {currentStep === 1 && (
            <BasicInfoStep form={form} onNext={nextStep} />
          )}

          {currentStep === 2 && (
            <TasksStep 
              form={form}
              fields={fields}
              isLoading={isLoading}
              onPrev={prevStep}
              onAddTask={addTask}
              onRemoveTask={removeTask}
            />
          )}
        </form>
      </CardContent>
    </Card>
  )
}