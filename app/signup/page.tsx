"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { authAPI } from "@/lib/api"
import { User, Mail, LockKeyhole, UserCheck } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمات المرور غير متطابقة",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Call signup API
      const response = await authAPI.signup({
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
      })

      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "تم إرسال رمز التحقق إلى بريدك الإلكتروني",
      })

      // Redirect to verification page
      router.push(`/verify?email=${encodeURIComponent(formData.email)}`)
    } catch (error) {
      console.error("Signup error:", error)
      toast({
        title: "فشل في إنشاء الحساب",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء الحساب",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#a8dadc] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#1D3557]">منصة علم النفس</h1>
          <p className="text-[#1D3557] mt-2">بوابتك للصحة النفسية</p>
        </div>
        
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-center text-[#1D3557]">إنشاء حساب جديد</CardTitle>
            <CardDescription className="text-center text-[#1D3557]">
              أنشئ حسابك للبدء في رحلتك النفسية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-[#1D3557] font-medium">الاسم الأول</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-[#1D3557]">
                      <User size={18} />
                    </div>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="الاسم الأول"
                      required
                      className="pl-10 bg-blue-50 border-blue-200 focus:border-blue-400 focus-visible:ring-blue-300"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-[#1D3557] font-medium">اسم العائلة</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-[#1D3557]">
                      <UserCheck size={18} />
                    </div>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="اسم العائلة"
                      required
                      className="pl-10 bg-blue-50 border-blue-200 focus:border-blue-400 focus-visible:ring-blue-300"
                    />
                  </div>
                </div>
              </div>
              
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
                <Label htmlFor="password" className="text-[#1D3557] font-medium">كلمة المرور</Label>
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
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#1D3557] font-medium">تأكيد كلمة المرور</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-[#1D3557]">
                    <LockKeyhole size={18} />
                  </div>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="pl-10 bg-blue-50 border-blue-200 focus:border-blue-400 focus-visible:ring-blue-300"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-[#1D3557] hover:bg-[#457b9d] transition-colors py-6 mt-2 text-base" 
                disabled={isLoading}
              >
                {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center pt-2 pb-6">
            <p className="text-sm text-gray-600">
              لديك حساب بالفعل؟{" "}
              <Link href="/login" className="text-[#1D3557] hover:text-[#457b9d] font-medium transition-colors">
                تسجيل الدخول
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}