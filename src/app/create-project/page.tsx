"use client"

import { ProjectForm } from "@/components/project-form"

interface ProjectFormData {
  name: string
  description: string
  country: string
  startDate: string
  endDate: string
  budgetFile: FileList | { name: string; size: number; type: string } | null
}

export default function CreateProjectPage() {
  const handleProjectSubmit = (projectData: ProjectFormData) => {
    console.log("Proyecto recibido en la página:", projectData)
    // Aquí podrías agregar lógica adicional como redirección
    // router.push('/projects') por ejemplo
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión de Proyectos ONG
          </h1>
          <p className="text-gray-600">
            Sistema de administración de proyectos para organizaciones no gubernamentales
          </p>
        </div>
        
        <ProjectForm onSubmit={handleProjectSubmit} />
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            * Campos obligatorios. Los datos se mostrarán en la consola del navegador.
          </p>
        </div>
      </div>
    </div>
  )
}