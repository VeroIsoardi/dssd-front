"use client"

import { ProjectForm } from "@/components/project-form"
import { ProjectFormData } from "@/types/project"
import RequireAuth from "@/components/auth/RequireAuth"
import { useAuth } from "@/hooks/useAuth"

export default function Home() {
  const { user, loading } = useAuth()
  
  const handleProjectSubmit = (projectData: ProjectFormData) => {
    console.log("Proyecto recibido en la página principal:", projectData)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ProjectPlanning
          </h1>
          <p className="text-gray-600">
            Administración de proyectos de ONGs
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          </div>
        ) : user ? (
          <RequireAuth>
            <ProjectForm onSubmit={handleProjectSubmit} />
          </RequireAuth>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Para crear un nuevo proyecto, por favor inicia sesión
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
