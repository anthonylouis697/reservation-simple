
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
import { NavItem } from '@/types/navigation';

export const navItems: NavItem[] = [
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
    name: "Offres",
    href: "/services",
    icon: Tag,
    description: "Gérez vos services et tarifs",
    subItems: [
      {
        name: "Offres & Catégories",
        href: "/services",
        icon: Tag,
        description: "Gérez vos services et leurs catégories"
      },
      {
        name: "Ressources",
        href: "/services?tab=resources",
        icon: Pencil,
        description: "Gérez les ressources nécessaires à vos offres"
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
    description: "Notifications, promotions et fidélité",
    subItems: [
      {
        name: "Codes promo",
        href: "/marketing?tab=promotions",
        icon: Tag,
        description: "Créez et gérez vos codes promotionnels"
      },
      {
        name: "SMS Marketing",
        href: "/marketing?tab=sms",
        icon: Bell,
        description: "Envoyez des SMS à vos clients"
      },
      {
        name: "Notifications",
        href: "/marketing?tab=notifications",
        icon: Bell,
        description: "Gérez les notifications automatiques"
      },
      {
        name: "Programme fidélité",
        href: "/marketing?tab=loyalty",
        icon: Star,
        description: "Configurez votre programme de fidélité"
      },
      {
        name: "Cartes cadeaux",
        href: "/marketing?tab=gift-cards",
        icon: Gift,
        description: "Créez et gérez des cartes cadeaux"
      }
    ]
  },
  {
    name: "Statistiques",
    href: "/statistics",
    icon: BarChart3,
    description: "Analysez votre activité et vos performances"
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
    name: "Paramètres",
    href: "/settings",
    icon: Settings,
    description: "Personnalisez votre compte et vos services"
  }
];
