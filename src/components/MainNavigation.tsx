
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from 'react';
import { navItems } from "@/config/navigation";
import { NavItem, SubNavItem } from "@/components/Navigation/NavItem";
import { HelpNavItem } from "@/components/Navigation/HelpNavItem";

export function MainNavigation({ mobile = false }: { mobile?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [firstTimeUser, setFirstTimeUser] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // Check if user is new
  useEffect(() => {
    // Example: check local storage or user data from API
    const isFirstTime = localStorage.getItem('firstTimeUser') === null;
    setFirstTimeUser(isFirstTime);
    if (isFirstTime) {
      localStorage.setItem('firstTimeUser', 'false');
    }
    
    // Set initially expanded items based on current location
    const newExpandedItems: Record<string, boolean> = {};
    navItems.forEach(item => {
      if (item.subItems && item.subItems.some(subItem => 
        location.pathname.startsWith(subItem.href) || 
        location.pathname === subItem.href)
      ) {
        newExpandedItems[item.href] = true;
      }
    });
    
    setExpandedItems(newExpandedItems);
  }, [location.pathname]);

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [href]: !prev[href]
    }));
  };

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

  // Helper function to check if a path is active or a child path is active
  const isPathActive = (path: string) => {
    if (location.pathname === path) return true;
    
    // Consider child paths as active for the parent navigation item
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    
    return false;
  };

  // Filter items that have sub-items and match the current path
  const activeParentItem = navItems.find(item => 
    item.subItems && 
    isPathActive(item.href.split('?')[0])
  );

  return (
    <TooltipProvider>
      <div className={cn(
        "flex",
        mobile ? "flex-row justify-around w-full overflow-x-auto pb-safe" : "flex-col space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]"
      )}>
        {navItems.map((item) => (
          <div key={item.name} className="w-full">
            <NavItem
              item={item}
              isExpanded={!!expandedItems[item.href]}
              mobile={mobile}
              isFirstTimeUser={firstTimeUser}
              toggleExpanded={toggleExpanded}
              handleNavigation={handleNavigation}
            />
          </div>
        ))}

        {/* Show sub-items of active parent in desktop navigation */}
        {!mobile && activeParentItem && activeParentItem.subItems && (
          <div className="pl-6 space-y-1 mt-1 border-l border-sidebar-border">
            {activeParentItem.subItems.map(subItem => (
              <SubNavItem
                key={subItem.name}
                subItem={subItem}
                mobile={mobile}
                isPathActive={isPathActive}
                handleNavigation={handleNavigation}
              />
            ))}
          </div>
        )}

        {/* Hide Help button on mobile since we have it in the header */}
        {!mobile && <HelpNavItem />}
      </div>
    </TooltipProvider>
  );
}
