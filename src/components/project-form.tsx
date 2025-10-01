"use client"

import React, { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

const taskSchema = z.object({
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

const projectFormSchema = z.object({
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

type ProjectFormData = z.infer<typeof projectFormSchema>

interface Country {
  cca2: string
  name: { common: string }
  translations?: { spa?: { common: string } }
}

interface ProjectFormProps {
  onSubmit?: (data: ProjectFormData) => void
}

export function ProjectForm({ onSubmit }: ProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [countries, setCountries] = useState<{ value: string; label: string }[]>([])
  const [isLoadingCountries, setIsLoadingCountries] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    trigger,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      tasks: [{ name: "", description: "", startDate: "", endDate: "" }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks"
  })

  const selectedCountry = watch("country")

  // Fetch countries from REST Countries API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoadingCountries(true)
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,translations')
        const data: Array<{
          cca2: string
          name: { common: string }
          translations?: { spa?: { common: string } }
        }> = await response.json()
        
        // Sort countries alphabetically and format for select with Spanish names
        const formattedCountries = data
          .map(country => ({
            value: country.cca2.toLowerCase(),
            // Use Spanish translation if available, otherwise fallback to common name
            label: country.translations?.spa?.common || country.name.common
          }))
          .sort((a, b) => a.label.localeCompare(b.label, 'es'))
        
        setCountries(formattedCountries)
      } catch (error) {
        console.error('Error fetching countries:', error)
        // Fallback to some countries if API fails (in Spanish)
        setCountries([
          { value: "ar", label: "Argentina" },
          { value: "br", label: "Brasil" },
          { value: "cl", label: "Chile" },
          { value: "uy", label: "Uruguay" },
          { value: "es", label: "España" },
          { value: "mx", label: "México" },
          { value: "co", label: "Colombia" },
          { value: "pe", label: "Perú" },
        ])
      } finally {
        setIsLoadingCountries(false)
      }
    }

    fetchCountries()
  }, [])

  const handleFormSubmit = async (data: ProjectFormData) => {
    setIsLoading(true)
    
    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      // Obtener información del archivo
      const file = data.budgetFile[0]
      const projectData = {
        ...data,
        budgetFile: file ? {
          name: file.name,
          size: file.size,
          type: file.type
        } : null,
        tasks: data.tasks
      }
      
      console.log("Datos del proyecto completo:", projectData)
      console.log("Plan de trabajo:", data.tasks)
      
      if (onSubmit) {
        onSubmit(data)
      }
      
      alert("Proyecto creado exitosamente!")
    } catch (error) {
      console.error("Error al crear el proyecto:", error)
      alert("Error al crear el proyecto")
    } finally {
      setIsLoading(false)
    }
  }

  // Funciones de navegación del wizard
  const goToNextStep = async () => {
    if (currentStep === 1) {
      // Validar solo los campos del paso 1
      const isStep1Valid = await trigger(['name', 'description', 'country', 'startDate', 'endDate', 'budgetFile'])
      if (isStep1Valid) {
        setCurrentStep(2)
      }
    }
  }

  const goToPreviousStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1)
    }
  }

  // Funciones para manejar tareas
  const addTask = () => {
    append({ name: "", description: "", startDate: "", endDate: "" })
  }

  const removeTask = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Crear Nuevo Proyecto</CardTitle>
        <CardDescription>
          Complete el formulario para dar de alta un nuevo proyecto de ONG
        </CardDescription>
        
        {/* Indicador de pasos */}
        <div className="flex items-center justify-between mt-6 px-4">
          <div className={`flex items-center space-x-3 ${currentStep === 1 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              1
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Paso 1</span>
              <span className="text-xs">Datos Generales</span>
            </div>
          </div>
          
          <div className="flex-1 mx-8">
            <Separator orientation="horizontal" className="w-full" />
          </div>
          
          <div className={`flex items-center space-x-3 ${currentStep === 2 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className="flex flex-col text-right">
              <span className="font-semibold text-sm">Paso 2</span>
              <span className="text-xs">Plan de Trabajo</span>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              2
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Paso 1: Datos Generales */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-lg font-semibold mb-4">Paso 1: Datos Generales del Proyecto</div>
              
              {/* Nombre del proyecto */}
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del proyecto *</Label>
                <Input
                  id="name"
                  placeholder="Ingrese el nombre del proyecto"
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe los objetivos y alcance del proyecto"
                  rows={4}
                  {...register("description")}
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              {/* País */}
              <div className="space-y-2">
                <Label htmlFor="country">País *</Label>
                <Select
                  value={selectedCountry}
                  onValueChange={(value) => setValue("country", value)}
                  disabled={isLoadingCountries}
                >
                  <SelectTrigger className={errors.country ? "border-destructive" : ""}>
                    <SelectValue 
                      placeholder={isLoadingCountries ? "Cargando países..." : "Seleccione un país"} 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingCountries ? (
                      <SelectItem value="loading" disabled>
                        <div className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Cargando países...
                        </div>
                      </SelectItem>
                    ) : (
                      countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-sm text-destructive">{errors.country.message}</p>
                )}
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de inicio *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register("startDate")}
                    className={errors.startDate ? "border-destructive" : ""}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-destructive">{errors.startDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Fecha de fin *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    {...register("endDate")}
                    className={errors.endDate ? "border-destructive" : ""}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-destructive">{errors.endDate.message}</p>
                  )}
                </div>
              </div>

              {/* Plan económico */}
              <div className="space-y-2">
                <Label htmlFor="budgetFile">Plan económico (archivo) *</Label>
                <Input
                  id="budgetFile"
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                  {...register("budgetFile")}
                  className={errors.budgetFile ? "border-destructive" : ""}
                />
                <p className="text-sm text-muted-foreground">
                  Suba un archivo con el plan económico del proyecto (PDF, Word, Excel, etc.)
                </p>
                {errors.budgetFile && (
                  <p className="text-sm text-destructive">
                    {typeof errors.budgetFile.message === 'string' 
                      ? errors.budgetFile.message 
                      : 'Debe seleccionar un archivo del plan económico'}
                  </p>
                )}
              </div>

              {/* Botón siguiente */}
              <div className="flex justify-end">
                <Button type="button" onClick={goToNextStep}>
                  Siguiente <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Paso 2: Plan de Trabajo */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-lg font-semibold mb-4">Paso 2: Plan de Trabajo</div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Tareas del proyecto *</Label>
                  <Button type="button" onClick={addTask} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Tarea
                  </Button>
                </div>

                {/* Lista de tareas */}
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary">Tarea {index + 1}</Badge>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeTask(index)}
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
                          <Label htmlFor={`tasks.${index}.startDate`}>Fecha de inicio *</Label>
                          <Input
                            type="date"
                            {...register(`tasks.${index}.startDate`)}
                            className={errors.tasks?.[index]?.startDate ? "border-destructive" : ""}
                          />
                          {errors.tasks?.[index]?.startDate && (
                            <p className="text-sm text-destructive">
                              {errors.tasks[index]?.startDate?.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`tasks.${index}.endDate`}>Fecha de fin *</Label>
                          <Input
                            type="date"
                            {...register(`tasks.${index}.endDate`)}
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

                {/* Error de tareas mínimas */}
                {errors.tasks && typeof errors.tasks.message === 'string' && (
                  <p className="text-sm text-destructive">{errors.tasks.message}</p>
                )}
              </div>

              {/* Botones de navegación */}
              <div className="flex justify-between">
                <Button type="button" onClick={goToPreviousStep} variant="outline">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                >
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
          )}
        </form>
      </CardContent>
    </Card>
  )
}