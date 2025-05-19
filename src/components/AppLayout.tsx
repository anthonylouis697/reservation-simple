import { ReactNode, useState } from "react";
import { MainNavigation } from "@/components/MainNavigation";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, HelpCircle, User, Settings, CreditCard, Users, Key } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { QuickHelp } from "@/components/QuickHelp";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  // Mocked user data - in a real app this would come from auth context
  const user = {
    name: "Thomas Martin",
    email: "thomas@example.com",
    initials: "TM",
    role: "Propriétaire",
    subscription: {
      plan: "Premium",
      status: "active",
      renewalDate: "15/06/2025"
    }
  };
  
  const handleLogout = () => {
    // Dans une vraie app, cela déconnecterait l'utilisateur
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Sidebar for desktop */}
      <aside className="bg-white w-64 border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-indigo-600 text-xl font-bold">Reservatoo</h2>
        </div>
        <div className="flex-grow py-6 px-4">
          <MainNavigation />
        </div>
        <div className="p-4 border-t border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start text-left">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback className="bg-indigo-100 text-indigo-600">{user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium">{user.name}</p>
                    <div className="flex items-center">
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                      <Badge variant="outline" className="ml-1.5 text-[10px] h-4 bg-indigo-50 text-indigo-600 hover:bg-indigo-50">{user.subscription.plan}</Badge>
                    </div>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate('/account')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/account/team')}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Équipe</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/account/billing')}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Facturation</span>
                  {user.subscription.plan !== "Free" && (
                    <DropdownMenuShortcut>
                      <Badge variant="outline" className="ml-auto text-[10px] h-4">
                        {user.subscription.plan}
                      </Badge>
                    </DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/account/security')}>
                  <Key className="mr-2 h-4 w-4" />
                  <span>Sécurité</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
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
          <h2 className="text-indigo-600 text-xl font-bold">Reservatoo</h2>
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
                    <h2 className="text-indigo-600 text-xl font-bold">Reservatoo</h2>
                  </div>
                  
                  <div className="p-4 flex-grow">
                    <MainNavigation />
                  </div>
                  
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback className="bg-indigo-100 text-indigo-600">{user.initials}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="text-sm font-medium">{user.name}</p>
                        <div className="flex items-center">
                          <p className="text-xs text-muted-foreground">{user.role}</p>
                          <Badge variant="outline" className="ml-1.5 text-[10px] h-4 bg-indigo-50 text-indigo-600 hover:bg-indigo-50">{user.subscription.plan}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => navigate('/account')}>
                        <User className="mr-2 h-4 w-4" />
                        Profil
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => navigate('/account/team')}>
                        <Users className="mr-2 h-4 w-4" />
                        Équipe
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => navigate('/account/billing')}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Facturation
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => navigate('/account/security')}>
                        <Key className="mr-2 h-4 w-4" />
                        Sécurité
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => navigate('/settings')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Paramètres
                      </Button>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="w-full justify-start text-red-600 mt-4" onClick={handleLogout}>
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
