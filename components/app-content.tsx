"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Sidebar } from "@/components/sidebar"
import { SignInForm } from "@/components/signin-form"

export function AppContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <SignInForm />
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 print:w-full print:p-0">
        {children}
      </main>
    </div>
  )
}

