"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Lock, CheckCircle, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { sessionAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

type Session = {
  id: number
  stage: {
    id: number
    order: number
    name: string
    description: string
    is_chat: boolean
  }
  current_question: number
  is_unlocked: boolean
  is_completed: boolean
  creation_date: string
  user: number
}

export default function StagesPage() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      if (!token) return

      try {
        const sessionsData = await sessionAPI.getSessions(token)
        // Sort sessions by stage order
        const sortedSessions = sessionsData.sort((a: Session, b: Session) => a.stage.order - b.stage.order)
        setSessions(sortedSessions)
      } catch (error) {
        console.error("Failed to fetch sessions:", error)
        toast({
          title: "خطأ في تحميل البيانات",
          description: "فشل في تحميل بيانات المراحل",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSessions()
  }, [token, toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-[#1D3557] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-lg text-[#1D3557]">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  // Calculate progress
  const completedSessions = sessions.filter((session) => session.is_completed).length
  const progress = sessions.length > 0 ? Math.round((completedSessions / sessions.length) * 100) : 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#1D3557] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">المراحل</h1>
            <p className="text-white mt-1">استكشف رحلتك النفسية من خلال المراحل التالية</p>
          </div>
          <div className="flex items-center gap-2 bg-white p-3 rounded-xl shadow-sm">
            <CheckCircle className="h-6 w-6 text-[#1D3557]" />
            <div>
              <p className="text-sm text-gray-500">تقدمك الكلي</p>
              <p className="text-xl font-bold text-[#1D3557]">{progress}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stages Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1D3557] flex items-center gap-2">
            <ChevronRight className="h-5 w-5 text-[#1D3557]" />
            جميع المراحل
          </h2>
       
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <Card
                key={session.id}
                className={`border-none shadow-md transition-all duration-200 hover:shadow-lg ${
                  !session.is_unlocked ? "opacity-70 bg-gray-50" : "bg-white"
                } ${
                  session.is_completed
                    ? "border-l-4 border-l-green-500"
                    : session.is_unlocked
                      ? "border-l-4 border-l-[#1d3557]"
                      : ""
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-[#1D3557]">{session.stage.name}</CardTitle>
                    {session.is_completed && (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        مكتمل
                      </Badge>
                    )}
                    {session.is_unlocked && !session.is_completed && (
                      <Badge className="bg-[#1d3557] hover:bg-[#1d3557]">
                        متاح
                      </Badge>
                    )}
                    {!session.is_unlocked && (
                      <Badge variant="outline" className="flex items-center gap-1 border-gray-300 text-gray-500">
                        <Lock className="h-3 w-3" /> مغلق
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-[#457B9D]">
                    {session.stage.is_chat ? "محادثة تفاعلية" : "نموذج تقييم"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {session.stage.description || "استكشف هذه المرحلة من رحلتك النفسية واكتشف المزيد عن نفسك."}
                  </p>

                  {!session.is_unlocked ? (
                    <div className="flex items-center text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                      <Clock className="h-4 w-4 ml-2 text-gray-400" />
                      <span>يفتح بعد إكمال المرحلة السابقة</span>
                    </div>
                  ) : (
                    <Link href={`/dashboard/stages/${session.id}`}>
                      <Button className="w-full bg-[#1D3557] hover:bg-[#0F1C2D] transition-all duration-200">
                        {session.is_completed ? "عرض المحادثة" : "بدء المرحلة"}
                        <ArrowLeft className="h-4 w-4 mr-1" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full bg-[#F1FAEE] rounded-xl text-center py-12 px-4">
              <div className="mx-auto w-16 h-16 bg-[#A8DADC] rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-[#1D3557]" />
              </div>
              <p className="text-[#1D3557] font-medium text-lg">لا توجد مراحل متاحة حالياً</p>
              <p className="text-[#457B9D] mt-2">سيتم إضافة مراحل جديدة قريباً</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}