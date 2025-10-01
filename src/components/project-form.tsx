"use client"

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

// Schema de validación con Zod
const projectFormSchema = z.object({
  name: z.string().min(1, "El nombre del proyecto es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  country: z.string().min(1, "Debe seleccionar un país"),
  startDate: z.string().min(1, "La fecha de inicio es obligatoria"),
  endDate: z.string().min(1, "La fecha de fin es obligatoria"),
  budgetFile: z.any().refine((files) => files?.length > 0, "Debe seleccionar un archivo del plan económico"),
}).refine((data) => {
  const startDate = new Date(data.startDate)
  const endDate = new Date(data.endDate)
  return endDate >= startDate
}, {
  message: "La fecha de fin no puede ser anterior a la fecha de inicio",
  path: ["endDate"],
})

type ProjectFormData = z.infer<typeof projectFormSchema>

// Tipo para países de la API
interface Country {
  cca2: string // código de 2 letras
  name: {
    common: string
    nativeName?: {
      [key: string]: {
        common: string
      }
    }
  }
  translations?: {
    spa?: {
      common: string
    }
  }
}

interface ProjectFormProps {
  onSubmit?: (data: ProjectFormData) => void
}

export function ProjectForm({ onSubmit }: ProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [countries, setCountries] = useState<{ value: string; label: string }[]>([])
  const [isLoadingCountries, setIsLoadingCountries] = useState(true)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
  })

  const selectedCountry = watch("country")

  // Fetch countries from REST Countries API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoadingCountries(true)
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,translations')
        const data: Country[] = await response.json()
        
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
        } : null
      }
      
      console.log("Datos del proyecto:", projectData)
      
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Crear Nuevo Proyecto</CardTitle>
        <CardDescription>
          Complete el formulario para dar de alta un nuevo proyecto de ONG
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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

          {/* Botón de envío */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando proyecto...
              </>
            ) : (
              "Crear Proyecto"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}