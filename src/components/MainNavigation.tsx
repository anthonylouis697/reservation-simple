
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Calendar, 
  Settings, 
  Users, 
  Star,
  HelpCircle,
  ScrollText,
  BarChart3,
  Tag,
  CreditCard,
  Bell,
  Gift,
  Globe,
  Link,
  Share,
  DollarSign,
  Pencil,
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from 'react';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  description: string;
  subItems?: NavItem[];
}

const navItems: NavItem[] = [
  {
    name: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Aperçu de votre activité et rendez-vous à venir"
  },
  {
    name: "Calendrier",
    href: "/calendar",
    icon: Calendar,
    description: "Gérez vos disponibilités et rendez-vous"
  },
  {
    name: "Clients",
    href: "/clients",
    icon: Users,
    description: "Base de données de vos clients et prospects"
  },
  {
    name: "Services",
    href: "/services",
    icon: Tag,
    description: "Gérez vos services et tarifs"
  },
  {
    name: "Visibilité",
    href: "/visibility",
    icon: Star,
    description: "Augmentez votre présence en ligne et vos revenus",
    subItems: [
      {
        name: "Page de réservation",
        href: "/visibility/booking-page",
        icon: Link,
        description: "Gérez votre page de réservation et partagez-la"
      },
      {
        name: "Intégrations sociales",
        href: "/visibility/social-integration",
        icon: Share,
        description: "Intégrez votre agenda sur les réseaux sociaux"
      },
      {
        name: "Boost de visibilité",
        href: "/visibility-boost",
        icon: Star,
        description: "Augmentez votre visibilité sur les plateformes partenaires"
      },
      {
        name: "Services additionnels",
        href: "/visibility/additional-services",
        icon: DollarSign,
        description: "Boostez vos revenus avec des services supplémentaires"
      }
    ]
  },
  {
    name: "Événements",
    href: "/events",
    icon: ScrollText,
    description: "Créez et gérez vos événements et ateliers"
  },
  {
    name: "Paiements",
    href: "/payments",
    icon: CreditCard,
    description: "Suivez vos revenus et configurez les paiements"
  },
  {
    name: "Marketing",
    href: "/marketing",
    icon: Bell,
    description: "Notifications, promotions et fidélité"
  },
  {
    name: "Statistiques",
    href: "/statistics",
    icon: BarChart3,
    description: "Analysez votre activité et vos performances"
  },
  {
    name: "Cartes cadeaux",
    href: "/gift-cards",
    icon: Gift,
    description: "Créez et gérez des cartes cadeaux"
  },
  {
    name: "Paramètres",
    href: "/settings",
    icon: Settings,
    description: "Personnalisez votre compte et vos services"
  }
];

export function MainNavigation({ mobile = false }: { mobile?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [firstTimeUser, setFirstTimeUser] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // Check if user is new (this would normally use a more robust mechanism)
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

  // Helper function to check if a path is active or a child path is active
  const isPathActive = (path: string) => {
    if (location.pathname === path) return true;
    
    // Consider child paths as active for the parent navigation item
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    
    return false;
  };

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [href]: !prev[href]
    }));
  };

  const handleNavigation = (href: string, hasSubItems = false) => {
    // Si c'est un élément avec des sous-menus, on le déploie/replie
    if (hasSubItems) {
      toggleExpanded(href);
      return;
    }
    
    // Une petite animation pour améliorer l'expérience utilisateur
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

  const renderNavItem = (item: NavItem) => {
    const isActive = isPathActive(item.href);
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = !!expandedItems[item.href];
    
    return (
      <div key={item.name} className="w-full">
        {hasSubItems ? (
          <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(item.href)}>
            <CollapsibleTrigger asChild>
              <Button 
                id={item.href}
                variant={isActive ? "default" : "ghost"} 
                className={cn(
                  "w-full justify-between text-left",
                  mobile ? "flex items-center py-2 h-auto" : "w-full justify-between text-left",
                  isActive ? "bg-primary text-primary-foreground" : "",
                  mobile && "rounded-md px-2",
                  item.href === "/visibility-boost" && firstTimeUser ? "animate-pulse ring-2 ring-primary" : ""
                )}
              >
                <div className="flex items-center">
                  <item.icon className={cn("mr-2 h-4 w-4", mobile && "h-5 w-5")} />
                  <span className={cn(mobile && "text-sm font-medium")}>{item.name}</span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={cn("h-4 w-4 transition-transform", isExpanded ? "transform rotate-180" : "")}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6 space-y-1 mt-1">
              {item.subItems?.map((subItem) => {
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
              })}
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <Tooltip key={item.name} delayDuration={300}>
            <TooltipTrigger asChild>
              <Button 
                id={item.href}
                variant={isActive ? "default" : "ghost"} 
                className={cn(
                  mobile ? "flex flex-col items-center py-2 h-auto" : "w-full justify-start text-left",
                  isActive ? "bg-primary text-primary-foreground" : "",
                  mobile && "rounded-md px-2",
                  item.href === "/visibility-boost" && firstTimeUser ? "animate-pulse ring-2 ring-primary" : ""
                )}
                onClick={() => handleNavigation(item.href)}
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
        )}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className={cn(
        "flex",
        mobile ? "flex-row justify-around w-full overflow-x-auto pb-safe" : "flex-col space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]"
      )}>
        {navItems.map((item) => renderNavItem(item))}

        {/* Hide Help button on mobile since we have it in the header */}
        {!mobile && (
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
        )}
      </div>
    </TooltipProvider>
  );
}
