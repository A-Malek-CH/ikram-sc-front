// components/sidebar.tsx
"use client"
import { useState, useRef, useEffect } from "react"


import Link from "next/link"
import { Home, MessageSquare, User, LogOut, Music2, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export function Sidebar() {

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
    <nav className="p-4 space-y-2 bg-sidebar text-sidebar-foreground h-full">
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
      <Button
        variant="ghost"
        className="w-full flex items-center justify-start p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-red-300"
        onClick={logout}
      >
        <LogOut className="ml-2 h-5 w-5" />
        <span>تسجيل الخروج</span>
      </Button>
      <audio ref={audioRef} loop src=" /sound.mp3" />

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
      <span>تشغيل اصوات مريحة</span>
    </>
  )}
</Button>

    </nav>
  )
}
