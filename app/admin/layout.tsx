"use client"
import type { ReactNode } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, token, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!token || user?.role !== "admin") {
        router.replace("/login") // or a 403 page
      }
    }
  }, [isLoading, token, user, router])

  if (isLoading || !token || user?.role !== "admin") {
    return null
  }

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      {/* You can customize admin UI layout here */}
      {children}
    </main>
  )
}
