
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
  items, 
  isOpen, 
  setIsOpen, 
  mobile = false,
  handleNavigation
}: SubMenuProps) {
  if (mobile) {
    return (
      <>
        {items.map((item) => (
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
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between text-left"
        >
          <div className="flex items-center">
            {items[0].icon && <div className="mr-2">{items[0].icon}</div>}
            <span>{title}</span>
          </div>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4 space-y-1">
        {items.map((item) => (
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
