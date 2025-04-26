"use client"

import { Header } from "@/components/ui/header"
import { Sidebar } from "@/components/ui/sidebar"
import type { ReactNode } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const { user, token, isLoading, logout } = useAuth()
  const router = useRouter()

  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login")
    }

    // Redirect admin to admin dashboard
    if (!isLoading && user?.role === "admin") {
      router.push("/admin/dashboard")
    }
  }, [isLoading, token, user, router])

  // Show nothing while checking authentication
  if (isLoading || !token || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#bdd5ea]">
      <Header />

      <div className="flex">
        <aside className="hidden md:block w-64 bg-white border-l h-[calc(100vh-54px)] sticky top-14 overflow-y-auto">
          <Sidebar />
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
