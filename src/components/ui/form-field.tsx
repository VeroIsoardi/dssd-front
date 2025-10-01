import * as React from "react"
import { Label } from "@/components/ui/label"
import { ErrorMessage } from "@/components/ui/error-message"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  htmlFor?: string
  required?: boolean
  error?: string
  className?: string
  children: React.ReactNode
}

export function FormField({ 
  label, 
  htmlFor, 
  required = false, 
  error, 
  className, 
  children 
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor}>
        {label} {required && "*"}
      </Label>
      {children}
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  )
}