"use client"

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export function AuthHeader() {
  const { user, logout, loading } = useAuth()

  if (loading) {
    return null; // Show nothing during loading
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">{user.firstName} {user.lastName}</span>
        <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/">Iniciar sesión</Link>
      {/* <Link href="/register">Register</Link> */}
    </div>
  )
}