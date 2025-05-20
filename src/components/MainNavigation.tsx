
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from 'react';
import { navItems } from "@/config/navigation";
import { NavItem } from "@/types/navigation";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

interface NavItemProps {
  item: NavItem;
  mobile?: boolean;
  isFirstTimeUser?: boolean;
  handleNavigation?: (href: string) => void;
}

export function NavItem({
  item,
  mobile = false,
  isFirstTimeUser = false,
  handleNavigation
}: NavItemProps) {
  const location = useLocation();
  
  // Helper function to check if a path is active or a child path is active
  const isPathActive = (path: string) => {
    if (location.pathname === path) return true;
    
    // Consider child paths as active for the parent navigation item
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    
    return false;
  };

  const isActive = isPathActive(item.href);
  const hasSubItems = item.subItems && item.subItems.length > 0;
  
  // For items with sub-menus, determine the URL to use (first sub-item or main item if no subItems)
  const navigationUrl = hasSubItems ? 
    (item.subItems && item.subItems.length > 0 ? item.subItems[0].href : item.href) : 
    item.href;

  const onClick = () => {
    if (handleNavigation) {
      handleNavigation(navigationUrl);
    }
  };

  return (
    <Tooltip key={item.title} delayDuration={300}>
      <TooltipTrigger asChild>
        <Button 
          id={item.href}
          variant={isActive ? "default" : "ghost"} 
          className={cn(
            mobile ? "flex flex-col items-center py-2 h-auto" : "w-full justify-start text-left",
            isActive ? "bg-primary text-primary-foreground" : "",
            mobile && "rounded-md px-2",
            item.href === "/visibility-boost" && isFirstTimeUser ? "animate-pulse ring-2 ring-primary" : ""
          )}
          onClick={onClick}
        >
          {item.icon}
          <span className={cn(
            mobile && "text-xs font-medium"
          )}>{item.title}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side={mobile ? "top" : "right"}>
        <div className="flex flex-col">
          <span className="font-medium">{item.title}</span>
          <span className="text-xs text-muted-foreground">{item.description || item.title}</span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

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

export function MainNavigation({ mobile = false }: { mobile?: boolean }) {
  const navigate = useNavigate();
  const [firstTimeUser, setFirstTimeUser] = useState(false);

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
        {navItems.map((item) => (
          <div key={item.title} className="w-full">
            <NavItem
              item={item}
              mobile={mobile}
              isFirstTimeUser={firstTimeUser}
              handleNavigation={handleNavigation}
            />
          </div>
        ))}

        {/* Hide Help button on mobile since we have it in the header */}
        {!mobile && <HelpNavItem />}
      </div>
    </TooltipProvider>
  );
}
