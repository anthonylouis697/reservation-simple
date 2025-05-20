
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { featuresItems, industriesItems, MenuItem } from './NavMenuItems';

const DesktopNavigation = ({ onMenuItemClick }: { onMenuItemClick?: () => void }) => {
  return (
    <div className="hidden lg:ml-10 lg:flex lg:items-center lg:space-x-2">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent">Fonctionnalités</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[500px] gap-3 p-4 md:grid-cols-2">
                {featuresItems.map((item) => (
                  <MenuItem 
                    key={item.title} 
                    item={item} 
                    onClick={onMenuItemClick}
                  />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent">Industries</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[500px] gap-3 p-4 md:grid-cols-2">
                {industriesItems.map((item) => (
                  <MenuItem 
                    key={item.title} 
                    item={item} 
                    onClick={onMenuItemClick}
                  />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/#pricing" className={navigationMenuTriggerStyle()}>
              Tarifs
            </Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/#testimonials" className={navigationMenuTriggerStyle()}>
              Témoignages
            </Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/#contact" className={navigationMenuTriggerStyle()}>
              Contact
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default DesktopNavigation;
