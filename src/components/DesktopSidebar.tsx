
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBusiness } from "@/contexts/BusinessContext";
import { NavItem } from "./Navigation/NavItem";
import { HomeMenuItem } from "./Navigation/HomeMenuItem";
import { SignOutButton } from '@/components/Navigation/SignOutButton';
import { User, Clock, Calendar, Users, Palette, BookOpen, CalendarClock, PackageCheck } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";

export function DesktopSidebar() {
  const { pathname } = useLocation();
  const { currentBusiness } = useBusiness();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  // Menu items avec href au lieu de url et les événements retirés
  const mainNavItems = [
    {
      title: "Réservations",
      href: "/reservations",
      icon: <Clock className="h-4 w-4" />,
      description: "Gérer les réservations"
    },
    {
      title: "Calendrier",
      href: "/calendar",
      icon: <Calendar className="h-4 w-4" />,
      description: "Gérer votre planning"
    },
    {
      title: "Clients",
      href: "/clients",
      icon: <Users className="h-4 w-4" />,
      description: "Gérer vos clients"
    }
  ];
  
  const servicesNavItems = [
    {
      title: "Services",
      href: "/services",
      icon: <BookOpen className="h-4 w-4" />,
      description: "Gérer vos services"
    }
  ];
  
  const visibilityNavItems = [{
    title: "Page de réservation",
    href: "/booking-page",
    icon: <Palette className="h-4 w-4" />,
    description: "Personnaliser votre page de réservation"
  }];

  const additionalServicesNavItems = [{
    title: "Modules complémentaires",
    href: "/additional-services",
    icon: <PackageCheck className="h-4 w-4" />,
    description: "Activer des fonctionnalités avancées"
  }];
  
  const profileNavItems = [
    {
      title: "Profil",
      href: "/account/profile",
      icon: <User className="h-4 w-4" />,
      description: "Gérer votre profil"
    },
    {
      title: "Disponibilité",
      href: "/account/availability",
      icon: <CalendarClock className="h-4 w-4" />,
      description: "Gérer vos disponibilités"
    }
  ];

  // Function to handle navigation
  const handleNavigation = (href: string) => {
    navigate(href);
  };

  // Check if navigation items should be disabled
  const isItemDisabled = (item: any) => {
    return !item.alwaysAccessible && !currentBusiness;
  };

  return (
    <div className="hidden border-r bg-background lg:block lg:w-64">
      <div className="flex flex-col h-full">
        <div className="flex h-14 items-center border-b px-4">
          <Link
            to="/calendar"
            className="flex items-center space-x-2 font-semibold"
          >
            <span className="text-xl font-bold">Reservatoo</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-4 px-4">
          
          {/* Navigation principale */}
          <div className="flex flex-col space-y-1">
            <HomeMenuItem />
            {mainNavItems.map((item, index) => (
              <NavItem 
                key={index} 
                item={item}
                handleNavigation={handleNavigation}
                disabled={isItemDisabled(item)}
              />
            ))}
          </div>
          
          {/* Services */}
          <div className="mt-6 mb-2">
            <h4 className="px-2 text-xs font-semibold text-muted-foreground">
              SERVICES
            </h4>
          </div>
          <div className="flex flex-col space-y-1">
            {servicesNavItems.map((item, index) => (
              <NavItem 
                key={`service-${index}`}
                item={item}
                handleNavigation={handleNavigation}
                disabled={isItemDisabled(item)}
              />
            ))}
          </div>

          {/* Modules complémentaires */}
          <div className="mt-6 mb-2">
            <h4 className="px-2 text-xs font-semibold text-muted-foreground">
              MODULES
            </h4>
          </div>
          <div className="flex flex-col space-y-1">
            {additionalServicesNavItems.map((item, index) => (
              <NavItem 
                key={`addon-${index}`}
                item={item}
                handleNavigation={handleNavigation}
                disabled={isItemDisabled(item)}
              />
            ))}
          </div>

          {/* Visibilité */}
          {visibilityNavItems.length > 0 && (
            <>
              <div className="mt-6 mb-2">
                <h4 className="px-2 text-xs font-semibold text-muted-foreground">
                  VISIBILITÉ
                </h4>
              </div>
              <div className="flex flex-col space-y-1">
                {visibilityNavItems.map((item, index) => (
                  <NavItem 
                    key={index} 
                    item={item}
                    handleNavigation={handleNavigation}
                    disabled={isItemDisabled(item)}
                  />
                ))}
              </div>
            </>
          )}

          {/* Compte - Profil et Paramètres */}
          <div className="mt-6 mb-2">
            <h4 className="px-2 text-xs font-semibold text-muted-foreground">
              COMPTE
            </h4>
          </div>
          <div className="flex flex-col space-y-1">
            {profileNavItems.map((item, index) => (
              <NavItem 
                key={index} 
                item={item}
                handleNavigation={handleNavigation}
                disabled={isItemDisabled(item)}
              />
            ))}
          </div>

          {/* Déconnexion */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex flex-col space-y-1">
              <SignOutButton signOut={signOut} />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default DesktopSidebar;
