import { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { FormField } from "@/components/ui/form-field"
import { ChevronRight } from "lucide-react"
import { ProjectFormData } from "@/lib/validations/project"
import { useCountries } from "@/hooks/useCountries"
import { MESSAGES, FORM_CONFIG } from "@/lib/constants"

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
      
      <FormField 
        label="Nombre del proyecto" 
        htmlFor="name" 
        required 
        error={errors.name?.message}
      >
        <Input
          id="name"
          placeholder={MESSAGES.PLACEHOLDERS.PROJECT_NAME}
          {...register("name")}
          className={errors.name ? "border-destructive" : ""}
        />
      </FormField>

      <FormField 
        label="Descripción" 
        htmlFor="description" 
        required 
        error={errors.description?.message}
      >
        <Textarea
          id="description"
          placeholder={MESSAGES.PLACEHOLDERS.PROJECT_DESCRIPTION}
          rows={4}
          {...register("description")}
          className={errors.description ? "border-destructive" : ""}
        />
      </FormField>

      <FormField 
        label="País" 
        htmlFor="country" 
        required 
        error={errors.country?.message}
      >
        <Select
          value={selectedCountry}
          onValueChange={(value) => setValue("country", value)}
          disabled={isLoadingCountries}
        >
          <SelectTrigger className={errors.country ? "border-destructive" : ""}>
            <SelectValue placeholder={MESSAGES.PLACEHOLDERS.SELECT_COUNTRY} />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                {country.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField 
          label="Fecha de inicio" 
          required 
          error={errors.startDate?.message}
        >
          <DatePicker
            value={watch("startDate") ? new Date(watch("startDate")) : undefined}
            onChange={(date) => setValue("startDate", date ? date.toISOString().split('T')[0] : "")}
            placeholder={MESSAGES.PLACEHOLDERS.SELECT_START_DATE}
            className={errors.startDate ? "border-destructive" : ""}
          />
        </FormField>

        <FormField 
          label="Fecha de fin" 
          required 
          error={errors.endDate?.message}
        >
          <DatePicker
            value={watch("endDate") ? new Date(watch("endDate")) : undefined}
            onChange={(date) => setValue("endDate", date ? date.toISOString().split('T')[0] : "")}
            placeholder={MESSAGES.PLACEHOLDERS.SELECT_END_DATE}
            className={errors.endDate ? "border-destructive" : ""}
          />
        </FormField>
      </div>

      <FormField 
        label="Plan económico (archivo)" 
        htmlFor="budgetFile" 
        required 
        error={typeof errors.budgetFile?.message === 'string' 
          ? errors.budgetFile.message 
          : errors.budgetFile?.message ? 'Debe seleccionar un archivo' : ''}
      >
        <Input
          id="budgetFile"
          type="file"
          accept={FORM_CONFIG.FILE_UPLOAD.ACCEPTED_TYPES}
          {...register("budgetFile")}
          className={errors.budgetFile ? "border-destructive" : ""}
        />
      </FormField>

      <div className="flex justify-end">
        <Button type="button" onClick={onNext}>
          Siguiente <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}