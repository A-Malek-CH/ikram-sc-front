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
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await authAPI.resetPassword(email)

      toast({
        title: "تم إرسال رمز إعادة تعيين كلمة المرور",
        description: "تم إرسال رمز إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
      })

      // Redirect to reset password page
      router.push(`/reset-password?email=${encodeURIComponent(email)}`)
    } catch (error) {
      console.error("Reset password error:", error)
      toast({
        title: "فشل إرسال رمز إعادة التعيين",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء إرسال رمز إعادة التعيين",
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
            <CardTitle className="text-2xl font-bold text-center text-[#1D3557]">استعادة كلمة المرور</CardTitle>
            <CardDescription className="text-center text-[#1D3557]">
              أدخل بريدك الإلكتروني وسنرسل لك رمز إعادة تعيين كلمة المرور
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#1D3557] font-medium">البريد الإلكتروني</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-[#1D3557]">
                    <Mail size={18} />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@example.com"
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
                {isLoading ? "جاري إرسال الرمز..." : "إرسال رمز إعادة التعيين"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center pt-2 pb-6">
            <Link 
              href="/login" 
              className="flex items-center gap-2 text-[#1D3557] hover:text-[#457b9d] font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              <span>العودة إلى تسجيل الدخول</span>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}