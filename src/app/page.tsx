"use client"

import { ProjectForm } from "@/components/project-form"
import { ProjectFormData } from "@/types/project"

export default function Home() {
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
        
        <ProjectForm onSubmit={handleProjectSubmit} />
        
      </div>
    </div>
  );
}
