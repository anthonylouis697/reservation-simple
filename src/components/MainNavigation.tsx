
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from 'react';
import { navigationConfig } from "@/config/navigation";
import type { NavItem as NavItemType } from "@/types/navigation";
import { NavItem } from "@/components/Navigation/NavItem";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { HelpCircle, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface HelpNavItemProps {
  mobile?: boolean;
}

export function HelpNavItem({ mobile = false }: HelpNavItemProps) {
  const navigate = useNavigate();
  
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-left mt-auto"
          onClick={() => navigate("/help")}
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Aide</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <div className="flex flex-col">
          <span className="font-medium">Centre d'aide</span>
          <span className="text-xs text-muted-foreground">Trouvez des réponses à vos questions</span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export function HomeNavItem({ mobile = false }: { mobile?: boolean }) {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            mobile ? "flex flex-col items-center py-2 h-auto" : "w-full justify-start text-left"
          )}
          asChild
        >
          <Link to="/">
            <Home className={cn(
              mobile ? "mb-1" : "mr-2",
              "h-4 w-4"
            )} />
            <span className={cn(
              mobile && "text-xs font-medium"
            )}>Accueil</span>
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent side={mobile ? "top" : "right"}>
        <div className="flex flex-col">
          <span className="font-medium">Site d'accueil</span>
          <span className="text-xs text-muted-foreground">Retourner à la page d'accueil</span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export function MainNavigation({ mobile = false }: { mobile?: boolean }) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [firstTimeUser, setFirstTimeUser] = useState(false);
  
  // Combiner tous les éléments de navigation
  const mainNavItems = [...navigationConfig.mainNav];
  const marketingNavItems = [...navigationConfig.marketingNav];
  const visibilityNavItems = [...navigationConfig.visibilityNav];
  const bottomNavItems = navigationConfig.bottomNav.filter(item => 
    // Ne pas afficher l'item "Aide" ici car il est géré séparément
    item.title !== "Aide"
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
          <HomeNavItem />
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

        {/* Marketing */}
        {!mobile && marketingNavItems.length > 0 && (
          <>
            <div className="mt-6 mb-2">
              <h4 className="px-2 text-xs font-semibold text-muted-foreground">
                MARKETING
              </h4>
            </div>
            {marketingNavItems.map((item) => (
              <div key={item.title} className="w-full">
                <NavItem
                  item={item}
                  mobile={mobile}
                  isFirstTimeUser={false}
                  handleNavigation={handleNavigation}
                />
              </div>
            ))}
          </>
        )}
        
        {/* Visibilité */}
        {!mobile && visibilityNavItems.length > 0 && (
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
                  isFirstTimeUser={false}
                  handleNavigation={handleNavigation}
                />
              </div>
            ))}
          </>
        )}

        {/* Navigation inférieure */}
        {!mobile && bottomNavItems.length > 0 && (
          <div className="mt-auto pt-4">
            <div className="flex flex-col space-y-1">
              {bottomNavItems.map((item) => (
                <NavItem 
                  key={item.title} 
                  item={item}
                  mobile={mobile}
                  isFirstTimeUser={false}
                  handleNavigation={handleNavigation}
                />
              ))}
              
              <Button 
                variant="ghost"
                className="w-full justify-start text-left text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => signOut()}
              >
                Déconnexion
              </Button>
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
