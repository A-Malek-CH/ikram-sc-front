import { Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Header = () => {
  return (
    <header className="bg-white border-b sticky top-0 z-30 h-[55px]">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left Side: Logo + Mobile Sidebar */}
        <div className="flex items-center gap-2">

          {/* Mobile Menu Button (for small screens) */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            {/* Sidebar Content for Mobile */}
            <SheetContent side="right" className="w-64">
              <div className="py-4">
                <div className="text-lg font-bold text-black">🎓 IKRAM-SC | Thiqati by Ikram</div>
                <Sidebar />
              </div>
            </SheetContent>
          </Sheet>

          {/* App Name */}
          <div className="text-xl font-bold text-black">🎓 IKRAM-SC | Thiqati by Ikram</div>
        </div>

        {/* Right Side: User Navigation */}
        <UserNav />
      </div>
    </header>
  );
};
