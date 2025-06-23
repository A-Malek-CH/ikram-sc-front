"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { authAPI } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { LockKeyhole, Mail } from "lucide-react"

export default function LoginPage() {
  const { toast } = useToast()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      })

      login(response.token, response.role)
      localStorage.setItem("firstLogin", "true")

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في 🎓 IKRAM-SC | Thiqati by Ikram",
      })
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "فشل تسجيل الدخول",
        description: error instanceof Error ? error.message : "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#a8dadc] p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
  <img
    src="/logo.png"
    alt="شعار المنصة"
    className="mx-auto h-48 w-48 mb-6 rounded-full border-4 border-[#1D3557] shadow-lg"
  />
  <h1 className="text-4xl font-bold text-[#1D3557]">IKRAM-SC | Thiqati by Ikram</h1>
  <p className="text-[#1D3557] mt-2 text-base">
    منصة إرشاد نفسي تفاعلي لطلاب الجامعات
  </p>
</div>





        {/* Card */}
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-center text-[#1D3557]">تسجيل الدخول</CardTitle>
            <CardDescription className="text-center text-[#1D3557]">
              أدخل بيانات حسابك للانضمام إلى رحلتك النفسية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#1D3557] font-medium">البريد الإلكتروني</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-[#1D3557]">
                    <Mail size={18} />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@example.com"
                    required
                    className="pl-10 bg-blue-50 border-blue-200 focus:border-blue-400 focus-visible:ring-blue-300"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[#1D3557] font-medium">كلمة المرور</Label>
                  <Link href="/forgot-password" className="text-sm text-[#1D3557] hover:text-[#457b9d] transition-colors">
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-[#1D3557]">
                    <LockKeyhole size={18} />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="pl-10 bg-blue-50 border-blue-200 focus:border-blue-400 focus-visible:ring-blue-300"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#1D3557] hover:bg-[#457b9d] transition-colors py-6 text-base" 
                disabled={isLoading}
              >
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center pt-2 pb-6">
            <p className="text-sm text-gray-600">
              ليس لديك حساب؟{" "}
              <Link href="/signup" className="text-[#1D3557] hover:text-[#457b9d] font-medium transition-colors">
                إنشاء حساب جديد
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
