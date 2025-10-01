import { Separator } from "@/components/ui/separator"

const STEP_CONFIG = {
  1: { title: "Paso 1", subtitle: "Datos Generales" },
  2: { title: "Paso 2", subtitle: "Plan de Trabajo" },
} as const

interface FormStepsProps {
  currentStep: number
}

export function FormSteps({ currentStep }: FormStepsProps) {
  return (
    <div className="flex items-center justify-between mt-6 px-4">
      <div className={`flex items-center space-x-3 ${currentStep === 1 ? 'text-primary' : 'text-muted-foreground'}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
          currentStep === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        }`}>
          1
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{STEP_CONFIG[1].title}</span>
          <span className="text-xs">{STEP_CONFIG[1].subtitle}</span>
        </div>
      </div>
      
      <div className="flex-1 mx-8">
        <Separator orientation="horizontal" className="w-full" />
      </div>
      
      <div className={`flex items-center space-x-3 ${currentStep === 2 ? 'text-primary' : 'text-muted-foreground'}`}>
        <div className="flex flex-col text-right">
          <span className="font-semibold text-sm">{STEP_CONFIG[2].title}</span>
          <span className="text-xs">{STEP_CONFIG[2].subtitle}</span>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
          currentStep === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        }`}>
          2
        </div>
      </div>
    </div>
  )
}