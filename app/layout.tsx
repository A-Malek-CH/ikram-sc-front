import type React from "react"
import type { Metadata } from "next"
import { Tajawal } from 'next/font/google'
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700']
})
export const metadata = {
  title: "🎓 IKRAM-SC | Thiqati by Ikram",
  description: "منصة ثقتي الإرشادية لتعزيز الثقة بالنفس لدى طلاب الجامعات",
  icons: {
    icon: "/favicon.png", // You can use .png instead of .ico
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={tajawal.className}>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
      
      </body>
    </html>
  )
}
