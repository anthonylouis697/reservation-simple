
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
    description: "Aperçu des activités de votre entreprise",
  },
  calendar: {
    title: "Calendrier",
    href: "/calendar",
    icon: <CalendarDays className="h-5 w-5" />,
    description: "Gérez votre planning",
  },
  clients: {
    title: "Clients",
    href: "/clients",
    icon: <Users className="h-5 w-5" />,
    description: "Gestion de votre clientèle",
  },
  reservations: {
    title: "Réservations",
    href: "/reservations",
    icon: <CalendarClock className="h-5 w-5" />,
    description: "Consultez vos réservations",
  },
  services: {
    title: "Services",
    href: "/services",
    icon: <ListChecks className="h-5 w-5" />,
    description: "Gérez vos prestations",
  },
  statistics: {
    title: "Statistiques",
    href: "/statistics",
    icon: <PieChart className="h-5 w-5" />,
    description: "Analysez votre activité",
  },
  payments: {
    title: "Paiements",
    href: "/payments",
    icon: <CircleDollarSign className="h-5 w-5" />,
    description: "Suivi des transactions",
  },
  settings: {
    title: "Paramètres",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
    description: "Configuration de votre compte",
  },
  marketing: {
    title: "Marketing",
    href: "/marketing",
    icon: <Megaphone className="h-5 w-5" />,
    description: "Outils de promotion",
  },
  events: {
    title: "Événements",
    href: "/events",
    icon: <GanttChart className="h-5 w-5" />,
    description: "Gestion des événements",
  },
  bookingPage: {
    title: "Page de réservation",
    href: "/booking-page",
    icon: <Globe className="h-5 w-5" />,
    description: "Configuration de votre page de réservation",
  },
  customization: {
    title: "Personnalisation",
    href: "/booking-customization",
    icon: <GalleryHorizontalEnd className="h-5 w-5" />,
    description: "Personnalisez votre page de réservation",
  },
  visibilityBoost: {
    title: "Boost de visibilité",
    href: "/visibility-boost",
    icon: <Rocket className="h-5 w-5" />,
    description: "Améliorez votre visibilité en ligne",
  },
  addons: {
    title: "Modules complémentaires",
    href: "/additional-services",
    icon: <PackageCheck className="h-5 w-5" />,
    description: "Fonctionnalités additionnelles",
  },
  giftCards: {
    title: "Cartes cadeaux",
    href: "/gift-cards",
    icon: <HandCoins className="h-5 w-5" />,
    description: "Gestion des cartes cadeaux",
  },
  businessSelector: {
    title: "Sélecteur d'entreprise",
    href: "#",
    icon: <Building2 className="h-5 w-5" />,
    description: "Changer d'entreprise",
    isAction: true,
  },
  welcome: {
    title: "Bienvenue",
    href: "/welcome",
    icon: <Building2 className="h-5 w-5" />,
    description: "Commencer avec Reservatoo",
    alwaysAccessible: true,
  }
} as const;

// Exporter navItems pour MainNavigation.tsx
export const navItems = [
  navigationItems.dashboard,
  navigationItems.calendar,
  navigationItems.clients,
  navigationItems.services,
  navigationItems.reservations,
  navigationItems.statistics,
  navigationItems.payments,
  navigationItems.marketing,
  navigationItems.settings,
];

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
