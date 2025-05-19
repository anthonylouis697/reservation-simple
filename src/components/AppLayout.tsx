
import { ReactNode } from "react";
import { MainNavigation } from "@/components/MainNavigation";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, HelpCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import { QuickHelp } from "@/components/QuickHelp";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  const handleLogout = () => {
    // Dans une vraie app, cela déconnecterait l'utilisateur
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Sidebar for desktop */}
      <aside className="bg-white w-64 border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-indigo-600 text-xl font-bold">BookWise</h2>
        </div>
        <div className="flex-grow py-6 px-4">
          <MainNavigation />
        </div>
        <div className="p-4 border-t border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start text-left">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                    <span className="font-medium text-indigo-600">JD</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">Professionnel</p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                Mon profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-grow overflow-auto pb-20 md:pb-6">
        {/* Mobile header */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-10 flex justify-between items-center">
          <h2 className="text-indigo-600 text-xl font-bold">BookWise</h2>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsHelpOpen(true)}
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-indigo-600 text-xl font-bold">BookWise</h2>
                  </div>
                  
                  <div className="p-4 flex-grow">
                    <MainNavigation />
                  </div>
                  
                  <div className="p-4 border-t border-gray-200">
                    <Button variant="ghost" className="w-full justify-start text-left" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Page content */}
        <div className="max-w-7xl mx-auto p-6">
          {children}
        </div>
        
        {/* Bottom navigation for mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
          <MainNavigation mobile />
        </div>
      </main>
      
      {/* Quick help panel */}
      <QuickHelp open={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
