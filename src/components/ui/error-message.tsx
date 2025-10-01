import * as React from "react"
import { cn } from "@/lib/utils"

interface ErrorMessageProps extends React.ComponentProps<"p"> {
  children: React.ReactNode
}

export function ErrorMessage({ className, children, ...props }: ErrorMessageProps) {
  if (!children) return null
  
  return (
    <p 
      className={cn("text-sm text-destructive", className)} 
      {...props}
    >
      {children}
    </p>
  )
}