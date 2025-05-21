
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from 'react';
import { navigationConfig } from "@/config/navigation";
import type { NavItem as NavItemType } from "@/types/navigation";
import { NavItem } from "@/components/Navigation/NavItem";
import { HomeMenuItem } from '@/components/Navigation/HomeMenuItem';
import { HelpMenuItem } from '@/components/Navigation/HelpMenuItem';
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
  const location = useLocation();
  
  // Combiner tous les éléments de navigation
  const mainNavItems = [...navigationConfig.mainNav].filter(item => 
    item.title !== "Services" && item.title !== "Profil"
  );
  const servicesNavItems = [...navigationConfig.servicesSubNav];
  const profileNavItems = [...navigationConfig.profileSubNav];
  const marketingNavItems = [...navigationConfig.marketingNav];
  const visibilityNavItems = [...navigationConfig.visibilityNav];
  const bottomNavItems = navigationConfig.bottomNav.filter(item => 
    // Ne pas afficher l'item "Aide" et "Profil" ici car ils sont gérés séparément
    item.title !== "Aide" && item.title !== "Profil"
  );

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

        {/* Services as regular items */}
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
              {/* Profile items as regular menu items */}
              {profileNavItems.length > 0 && (
                <>
                  <div className="mt-6 mb-2">
                    <h4 className="px-2 text-xs font-semibold text-muted-foreground">
                      PROFIL
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
                </>
              )}
              
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
