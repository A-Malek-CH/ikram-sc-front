"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { authAPI } from "@/lib/api"
import Link from "next/link"
import { Mail, KeyRound, LockKeyhole } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Get email from URL params
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !code) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال البريد الإلكتروني ورمز التحقق",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await authAPI.verifyResetCode(email, code)

      setIsVerified(true)

      toast({
        title: "تم التحقق من الرمز",
        description: "يمكنك الآن إدخال كلمة المرور الجديدة",
      })
    } catch (error) {
      console.error("Verification error:", error)
      toast({
        title: "فشل التحقق",
        description: error instanceof Error ? error.message : "رمز التحقق غير صحيح",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمات المرور غير متطابقة",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await authAPI.setNewPassword(email, code, password)

      toast({
        title: "تم إعادة تعيين كلمة المرور",
        description: "يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة",
      })

      // Redirect to login page
      router.push("/login")
    } catch (error) {
      console.error("Reset password error:", error)
      toast({
        title: "فشل إعادة تعيين كلمة المرور",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء إعادة تعيين كلمة المرور",
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
            <CardTitle className="text-2xl font-bold text-center text-[#1D3557]">إعادة تعيين كلمة المرور</CardTitle>
            <CardDescription className="text-center text-[#1D3557]">
              {isVerified 
                ? "أدخل كلمة المرور الجديدة" 
                : "أدخل رمز التحقق الذي تم إرساله إلى بريدك الإلكتروني"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isVerified ? (
              <form onSubmit={handleVerifyCode} className="space-y-4">
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
                      disabled={!!searchParams.get("email")}
                      className="pl-10 bg-blue-50 border-blue-200 focus:border-blue-400 focus-visible:ring-blue-300"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-[#1D3557] font-medium">رمز التحقق</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-[#1D3557]">
                      <KeyRound size={18} />
                    </div>
                    <Input
                      id="code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="أدخل رمز التحقق"
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
                  {isLoading ? "جاري التحقق..." : "تحقق من الرمز"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#1D3557] font-medium">كلمة المرور الجديدة</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-[#1D3557]">
                      <LockKeyhole size={18} />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {isLoading ? "جاري إعادة التعيين..." : "إعادة تعيين كلمة المرور"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center pt-2 pb-6">
            <Link href="/login" className="text-[#1D3557] hover:text-[#457b9d] font-medium transition-colors">
              العودة إلى تسجيل الدخول
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}