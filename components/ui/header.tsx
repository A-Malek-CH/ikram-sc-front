"use client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger,SheetTitle  } from "@/components/ui/sheet"
import { Sidebar } from "@/components/ui/sidebar"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
export function Header() {
  return (
    <header className="fixed top-0 inset-x-0 h-16 z-50 bg-white/95 backdrop-blur border-b shadow-sm">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-3">
          {/* Mobile menu (only visible on small screens) */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
           <SheetContent side="left" className="p-0 w-[80%] max-w-sm">
  {/* Hidden title for accessibility */}
  <VisuallyHidden>
    <SheetTitle>القائمة الجانبية</SheetTitle>
  </VisuallyHidden>
  <Sidebar />
</SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/dashboard/home" className="flex items-center gap-2">
            <Image
              src="/favicon.png"
              alt="App Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
            <span className="hidden sm:block text-lg md:text-xl font-extrabold text-[#1D3557] tracking-wide">
              IKRAM-SC | Thiqati by Ikram
            </span>
          </Link>
        </div>

        {/* Right: Header Actions */}
        <div className="flex items-center gap-3">
          {/* Example placeholder for future buttons */}
          {/* <Button variant="outline" className="text-[#1D3557]">Profile</Button> */}
        </div>
      </div>
    </header>
  )
}
