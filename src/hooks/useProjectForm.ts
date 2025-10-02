import { useCallback, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { projectFormSchema, ProjectFormData } from "@/lib/validations/project"
import { createProject, ProjectApiError } from "@/services/projects"

const DEFAULT_TASK = { name: "", description: "", startDate: "", endDate: "" }

export function useProjectForm(onSuccess?: (data: ProjectFormData) => void) {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      tasks: [DEFAULT_TASK]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tasks"
  })

  const handleSubmit = useCallback(async (data: ProjectFormData) => {
    setIsLoading(true)
    
    try {
      const project = await createProject(data)
      
      console.log("Proyecto creado:", project)
      
      toast.success("¡Proyecto creado exitosamente!", { description: '' })
      
      form.reset({
        ongName: "",
        ongMail: "",
        name: "",
        description: "",
        country: "",
        startDate: "",
        endDate: "",
        tasks: [DEFAULT_TASK]
      })
      setCurrentStep(1)
      
      onSuccess?.(data)
      
    } catch (error) {
      console.error("Error al crear el proyecto:", error)
      
      if (error instanceof ProjectApiError) {
        toast.error("Error al crear el proyecto", {
          description: error.message
        })
      } else {
        toast.error("Error inesperado", {
          description: "Ocurrió un error inesperado. Inténtelo nuevamente."
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [onSuccess, form])

  const nextStep = useCallback(async () => {
    if (currentStep === 1) {
      const isValid = await form.trigger(['ongName', 'ongMail', 'name', 'description', 'country', 'startDate', 'endDate'])
      if (isValid) {
        setCurrentStep(2)
      }
    }
  }, [currentStep, form])

  const prevStep = useCallback(() => {
    if (currentStep === 2) {
      setCurrentStep(1)
    }
  }, [currentStep])

  const addTask = useCallback(() => {
    append(DEFAULT_TASK)
  }, [append])

  const removeTask = useCallback((index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }, [fields.length, remove])

  return {
    form,
    fields,
    isLoading,
    currentStep,
    handleSubmit,
    nextStep,
    prevStep,
    addTask,
    removeTask,
  }
}