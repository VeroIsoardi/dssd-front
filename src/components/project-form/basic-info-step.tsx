import { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { ChevronRight } from "lucide-react"
import { ProjectFormData } from "@/lib/validations/project"
import { useCountries } from "@/hooks/useCountries"

interface BasicInfoStepProps {
  form: UseFormReturn<ProjectFormData>
  onNext: () => void
}

export function BasicInfoStep({ form, onNext }: BasicInfoStepProps) {
  const { countries, isLoading: isLoadingCountries } = useCountries()
  const { register, setValue, watch, formState: { errors } } = form
  
  const selectedCountry = watch("country")

  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold mb-4">Paso 1: Datos Generales del Proyecto</div>
      
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

      <div className="space-y-2">
        <Label htmlFor="country">País *</Label>
        <Select
          value={selectedCountry}
          onValueChange={(value) => setValue("country", value)}
          disabled={isLoadingCountries}
        >
          <SelectTrigger className={errors.country ? "border-destructive" : ""}>
            <SelectValue placeholder="Seleccione un país" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                {country.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.country && (
          <p className="text-sm text-destructive">{errors.country.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Fecha de inicio *</Label>
          <DatePicker
            value={watch("startDate") ? new Date(watch("startDate")) : undefined}
            onChange={(date) => setValue("startDate", date ? date.toISOString().split('T')[0] : "")}
            placeholder="Seleccionar fecha de inicio"
            className={errors.startDate ? "border-destructive" : ""}
          />
          {errors.startDate && (
            <p className="text-sm text-destructive">{errors.startDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Fecha de fin *</Label>
          <DatePicker
            value={watch("endDate") ? new Date(watch("endDate")) : undefined}
            onChange={(date) => setValue("endDate", date ? date.toISOString().split('T')[0] : "")}
            placeholder="Seleccionar fecha de fin"
            className={errors.endDate ? "border-destructive" : ""}
          />
          {errors.endDate && (
            <p className="text-sm text-destructive">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="budgetFile">Plan económico (archivo) *</Label>
        <Input
          id="budgetFile"
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
          {...register("budgetFile")}
          className={errors.budgetFile ? "border-destructive" : ""}
        />
        {errors.budgetFile && (
          <p className="text-sm text-destructive">
            {typeof errors.budgetFile.message === 'string' 
              ? errors.budgetFile.message 
              : 'Debe seleccionar un archivo'}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="button" onClick={onNext}>
          Siguiente <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}