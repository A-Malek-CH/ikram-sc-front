"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { userAPI } from "@/lib/api"

type User = {
  id: number
  email: string
  first_name: string
  last_name: string
  birth_date?: string
  gender?: string
  speciality?: string
  role: "user" | "admin"
}

type AuthContextType = {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (token: string, role: string) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // ✅ Restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken) {
      setToken(storedToken)
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }

    setIsLoading(false)
  }, [])

  // ✅ Fetch profile when token changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return

      try {
        const userData = await userAPI.getProfile(token)
        const role = user?.role || "user"

        const updatedUser = { ...userData, role }
        setUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))
      } catch (error) {
        console.error("Failed to fetch user profile:", error)
        if (error instanceof Error && error.message.includes("401")) {
          logout()
        }
      }
    }

    if (token && !user) {
      fetchUserProfile()
    }
  }, [token, user])

  const login = (newToken: string, role: string) => {
    setToken(newToken)
    localStorage.setItem("token", newToken)

    setUser({ id: 0, email: "", first_name: "", last_name: "", role: role as "user" | "admin" })

    if (role === "admin") {
      router.push("/admin/dashboard")
    } else {
      router.push("/dashboard")
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
