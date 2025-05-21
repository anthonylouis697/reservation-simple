
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { NavItem } from '@/types/navigation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { NavItem as NavItemComponent } from '@/components/Navigation/NavItem';

interface SubMenuProps {
  title: string;
  items: NavItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  mobile?: boolean;
  handleNavigation?: (href: string) => void;
}

export function SubMenu({ 
  title, 
  items = [], 
  isOpen = false, 
  setIsOpen, 
  mobile = false,
  handleNavigation
}: SubMenuProps) {
  // S'assurer que items est toujours un tableau
  const safeItems = Array.isArray(items) ? items : [];
  
  if (mobile) {
    return (
      <>
        {safeItems.map((item) => (
          <div key={item.title} className="w-full pl-4">
            <NavItemComponent
              item={item}
              mobile={mobile}
              isFirstTimeUser={false}
              handleNavigation={handleNavigation}
            />
          </div>
        ))}
      </>
    );
  }
  
  // Si aucun item n'est disponible, ne pas rendre le menu
  if (safeItems.length === 0) return null;
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between text-left"
        >
          <div className="flex items-center">
            {safeItems[0]?.icon && <div className="mr-2">{safeItems[0].icon}</div>}
            <span>{title}</span>
          </div>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4 space-y-1">
        {safeItems.map((item) => (
          <NavItemComponent
            key={item.title}
            item={item}
            mobile={mobile}
            isFirstTimeUser={false}
            handleNavigation={handleNavigation}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
