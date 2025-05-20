
import { Link } from 'react-router-dom';
import {
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

// Features submenu items
export const featuresItems = [
  {
    title: "Calendrier intelligent",
    description: "Interface intuitive avec synchronisation multi-plateforme",
    href: "/#features",
    icon: "⏰"
  },
  {
    title: "Réservations 24/7",
    description: "Disponibilité permanente pour vos clients",
    href: "/#features",
    icon: "🔄"
  },
  {
    title: "Gestion des clients",
    description: "Base de données complète pour suivre vos relations",
    href: "/#features",
    icon: "👥"
  },
  {
    title: "Paiements en ligne",
    description: "Intégration simple avec les plateformes de paiement",
    href: "/#features",
    icon: "💳"
  }
];

// Industries submenu items
export const industriesItems = [
  {
    title: "Beauté & Bien-être",
    description: "Pour salons, spas et thérapeutes",
    href: "/#industries",
    icon: "✨"
  },
  {
    title: "Santé",
    description: "Pour cliniques, médecins et professionnels de santé",
    href: "/#industries",
    icon: "🏥"
  },
  {
    title: "Services professionnels",
    description: "Pour consultants, coachs et experts",
    href: "/#industries",
    icon: "💼"
  },
  {
    title: "Éducation & Formation",
    description: "Pour formateurs, écoles et centres de formation",
    href: "/#industries",
    icon: "🎓"
  }
];

export interface MenuItemProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  onClick?: () => void;
}

export const MenuItem = ({ item, onClick }: { item: MenuItemProps, onClick?: () => void }) => {
  return (
    <li key={item.title}>
      <NavigationMenuLink asChild>
        <Link
          to={item.href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-indigo-50 hover:text-indigo-600"
          onClick={onClick}
        >
          <div className="text-xl mb-1">{item.icon}</div>
          <div className="text-sm font-medium leading-none">{item.title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

export default { featuresItems, industriesItems, MenuItem };
