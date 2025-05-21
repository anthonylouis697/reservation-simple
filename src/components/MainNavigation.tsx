
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from 'react';
import { navigationConfig } from "@/config/navigation";
import type { NavItem as NavItemType } from "@/types/navigation";
import { NavItem } from "@/components/Navigation/NavItem";
import { HomeMenuItem } from '@/components/Navigation/HomeMenuItem';
import { HelpNavItem } from '@/components/Navigation/HelpNavItem';
import { SignOutButton } from '@/components/Navigation/SignOutButton';
import { NavigationCategory } from '@/components/Navigation/NavigationCategory';
import { useAuth } from '@/contexts/AuthContext';
import { User, Clock, Calendar, Users, Palette, BookOpen, Settings } from 'lucide-react';

// Re-export components for backward compatibility
export { HomeMenuItem as HomeNavItem } from '@/components/Navigation/HomeMenuItem';
export { HelpMenuItem as HelpNavItem } from '@/components/Navigation/HelpMenuItem';

export function MainNavigation({ mobile = false }: { mobile?: boolean }) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [firstTimeUser, setFirstTimeUser] = useState(false);
  const location = useLocation();
  
  // Menu items simplifiés - sans les données fictives
  const mainNavItems = [
    {
      title: "Réservations",
      url: "/reservations",
      icon: <Clock className="h-4 w-4" />,
      description: "Gérer les réservations"
    },
    {
      title: "Calendrier",
      url: "/calendar",
      icon: <Calendar className="h-4 w-4" />,
      description: "Gérer votre planning"
    },
    {
      title: "Clients",
      url: "/clients",
      icon: <Users className="h-4 w-4" />,
      description: "Gérer vos clients"
    }
  ];
  
  const servicesNavItems = [{
    title: "Services",
    url: "/services",
    icon: <BookOpen className="h-4 w-4" />,
    description: "Gérer vos services"
  }];
  
  const visibilityNavItems = [{
    title: "Page de réservation",
    url: "/booking-page",
    icon: <Palette className="h-4 w-4" />,
    description: "Personnaliser votre page de réservation"
  }];
  
  const profileNavItems = [{
    title: "Profil",
    url: "/account/profile",
    icon: <User className="h-4 w-4" />,
    description: "Gérer votre profil"
  }];
  
  const settingsNavItems = [{
    title: "Paramètres",
    url: "/settings",
    icon: <Settings className="h-4 w-4" />,
    description: "Paramètres de votre compte"
  }];

  // Check if user is new
  useEffect(() => {
    // Example: check local storage or user data from API
    const isFirstTime = localStorage.getItem('firstTimeUser') === null;
    setFirstTimeUser(isFirstTime);
    if (isFirstTime) {
      localStorage.setItem('firstTimeUser', 'false');
    }
  }, []);

  const handleNavigation = (href: string) => {    
    navigate(href);
  };

  return (
    <TooltipProvider>
      <div className={cn(
        "flex",
        mobile ? "flex-row justify-around w-full overflow-x-auto pb-safe" : "flex-col space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]"
      )}>
        {/* Accueil */}
        {!mobile && (
          <HomeMenuItem />
        )}
        
        {/* Navigation principale */}
        {mainNavItems.map((item) => (
          <div key={item.title} className="w-full">
            <NavItem
              item={item}
              mobile={mobile}
              isFirstTimeUser={firstTimeUser}
              handleNavigation={handleNavigation}
            />
          </div>
        ))}

        {/* Services */}
        {!mobile && servicesNavItems.length > 0 && (
          <>
            <div className="mt-6 mb-2">
              <h4 className="px-2 text-xs font-semibold text-muted-foreground">
                SERVICES
              </h4>
            </div>
            {servicesNavItems.map((item) => (
              <div key={item.title} className="w-full">
                <NavItem
                  item={item}
                  mobile={mobile}
                  isFirstTimeUser={firstTimeUser}
                  handleNavigation={handleNavigation}
                />
              </div>
            ))}
          </>
        )}
        
        {/* Visibilité */}
        {!mobile && (
          <>
            <div className="mt-6 mb-2">
              <h4 className="px-2 text-xs font-semibold text-muted-foreground">
                VISIBILITÉ
              </h4>
            </div>
            {visibilityNavItems.map((item) => (
              <div key={item.title} className="w-full">
                <NavItem
                  item={item}
                  mobile={mobile}
                  isFirstTimeUser={firstTimeUser}
                  handleNavigation={handleNavigation}
                />
              </div>
            ))}
          </>
        )}

        {/* Navigation inférieure */}
        {!mobile && (
          <div className="mt-auto pt-4">
            <div className="flex flex-col space-y-1">
              {/* Profil et Paramètres */}
              <>
                <div className="mt-6 mb-2">
                  <h4 className="px-2 text-xs font-semibold text-muted-foreground">
                    COMPTE
                  </h4>
                </div>
                {profileNavItems.map((item) => (
                  <div key={item.title} className="w-full">
                    <NavItem
                      item={item}
                      mobile={mobile}
                      isFirstTimeUser={firstTimeUser}
                      handleNavigation={handleNavigation}
                    />
                  </div>
                ))}
                {settingsNavItems.map((item) => (
                  <div key={item.title} className="w-full">
                    <NavItem
                      item={item}
                      mobile={mobile}
                      isFirstTimeUser={firstTimeUser}
                      handleNavigation={handleNavigation}
                    />
                  </div>
                ))}
              </>
              
              {/* Aide */}
              <HelpNavItem />
              
              {/* Déconnexion */}
              <SignOutButton signOut={signOut} />
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

export function MobileNavigation() {
  return <MainNavigation mobile={true} />;
}
