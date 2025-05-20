
import {
  CalendarDays,
  LayoutDashboard,
  Settings,
  Users,
  CircleDollarSign,
  PanelLeftClose,
  CalendarClock,
  Megaphone,
  PieChart,
  ListChecks,
  GalleryHorizontalEnd,
  Globe,
  HandCoins,
  Database,
  GanttChart,
  PackageCheck,
  Rocket,
  Building2
} from "lucide-react";
import { ReactNode } from "react";
import { NavItem } from "@/types/navigation";

export const navigationItems = {
  dashboard: {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  calendar: {
    title: "Calendrier",
    href: "/calendar",
    icon: <CalendarDays className="h-5 w-5" />,
  },
  clients: {
    title: "Clients",
    href: "/clients",
    icon: <Users className="h-5 w-5" />,
  },
  reservations: {
    title: "Réservations",
    href: "/reservations",
    icon: <CalendarClock className="h-5 w-5" />,
  },
  services: {
    title: "Services",
    href: "/services",
    icon: <ListChecks className="h-5 w-5" />,
  },
  statistics: {
    title: "Statistiques",
    href: "/statistics",
    icon: <PieChart className="h-5 w-5" />,
  },
  payments: {
    title: "Paiements",
    href: "/payments",
    icon: <CircleDollarSign className="h-5 w-5" />,
  },
  settings: {
    title: "Paramètres",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
  marketing: {
    title: "Marketing",
    href: "/marketing",
    icon: <Megaphone className="h-5 w-5" />,
  },
  events: {
    title: "Événements",
    href: "/events",
    icon: <GanttChart className="h-5 w-5" />,
  },
  bookingPage: {
    title: "Page de réservation",
    href: "/booking-page",
    icon: <Globe className="h-5 w-5" />,
  },
  customization: {
    title: "Personnalisation",
    href: "/booking-customization",
    icon: <GalleryHorizontalEnd className="h-5 w-5" />,
  },
  visibilityBoost: {
    title: "Boost de visibilité",
    href: "/visibility-boost",
    icon: <Rocket className="h-5 w-5" />,
  },
  addons: {
    title: "Modules complémentaires",
    href: "/additional-services",
    icon: <PackageCheck className="h-5 w-5" />,
  },
  giftCards: {
    title: "Cartes cadeaux",
    href: "/gift-cards",
    icon: <HandCoins className="h-5 w-5" />,
  },
  businessSelector: {
    title: "Sélecteur d'entreprise",
    href: "#",
    icon: <Building2 className="h-5 w-5" />,
    isAction: true,
  },
  welcome: {
    title: "Bienvenue",
    href: "/welcome",
    icon: <Building2 className="h-5 w-5" />,
    alwaysAccessible: true,
  }
} as const;

type NavigationConfig = {
  mainNav: NavItem[];
  marketingNav: NavItem[];
  visibilityNav: NavItem[];
  bottomNav: NavItem[];
};

export const navigationConfig: NavigationConfig = {
  mainNav: [
    navigationItems.welcome,
    navigationItems.dashboard,
    navigationItems.calendar,
    navigationItems.clients,
    navigationItems.services,
    navigationItems.reservations,
    navigationItems.statistics,
    navigationItems.payments,
  ],
  marketingNav: [
    navigationItems.marketing,
    navigationItems.events,
    navigationItems.giftCards,
  ],
  visibilityNav: [
    navigationItems.bookingPage,
    navigationItems.customization,
    navigationItems.visibilityBoost,
  ],
  bottomNav: [
    navigationItems.addons,
    navigationItems.settings,
  ],
};
