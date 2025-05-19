
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MainNavigation } from "@/components/MainNavigation";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";

interface MobileHeaderProps {
  onHelpClick: () => void;
  userData: {
    name: string;
    email: string;
    initials: string;
    role: string;
    subscription: {
      plan: string;
      status: string;
      renewalDate: string;
    };
  };
}

export function MobileHeader({ onHelpClick, userData }: MobileHeaderProps) {
  return (
    <div className="md:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-10 flex justify-between items-center shadow-sm">
      <h2 className="text-indigo-600 text-xl font-bold">Reservatoo</h2>
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onHelpClick}
          className="hover:bg-indigo-50"
          aria-label="Aide"
        >
          <HelpCircle className="h-5 w-5 text-indigo-600" />
        </Button>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-indigo-50" aria-label="Menu">
              <Menu className="h-5 w-5 text-indigo-600" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-gray-200 bg-indigo-50">
                <h2 className="text-indigo-600 text-xl font-bold">Reservatoo</h2>
              </div>
              
              <div className="p-4 flex-grow overflow-y-auto">
                <MainNavigation />
              </div>
              
              <div className="border-t border-gray-200">
                <UserProfileDropdown user={userData} variant="mobile" />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
