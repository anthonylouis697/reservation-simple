
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MainNavigation } from "@/components/MainNavigation";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { BusinessSelector } from "./BusinessSelector";

export const MobileHeader = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="mr-2 px-1 sm:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <MainNavigation mobile={true} />
          </SheetContent>
        </Sheet>

        <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
          <span className="hidden sm:inline-block">Reservatoo</span>
          <span className="sm:hidden">R.</span>
        </Link>

        <div className="flex items-center space-x-2">
          {user && <BusinessSelector />}
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
