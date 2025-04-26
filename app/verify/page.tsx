"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { authAPI } from "@/lib/api"
import Link from "next/link"
import { Mail, KeyRound } from 'lucide-react'
import { Label } from "@/components/ui/label"

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleVerify = async (e: React.FormEvent) => {
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
      await authAPI.verifySignup(email, code)

      toast({
        title: "تم التحقق بنجاح",
        description: "تم التحقق من حسابك بنجاح، يمكنك الآن تسجيل الدخول",
      })

      router.push("/login")
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

  const handleResendCode = async () => {
    if (!email) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال البريد الإلكتروني",
        variant: "destructive",
      })
      return
    }

    setIsResending(true)

    try {
      await authAPI.resendCode(email)

      toast({
        title: "تم إرسال الرمز",
        description: "تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني",
      })

      setCountdown(60)
    } catch (error) {
      console.error("Resend code error:", error)
      toast({
        title: "فشل إرسال الرمز",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء إرسال رمز التحقق",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
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
            <CardTitle className="text-2xl font-bold text-center text-[#1D3557]">تحقق من بريدك الإلكتروني</CardTitle>
            <CardDescription className="text-center text-[#1D3557]">
              لقد أرسلنا رمز تحقق إلى بريدك الإلكتروني
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#1D3557] font-medium">البريد الإلكتروني</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-[#1D3557]">
                    <Mail size={18} />
                  </div>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="البريد الإلكتروني"
                    type="email"
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
                    placeholder="رمز التحقق" 
                    required
                    className="pl-10 bg-blue-50 border-blue-200 focus:border-blue-400 focus-visible:ring-blue-300"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#1D3557] hover:bg-[#457b9d] py-6" 
                disabled={isLoading}
              >
                {isLoading ? "جاري التحقق..." : "تحقق"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-center w-full">
              <Button
                variant="link"
                onClick={handleResendCode}
                disabled={isResending || countdown > 0}
                className="text-[#1D3557] hover:text-[#457b9d]"
              >
                {countdown > 0
                  ? `إعادة إرسال الرمز (${countdown})`
                  : isResending
                    ? "جاري إعادة الإرسال..."
                    : "لم يصلك الرمز؟ إعادة إرسال"}
              </Button>
            </div>
            <div className="text-center w-full">
              <Link href="/login" className="text-sm text-[#1D3557] hover:text-[#457b9d]">
                العودة إلى تسجيل الدخول
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}