
import { NavItem } from '@/types/navigation';
import { NavItem as NavItemComponent } from '@/components/Navigation/NavItem';

interface NavigationCategoryProps {
  title: string;
  items: NavItem[];
  mobile?: boolean;
  isFirstTimeUser?: boolean;
  handleNavigation?: (href: string) => void;
}

export function NavigationCategory({
  title,
  items,
  mobile = false,
  isFirstTimeUser = false,
  handleNavigation
}: NavigationCategoryProps) {
  if (items.length === 0) return null;
  
  return (
    <>
      <div className="mt-6 mb-2">
        <h4 className="px-2 text-xs font-semibold text-muted-foreground">
          {title}
        </h4>
      </div>
      {items.map((item) => (
        <div key={item.title} className="w-full">
          <NavItemComponent
            item={item}
            mobile={mobile}
            isFirstTimeUser={isFirstTimeUser}
            handleNavigation={handleNavigation}
          />
        </div>
      ))}
    </>
  );
}
