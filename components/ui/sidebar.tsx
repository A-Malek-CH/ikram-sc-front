// components/sidebar.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Home, MessageSquare, User, LogOut, Music2, Volume2, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

type SidebarProps = {
  mobile?: boolean
}

export function Sidebar({ mobile = false }: SidebarProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!audioRef.current) return
    isPlaying ? audioRef.current.play() : audioRef.current.pause()
  }, [isPlaying])

  const { logout } = useAuth()

  const linkClasses =
    "flex items-center p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"

  return (
    <nav
      className={`p-4 space-y-2 h-full ${
        mobile ? "bg-white" : "bg-sidebar text-sidebar-foreground"
      }`}
    >
      <Link href="/dashboard/home" className={linkClasses}>
        <Home className="ml-2 h-5 w-5" />
        <span>الرئيسية</span>
      </Link>

      <Link href="/dashboard/stages" className={linkClasses}>
        <MessageSquare className="ml-2 h-5 w-5" />
        <span>المراحل</span>
      </Link>

      <Link href="/dashboard/profile" className={linkClasses}>
        <User className="ml-2 h-5 w-5" />
        <span>الملف الشخصي</span>
      </Link>

      <Link
        href="/dashboard/notes"
        className="flex items-center gap-2 p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md"
      >
        <span className="text-lg">📝</span>
        <span>ملاحظاتي</span>
      </Link>

      <Link href="/dashboard/achievements" className={linkClasses}>
        <Trophy className="ml-2 h-5 w-5" />
        <span>الإنجازات</span>
      </Link>

      <Button
        variant="ghost"
        className="w-full flex items-center justify-start p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? (
          <>
            <Volume2 className="ml-2 h-5 w-5" />
            <span>إيقاف الصوت</span>
          </>
        ) : (
          <>
            <Music2 className="ml-2 h-5 w-5" />
            <span>تشغيل أصوات مريحة</span>
          </>
        )}
      </Button>

      <Button
        variant="ghost"
        className="w-full flex items-center justify-start p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-red-300"
        onClick={logout}
      >
        <LogOut className="ml-2 h-5 w-5" />
        <span>تسجيل الخروج</span>
      </Button>

      <audio ref={audioRef} loop src="/sound.mp3" />
    </nav>
  )
}
