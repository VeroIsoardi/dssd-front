"use client"

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export function AuthHeader() {
  const { user, logout } = useAuth()

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">{user.name ?? user.email}</span>
        <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
    </div>
  )
}
