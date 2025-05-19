
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { LogOut, User, Settings, CreditCard, Users, Key } from "lucide-react";

type UserData = {
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

interface UserProfileDropdownProps {
  user: UserData;
  variant?: "sidebar" | "mobile";
}

export function UserProfileDropdown({ user, variant = "sidebar" }: UserProfileDropdownProps) {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Dans une vraie app, cela déconnecterait l'utilisateur
    navigate('/');
  };

  if (variant === "mobile") {
    return (
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
    );
  }

  return (
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
  );
}
