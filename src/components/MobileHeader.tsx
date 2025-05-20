
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, Bell, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MainNavigation } from "@/components/MainNavigation";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

export function MobileHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 border-b bg-white lg:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <div className="flex h-14 items-center border-b px-4">
                <Link
                  to="/"
                  className="flex items-center space-x-2 font-semibold"
                >
                  <span className="text-xl font-bold">Reservatoo</span>
                </Link>
                <SheetClose className="ml-auto">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </SheetClose>
              </div>
              <div className="py-4 px-4">
                <MainNavigation />
              </div>
            </SheetContent>
          </Sheet>
          <Link
            to="/"
            className="flex items-center space-x-2 font-semibold"
          >
            <span className="text-lg font-bold">Reservatoo</span>
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={cn(isSearchOpen && "bg-gray-100")}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="mr-1"
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Link to="/help">
            <Button
              variant="ghost"
              size="icon"
            >
              <HelpCircle className="h-5 w-5" />
              <span className="sr-only">Help</span>
            </Button>
          </Link>
        </div>
      </div>
      {isSearchOpen && (
        <div className="border-t border-b p-2 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Rechercher..."
              className="w-full rounded-md border pl-9 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      )}
    </header>
  );
}

export default MobileHeader;
