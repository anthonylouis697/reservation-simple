
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from 'react';
import { navigationConfig } from "@/config/navigation";
import type { NavItem as NavItemType } from "@/types/navigation";
import { NavItem } from "@/components/Navigation/NavItem";
import { HomeMenuItem } from '@/components/Navigation/HomeMenuItem';
import { HelpMenuItem } from '@/components/Navigation/HelpMenuItem';
import { SubMenu } from '@/components/Navigation/SubMenu';
import { SignOutButton } from '@/components/Navigation/SignOutButton';
import { NavigationCategory } from '@/components/Navigation/NavigationCategory';
import { useAuth } from '@/contexts/AuthContext';

// Re-export components for backward compatibility
export { HomeMenuItem as HomeNavItem } from '@/components/Navigation/HomeMenuItem';
export { HelpMenuItem as HelpNavItem } from '@/components/Navigation/HelpMenuItem';

export function MainNavigation({ mobile = false }: { mobile?: boolean }) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [firstTimeUser, setFirstTimeUser] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  
  // Combiner tous les éléments de navigation
  const mainNavItems = [...navigationConfig.mainNav].filter(item => 
    item.title !== "Services" && item.title !== "Profil"
  );
  const servicesSubNavItems = [...navigationConfig.servicesSubNav];
  const profileSubNavItems = [...navigationConfig.profileSubNav];
  const marketingNavItems = [...navigationConfig.marketingNav];
  const visibilityNavItems = [...navigationConfig.visibilityNav];
  const bottomNavItems = navigationConfig.bottomNav.filter(item => 
    // Ne pas afficher l'item "Aide" et "Profil" ici car ils sont gérés séparément
    item.title !== "Aide" && item.title !== "Profil"
  );

  // Vérifier si les sous-menus doivent être ouverts en fonction de l'URL
  useEffect(() => {
    // Ouvrir le sous-menu Services si nous sommes sur une page liée aux services ou aux événements
    if (location.pathname.includes('/services') || location.pathname.includes('/events')) {
      setServicesOpen(true);
    }
    
    // Ouvrir le sous-menu Profil si nous sommes sur une page liée au profil, à l'entreprise ou à la disponibilité
    if (location.pathname.includes('/account/profile') || 
        location.pathname.includes('/settings/business') || 
        location.pathname.includes('/settings/availability')) {
      setProfileOpen(true);
    }
  }, [location.pathname]);

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
    // A small animation to improve user experience
    if (mobile) {
      const element = document.getElementById(href);
      if (element) {
        element.classList.add('animate-pulse');
        setTimeout(() => {
          element.classList.remove('animate-pulse');
          navigate(href);
        }, 150);
      } else {
        navigate(href);
      }
    } else {
      navigate(href);
    }
  };

  return (
    <TooltipProvider>
      <div className={cn(
        "flex",
        mobile ? "flex-row justify-around w-full overflow-x-auto pb-safe" : "flex-col space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]"
      )}>
        {/* Ajout du lien vers l'accueil */}
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

        {/* Sous-menu Services */}
        <SubMenu 
          title="Services" 
          items={servicesSubNavItems} 
          isOpen={servicesOpen} 
          setIsOpen={setServicesOpen}
          mobile={mobile}
          handleNavigation={handleNavigation}
        />

        {/* Marketing */}
        {!mobile && (
          <NavigationCategory
            title="MARKETING"
            items={marketingNavItems}
            handleNavigation={handleNavigation}
          />
        )}
        
        {/* Visibilité */}
        {!mobile && (
          <NavigationCategory
            title="VISIBILITÉ"
            items={visibilityNavItems}
            handleNavigation={handleNavigation}
          />
        )}

        {/* Navigation inférieure */}
        {!mobile && bottomNavItems.length > 0 && (
          <div className="mt-auto pt-4">
            <div className="flex flex-col space-y-1">
              {/* Sous-menu Profil */}
              <SubMenu 
                title="Profil" 
                items={profileSubNavItems} 
                isOpen={profileOpen} 
                setIsOpen={setProfileOpen}
                mobile={mobile}
                handleNavigation={handleNavigation}
              />
              
              {bottomNavItems.map((item) => (
                <NavItem 
                  key={item.title} 
                  item={item}
                  mobile={mobile}
                  isFirstTimeUser={false}
                  handleNavigation={handleNavigation}
                />
              ))}
              
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
