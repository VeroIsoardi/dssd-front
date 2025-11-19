"use client"

import { useEffect } from "react"
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/auth/LoginForm'
import { useAuth } from "@/hooks/useAuth"

export default function Home() {
  const { user, loading, getDefaultRoute } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push(getDefaultRoute())
    }
  }, [loading, user, router, getDefaultRoute])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="mx-auto w-3xl max-w-md bg-white p-6 rounded shadow">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            ProjectPlanning
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Administración de proyectos de ONGs
          </p>
          <LoginForm />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
    </div>
  )
}
