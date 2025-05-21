
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
  Database,
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
  events: {
    title: "Événements",
    href: "/events",
    icon: <CalendarDays className="h-5 w-5" />,
    description: "Gestion des événements",
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
  profile: {
    title: "Profil",
    href: "/account/profile",
    icon: <Users className="h-5 w-5" />,
    description: "Gérez votre profil",
  },
  business: {
    title: "Entreprise",
    href: "/settings/business",
    icon: <Building2 className="h-5 w-5" />,
    description: "Gérez les informations de votre entreprise",
  },
  availability: {
    title: "Disponibilité",
    href: "/settings/availability",
    icon: <CalendarDays className="h-5 w-5" />,
    description: "Configurer vos horaires de disponibilité",
  },
  addons: {
    title: "Modules complémentaires",
    href: "/additional-services",
    icon: <PackageCheck className="h-5 w-5" />,
    description: "Fonctionnalités additionnelles",
  },
  help: {
    title: "Aide",
    href: "/help",
    icon: <PanelLeftClose className="h-5 w-5" />,
    description: "Centre d'aide",
  },
  welcome: {
    title: "Bienvenue",
    href: "/welcome",
    icon: <Building2 className="h-5 w-5" />,
    description: "Commencer avec Reservatoo",
    alwaysAccessible: true,
  }
} as const;

type NavigationConfig = {
  mainNav: NavItem[];
  marketingNav: NavItem[];
  visibilityNav: NavItem[];
  bottomNav: NavItem[];
  servicesSubNav: NavItem[];
  profileSubNav: NavItem[];
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
  servicesSubNav: [
    navigationItems.services,
    navigationItems.events,
  ],
  marketingNav: [
    navigationItems.marketing,
  ],
  visibilityNav: [
    navigationItems.bookingPage,
  ],
  profileSubNav: [
    navigationItems.profile,
    navigationItems.business,
    navigationItems.availability,
  ],
  bottomNav: [
    navigationItems.addons,
    navigationItems.help,
    navigationItems.profile,
    navigationItems.settings,
  ],
};
