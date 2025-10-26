"use client"

import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from '@/context/AuthProvider'
import Link from 'next/link'
import { AuthHeader } from '@/components/auth/AuthHeader'
import { Navbar } from '@/components/navbar'
import { useAuth } from "@/hooks/useAuth"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="font-bold">ProjectPlanning</Link>
        <AuthHeader />
      </div>
      {user && <Navbar />}
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Header />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </AuthProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
