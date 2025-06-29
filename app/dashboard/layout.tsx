"use client"
import { useState } from "react"
import { Header } from "@/components/ui/header"
import { Sidebar } from "@/components/ui/sidebar"
import type { ReactNode } from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { userAPI } from "@/lib/api"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const { user, token, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuthAndAgreement = async () => {
      if (!isLoading) {
        if (!token) {
          router.push("/login")
          return
        }

        if (user?.role === "admin") {
          router.push("/admin/dashboard")
          return
        }

        try {
          const agreement = await userAPI.getAgreementStatus(token)
          const submitted = agreement?.submitted ?? false

          if (!submitted && pathname !== "/dashboard/agreement") {
            router.push("/dashboard/agreement")
          }
        } catch (error) {
          console.error("Failed to check agreement status", error)
        }
      }
    }

    checkAuthAndAgreement()
  }, [isLoading, token, user, pathname, router])

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
