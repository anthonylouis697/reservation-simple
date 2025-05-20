
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { navigationConfig } from "@/config/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BusinessSelector } from "./BusinessSelector";
import { useBusiness } from "@/contexts/BusinessContext";
import { NavItem, HelpNavItem } from "./MainNavigation";

export function DesktopSidebar() {
  const { pathname } = useLocation();
  const { currentBusiness } = useBusiness();
  const showBusinessSelector = pathname !== "/welcome" && !pathname.includes("/account");

  // Function to handle navigation
  const handleNavigation = (href: string) => {
    window.location.href = href;
  };

  return (
    <div className="hidden border-r bg-background lg:block lg:w-64">
      <div className="flex flex-col h-full">
        <div className="flex h-14 items-center border-b px-4">
          <Link
            to="/"
            className="flex items-center space-x-2 font-semibold"
          >
            <span className="text-xl font-bold">Reservatoo</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-4 px-4">
          {showBusinessSelector && (
            <div className="mb-4">
              <BusinessSelector />
            </div>
          )}
          
          <div className="flex flex-col space-y-1">
            {/* Navigation Items from config */}
            {navigationConfig.mainNav.map((item, index) => (
              <NavItem 
                key={index} 
                item={item}
                mobile={false}
                isFirstTimeUser={false}
                handleNavigation={handleNavigation}
              />
            ))}
          </div>

          {navigationConfig.marketingNav.length > 0 && (
            <>
              <div className="mt-6 mb-2">
                <h4 className="px-2 text-xs font-semibold text-muted-foreground">
                  MARKETING
                </h4>
              </div>
              <div className="flex flex-col space-y-1">
                {navigationConfig.marketingNav.map((item, index) => (
                  <NavItem 
                    key={index} 
                    item={item}
                    mobile={false}
                    isFirstTimeUser={false}
                    handleNavigation={handleNavigation}
                  />
                ))}
              </div>
            </>
          )}

          {navigationConfig.visibilityNav.length > 0 && (
            <>
              <div className="mt-6 mb-2">
                <h4 className="px-2 text-xs font-semibold text-muted-foreground">
                  VISIBILITÉ
                </h4>
              </div>
              <div className="flex flex-col space-y-1">
                {navigationConfig.visibilityNav.map((item, index) => (
                  <NavItem 
                    key={index} 
                    item={item}
                    mobile={false}
                    isFirstTimeUser={false}
                    handleNavigation={handleNavigation}
                  />
                ))}
              </div>
            </>
          )}

          {navigationConfig.bottomNav.length > 0 && (
            <div className="mt-auto pt-4">
              <div className="flex flex-col space-y-1">
                {navigationConfig.bottomNav.map((item, index) => (
                  <NavItem 
                    key={index} 
                    item={item}
                    mobile={false}
                    isFirstTimeUser={false}
                    handleNavigation={handleNavigation}
                  />
                ))}
                <HelpNavItem />
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

export default DesktopSidebar;
