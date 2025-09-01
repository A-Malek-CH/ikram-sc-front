import type React from "react"
import type { Metadata } from "next"
import { Tajawal } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"
import { TTSProvider } from "./context/tts-context"

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
})

export const metadata: Metadata = {
  title: "🎓 IKRAM-SC | Thiqati by Ikram",
  description: "منصة ثقتي الإرشادية لتعزيز الثقة بالنفس لدى طلاب الجامعات",
  icons: {
    icon: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={tajawal.className}>
        <AuthProvider>
          <TTSProvider>
            {children}
            <Toaster />
          </TTSProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
