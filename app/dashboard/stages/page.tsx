"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Lock } from "lucide-react"
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
        <p className="text-lg">جاري تحميل البيانات...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">المراحل</h1>
        <Link href="/dashboard">
          <Button variant="outline" className="flex items-center gap-1 bg-white hover:bg-white">
            <ArrowLeft className="h-4 w-4" />
            <span>العودة للوحة التحكم</span>
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <Card key={session.id} className={!session.is_unlocked ? "opacity-70" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{session.stage.name}</CardTitle>
                  {session.is_completed && <Badge className="bg-green-500">مكتمل</Badge>}
                  {session.is_unlocked && !session.is_completed && <Badge className="bg-[#1d3557] hover:bg-[#1d3557]">متاح</Badge>}
                  {!session.is_unlocked && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Lock className="h-3 w-3" /> مغلق
                    </Badge>
                  )}
                </div>
                <CardDescription>{session.stage.is_chat ? "محادثة تفاعلية" : "نموذج تقييم"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">{session.stage.description}</p>
                </div>
                {!session.is_unlocked ? (
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 ml-1" />
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
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">لا توجد مراحل متاحة حالياً</p>
          </div>
        )}
      </div>
    </div>
  )
}
