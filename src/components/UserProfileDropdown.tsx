
import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfileDropdownProps {
  user?: {
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
  variant?: 'default' | 'mobile';
}

export const UserProfileDropdown = ({ user: providedUser, variant = 'default' }: UserProfileDropdownProps) => {
  const { signOut, user: authUser, profile } = useAuth();

  // Utiliser les données d'authentification réelles si disponibles, sinon utiliser les données fournies
  const userData = authUser ? {
    name: profile?.first_name && profile?.last_name 
      ? `${profile.first_name} ${profile.last_name}` 
      : authUser.email?.split('@')[0] || 'Utilisateur',
    email: authUser.email || '',
    initials: profile?.first_name && profile?.last_name 
      ? `${profile.first_name[0]}${profile.last_name[0]}` 
      : authUser.email?.substring(0, 2).toUpperCase() || 'U',
    role: profile?.role || 'Utilisateur',
    subscription: {
      plan: 'Gratuit',
      status: 'active',
      renewalDate: new Date().toLocaleDateString('fr-FR')
    }
  } : providedUser || {
    name: 'Utilisateur',
    email: '',
    initials: 'U',
    role: 'Utilisateur',
    subscription: {
      plan: 'Gratuit',
      status: 'active',
      renewalDate: new Date().toLocaleDateString('fr-FR')
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || ""} alt={userData.name} />
            <AvatarFallback>{userData.initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userData.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userData.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/account/profile">
              Mon profil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/account/security">
              Sécurité
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/account/billing">
              Facturation
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/account/team">
              Équipe
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="text-red-600 hover:text-red-700 cursor-pointer"
        >
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;
