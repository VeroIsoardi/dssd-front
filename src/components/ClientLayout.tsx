'use client'

import { Toaster } from "sonner"
import { AuthProvider } from '@/context/AuthProvider'
import { Navbar } from '@/components/navbar'
import { useAuth } from "@/hooks/useAuth"
import { usePathname } from 'next/navigation'

function Header() {
  const { user } = useAuth()
  const pathname = usePathname()
  
  if (!user && (pathname === '/' || pathname === '/register')) {
    return null
  }

  return (
    <header className="bg-white border-b">
      {user && <Navbar />}
    </header>
  )
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  )
}
