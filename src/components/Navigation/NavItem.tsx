
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { NavItem as NavItemType } from '@/types/navigation';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItemProps {
  item: NavItemType;
  isExpanded: boolean;
  mobile: boolean;
  isFirstTimeUser: boolean;
  toggleExpanded: (href: string) => void;
  handleNavigation: (href: string, hasSubItems?: boolean) => void;
}

export function NavItem({
  item,
  isExpanded,
  mobile,
  isFirstTimeUser,
  toggleExpanded,
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
  
  // Pour les éléments avec des sous-menus, on détermine l'URL à utiliser
  const navigationUrl = hasSubItems ? 
    (item.subItems && item.subItems.length > 0 ? item.subItems[0].href : item.href) : 
    item.href;

  return (
    <Tooltip key={item.name} delayDuration={300}>
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
          onClick={() => handleNavigation(navigationUrl)}
        >
          <item.icon className={cn(
            "mr-2 h-4 w-4", 
            mobile && "mr-0 h-5 w-5 mb-1"
          )} />
          <span className={cn(
            mobile && "text-xs font-medium"
          )}>{item.name}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side={mobile ? "top" : "right"}>
        <div className="flex flex-col">
          <span className="font-medium">{item.name}</span>
          <span className="text-xs text-muted-foreground">{item.description}</span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

interface SubNavItemProps {
  subItem: NavItemType;
  mobile: boolean;
  isPathActive: (path: string) => boolean;
  handleNavigation: (href: string, hasSubItems?: boolean) => void;
}

export function SubNavItem({ subItem, mobile, isPathActive, handleNavigation }: SubNavItemProps) {
  const isSubActive = isPathActive(subItem.href);
  
  return (
    <Tooltip key={subItem.name} delayDuration={300}>
      <TooltipTrigger asChild>
        <Button 
          id={subItem.href}
          variant={isSubActive ? "default" : "ghost"} 
          className={cn(
            mobile ? "flex items-center py-1.5 h-auto w-full text-sm" : "w-full justify-start text-left",
            isSubActive ? "bg-primary/80 text-primary-foreground" : "",
            "rounded-md"
          )}
          onClick={() => handleNavigation(subItem.href)}
        >
          <subItem.icon className="mr-2 h-4 w-4" />
          <span>{subItem.name}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side={mobile ? "top" : "right"}>
        <div className="flex flex-col">
          <span className="font-medium">{subItem.name}</span>
          <span className="text-xs text-muted-foreground">{subItem.description}</span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
