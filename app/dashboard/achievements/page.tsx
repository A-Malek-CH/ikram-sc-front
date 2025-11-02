"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { userAPI } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

type Achievement = {
  id?: number
  key: string
  name: string
  description: string
  image_url?: string      // ✅ from backend
  image?: string          // fallback (old shape)
}

type UserAchievement = {
  id?: number
  achievement: string | { key: string }
  unlocked_at?: string
  awarded_at?: string
}

export default function AchievementsPage() {
  const { token } = useAuth()
  const [all, setAll] = useState<Achievement[] | null>(null)
  const [mine, setMine] = useState<UserAchievement[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      if (!token) return
      try {
        const [a, m] = await Promise.all([
          userAPI.getAllAchievements(token),
          userAPI.getMyAchievements(token),
        ])
        setAll(a || [])
        setMine(m || [])
      } catch (e) {
        console.error("Failed to load achievements", e)
        setAll([])
        setMine([])
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [token])

  const unlockedKeys = useMemo(() => {
    if (!mine) return new Set<string>()
    const keys = mine.map((ua) =>
      typeof ua.achievement === "string"
        ? ua.achievement
        : (ua.achievement as any)?.key
    )
    return new Set(keys.filter(Boolean) as string[])
  }, [mine])

  const unlockedCount = useMemo(() => {
    if (!all) return 0
    return all.reduce((acc, a) => acc + (unlockedKeys.has(a.key) ? 1 : 0), 0)
  }, [all, unlockedKeys])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-[#1D3557]">الإنجازات</h1>
        <Skeleton className="h-6 w-64" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-40 w-full rounded-xl mb-3" />
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-full" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1D3557]">الإنجازات</h1>
        <Badge className="bg-[#1D3557]">{unlockedCount} / {all?.length ?? 0} مُكتسب</Badge>
      </div>

      <div>
        <Progress
          value={all && all.length ? Math.round((unlockedCount / all.length) * 100) : 0}
          className="h-3 bg-[#f1faee]"
        />
        <div className="text-sm text-[#1D3557] mt-2">
          نسبة الإنجاز: {all && all.length ? Math.round((unlockedCount / all.length) * 100) : 0}%
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(all ?? []).map((ach) => {
          const isUnlocked = unlockedKeys.has(ach.key)
          // Build a full image URL safely
const backendBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "";
let src = "";

if (ach.image_url) {
  // if the backend already provides a relative or absolute static path
  src = ach.image_url.startsWith("http")
    ? ach.image_url
    : `${backendBase}${ach.image_url.startsWith("/") ? "" : "/"}${ach.image_url}`;
} else if (ach.image) {
  // fallback for old field (like "static/achievements/goal_setting.png")
  src = ach.image.startsWith("http")
    ? ach.image
    : `${backendBase}${ach.image.startsWith("/") ? "" : "/"}${ach.image}`;
}
  // ✅ primary: image_url
          return (
            <Card
              key={ach.key}
              className={`p-4 transition-all duration-200 hover:shadow-md ${
                isUnlocked ? "bg-white" : "bg-white/70"
              }`}
            >
              <div className="relative overflow-hidden rounded-xl">
                {src ? (
                  <img
                    src={src}
                    alt={ach.name}
                    className={`w-full h-40 object-contain ${
                      isUnlocked ? "" : "grayscale opacity-60"
                    }`}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-100" />
                )}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <h3 className="font-bold text-[#1D3557]">{ach.name}</h3>
                {isUnlocked ? (
                  <Badge className="bg-green-600">مفتوح</Badge>
                ) : (
                  <Badge variant="outline" className="border-gray-300 text-gray-600">مغلق</Badge>
                )}
              </div>

              <p className="text-sm text-[#457B9D] mt-2">{ach.description}</p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
