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
  FileSpreadsheet
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from 'react';

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  description: string;
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
    description: "Notifications, emails et promotions"
  },
  {
    name: "Statistiques",
    href: "/statistics",
    icon: BarChart3,
    description: "Analysez votre activité et vos performances"
  },
  {
    name: "Visibilité",
    href: "/visibility-boost",
    icon: Star,
    description: "Augmentez votre visibilité sur les plateformes partenaires"
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

  // Check if user is new (this would normally use a more robust mechanism)
  useEffect(() => {
    // Example: check local storage or user data from API
    const isFirstTime = localStorage.getItem('firstTimeUser') === null;
    setFirstTimeUser(isFirstTime);
    if (isFirstTime) {
      localStorage.setItem('firstTimeUser', 'false');
    }
  }, []);

  return (
    <TooltipProvider>
      <div className={cn(
        "flex",
        mobile ? "flex-row justify-around w-full overflow-x-auto" : "flex-col space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]"
      )}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <Tooltip key={item.name} delayDuration={300}>
              <TooltipTrigger asChild>
                <Button 
                  variant={isActive ? "default" : "ghost"} 
                  className={cn(
                    mobile ? "flex flex-col items-center py-2 h-auto" : "w-full justify-start text-left",
                    isActive ? "bg-primary text-primary-foreground" : "",
                    item.href === "/visibility-boost" && firstTimeUser ? "animate-pulse ring-2 ring-primary" : ""
                  )}
                  onClick={() => navigate(item.href)}
                >
                  <item.icon className={cn(
                    "mr-2 h-4 w-4", 
                    mobile && "mr-0 h-5 w-5 mb-1"
                  )} />
                  <span className={cn(
                    mobile && "text-xs"
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
        })}

        {/* Help button */}
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              className={cn(
                mobile ? "flex flex-col items-center py-2 h-auto" : "w-full justify-start text-left mt-auto"
              )}
              onClick={() => navigate("/help")}
            >
              <HelpCircle className={cn(
                "mr-2 h-4 w-4", 
                mobile && "mr-0 h-5 w-5 mb-1"
              )} />
              <span className={cn(
                mobile && "text-xs"
              )}>Aide</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side={mobile ? "top" : "right"}>
            <div className="flex flex-col">
              <span className="font-medium">Centre d'aide</span>
              <span className="text-xs text-muted-foreground">Trouvez des réponses à vos questions</span>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
