import { useState } from 'react';
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import { Helmet } from "react-helmet";
import { ArrowLeft, Heart, CalendarDays, Ticket, CreditCard, Users, Crown, Star, Zap, CheckCircle, Info, MessageCircle, Bell, MapPin, Camera, FileText, BarChart3, Gift, ShoppingCart, Calendar, Clock, Phone, Mail, Palette, Globe, Shield, Archive, Headphones, Smartphone, QrCode, Webhook, Bot, TrendingUp, UserCheck, Wifi, Package, DollarSign, Percent, Filter, SortAsc, SortDesc, Grid2X2, List, Search, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

// Types pour les modules
interface AdditionalModule {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: React.ReactNode;
  category: 'customer' | 'events' | 'payments' | 'analytics' | 'communication' | 'automation' | 'marketing' | 'integrations';
  status: 'available' | 'coming_soon' | 'premium' | 'free';
  isActive: boolean;
  features: string[];
  benefits: string[];
  price?: string;
  originalPrice?: string;
  popular?: boolean;
}

// Données des modules enrichies
const modules: AdditionalModule[] = [
  // CUSTOMER MANAGEMENT
  {
    id: 'loyalty',
    name: 'Programme de fidélité',
    description: 'Fidélisez vos clients avec un système de points et récompenses',
    longDescription: 'Créez un programme de fidélité personnalisé pour récompenser vos clients réguliers. Gagnez en rétention client et augmentez votre chiffre d\'affaires.',
    icon: <Heart className="h-6 w-6" />,
    category: 'customer',
    status: 'available',
    isActive: false,
    features: [
      'Système de points automatique',
      'Récompenses personnalisables', 
      'Niveaux de fidélité',
      'Notifications automatiques',
      'Statistiques détaillées'
    ],
    benefits: [
      'Augmentation de la rétention client de 25%',
      'Hausse du panier moyen de 15%',
      'Fidélisation accrue',
      'Bouche-à-oreille positif'
    ],
    price: '19€/mois'
  },
  {
    id: 'subscriptions',
    name: 'Abonnements Client',
    description: 'Proposez des abonnements et forfaits à vos clients',
    longDescription: 'Créez des abonnements personnalisés avec facturation récurrente et gestion automatique des renouvellements.',
    icon: <Users className="h-6 w-6" />,
    category: 'customer',
    status: 'available',
    isActive: false,
    features: [
      'Abonnements flexibles',
      'Facturation automatique',
      'Gestion des renouvellements',
      'Offres promotionnelles',
      'Tableau de bord dédié'
    ],
    benefits: [
      'Revenus prévisibles',
      'Fidélisation renforcée',
      'Gestion simplifiée',
      'Croissance durable'
    ],
    price: '12,99€/mois'
  },
  {
    id: 'crm',
    name: 'CRM Avancé',
    description: 'Gestion complète de la relation client avec historique détaillé',
    longDescription: 'Un CRM complet pour suivre vos clients, leurs préférences, historique et optimiser votre relation commerciale.',
    icon: <UserCheck className="h-6 w-6" />,
    category: 'customer',
    status: 'free',
    isActive: false,
    features: [
      'Fiches clients complètes',
      'Historique des interactions',
      'Notes et commentaires',
      'Segmentation clients',
      'Suivi des préférences'
    ],
    benefits: [
      'Relation client personnalisée',
      'Meilleure connaissance client',
      'Service plus efficace',
      'Fidélisation améliorée'
    ],
    price: 'Gratuit'
  },

  // EVENTS & BOOKINGS
  {
    id: 'events',
    name: 'Événements & Ateliers',
    description: 'Organisez et gérez des événements collectifs et ateliers',
    longDescription: 'Module complet pour créer, promouvoir et gérer vos événements. Parfait pour les ateliers, formations et événements spéciaux.',
    icon: <CalendarDays className="h-6 w-6" />,
    category: 'events',
    status: 'available',
    isActive: false,
    features: [
      'Création d\'événements illimitée',
      'Gestion des inscriptions',
      'Calendrier dédié',
      'Notifications participants',
      'Gestion des capacités'
    ],
    benefits: [
      'Diversification de l\'offre',
      'Nouveaux revenus',
      'Community building',
      'Visibilité accrue'
    ],
    price: '15€/mois'
  },
  {
    id: 'ticketing',
    name: 'Billeterie',
    description: 'Vendez des billets pour vos événements et spectacles',
    longDescription: 'Solution complète de billetterie en ligne avec gestion des places, types de billets et contrôle d\'accès.',
    icon: <Ticket className="h-6 w-6" />,
    category: 'events',
    status: 'coming_soon',
    isActive: false,
    features: [
      'Vente de billets en ligne',
      'QR codes sécurisés',
      'Types de billets multiples',
      'Contrôle d\'accès',
      'Rapports de ventes'
    ],
    benefits: [
      'Automatisation des ventes',
      'Réduction des no-shows',
      'Gestion simplifiée',
      'Expérience client améliorée'
    ],
    price: 'Bientôt disponible'
  },
  {
    id: 'group-bookings',
    name: 'Réservations de Groupe',
    description: 'Gérez facilement les réservations pour plusieurs personnes',
    longDescription: 'Optimisez la gestion des réservations collectives avec des outils dédiés aux groupes.',
    icon: <Users className="h-6 w-6" />,
    category: 'events',
    status: 'free',
    isActive: false,
    features: [
      'Réservations multi-personnes',
      'Tarifs de groupe',
      'Gestion des accompagnants',
      'Communications groupées'
    ],
    benefits: [
      'Optimisation du planning',
      'Revenus plus élevés',
      'Gestion simplifiée',
      'Satisfaction client'
    ],
    price: 'Gratuit'
  },

  // PAYMENTS & TRANSACTIONS
  {
    id: 'pos',
    name: 'Logiciel de Caisse',
    description: 'Système de caisse intégré pour vos ventes sur place',
    longDescription: 'Caisse enregistreuse moderne avec synchronisation automatique, gestion des stocks et rapports de ventes.',
    icon: <CreditCard className="h-6 w-6" />,
    category: 'payments',
    status: 'premium',
    isActive: false,
    features: [
      'Interface tactile intuitive',
      'Gestion des stocks',
      'Paiements multiples',
      'Tickets de caisse',
      'Synchronisation temps réel'
    ],
    benefits: [
      'Ventes sur place facilitées',
      'Suivi des stocks précis',
      'Rapports unifiés',
      'Gain de temps'
    ],
    price: '49€/mois'
  },
  {
    id: 'payment-plans',
    name: 'Paiements Échelonnés',
    description: 'Proposez des facilités de paiement à vos clients',
    longDescription: 'Permettez à vos clients de payer en plusieurs fois pour des services coûteux.',
    icon: <DollarSign className="h-6 w-6" />,
    category: 'payments',
    status: 'available',
    isActive: false,
    features: [
      'Paiement en 2, 3 ou 4 fois',
      'Gestion automatique',
      'Relances automatiques',
      'Tableau de bord dédié'
    ],
    benefits: [
      'Augmentation des ventes',
      'Accessibilité améliorée',
      'Fidélisation client',
      'Moins d\'abandons'
    ],
    price: '9€/mois'
  },
  {
    id: 'invoicing',
    name: 'Facturation Avancée',
    description: 'Créez et gérez vos factures professionnelles',
    longDescription: 'Système de facturation complet avec devis, factures personnalisées et suivi des paiements.',
    icon: <FileText className="h-6 w-6" />,
    category: 'payments',
    status: 'free',
    isActive: false,
    features: [
      'Création de devis',
      'Factures personnalisées',
      'Suivi des paiements',
      'Rappels automatiques'
    ],
    benefits: [
      'Gestion comptable simplifiée',
      'Image professionnelle',
      'Suivi financier',
      'Conformité légale'
    ],
    price: 'Gratuit'
  },

  // COMMUNICATION
  {
    id: 'sms-notifications',
    name: 'Notifications SMS',
    description: 'Envoyez des SMS automatiques à vos clients',
    longDescription: 'Système de notifications SMS pour les confirmations, rappels et communications importantes.',
    icon: <MessageCircle className="h-6 w-6" />,
    category: 'communication',
    status: 'available',
    isActive: false,
    features: [
      'SMS automatiques',
      'Personnalisation des messages',
      'Envoi programmé',
      'Statistiques de livraison'
    ],
    benefits: [
      'Réduction des no-shows',
      'Communication directe',
      'Taux d\'ouverture élevé',
      'Satisfaction client'
    ],
    price: '0,10€/SMS'
  },
  {
    id: 'email-campaigns',
    name: 'Campagnes Email',
    description: 'Créez et envoyez des campagnes email personnalisées',
    longDescription: 'Outil de marketing par email avec templates, segmentation et analytics.',
    icon: <Mail className="h-6 w-6" />,
    category: 'communication',
    status: 'free',
    isActive: false,
    features: [
      'Templates personnalisables',
      'Segmentation clients',
      'Programmation d\'envoi',
      'Analytics détaillés'
    ],
    benefits: [
      'Communication ciblée',
      'Fidélisation client',
      'Promotion des services',
      'ROI mesurable'
    ],
    price: 'Gratuit'
  },
  {
    id: 'live-chat',
    name: 'Chat en Direct',
    description: 'Support client en temps réel sur votre site',
    longDescription: 'Widget de chat intégré pour répondre aux questions de vos clients en temps réel.',
    icon: <MessageCircle className="h-6 w-6" />,
    category: 'communication',
    status: 'available',
    isActive: false,
    features: [
      'Chat en temps réel',
      'Réponses automatiques',
      'Historique des conversations',
      'Notifications mobiles'
    ],
    benefits: [
      'Support instantané',
      'Augmentation des conversions',
      'Satisfaction client',
      'Réduction des emails'
    ],
    price: '15€/mois'
  },

  // MARKETING
  {
    id: 'gift-cards',
    name: 'Cartes Cadeaux',
    description: 'Vendez des cartes cadeaux digitales et physiques',
    longDescription: 'Système complet de cartes cadeaux avec personnalisation et suivi des utilisations.',
    icon: <Gift className="h-6 w-6" />,
    category: 'marketing',
    status: 'available',
    isActive: false,
    features: [
      'Cartes digitales et physiques',
      'Personnalisation complète',
      'Codes uniques sécurisés',
      'Suivi des utilisations'
    ],
    benefits: [
      'Nouveaux revenus',
      'Acquisition client',
      'Fidélisation',
      'Marketing viral'
    ],
    price: '12€/mois'
  },
  {
    id: 'referral-program',
    name: 'Programme de Parrainage',
    description: 'Récompensez vos clients qui vous recommandent',
    longDescription: 'Système de parrainage automatisé pour transformer vos clients en ambassadeurs.',
    icon: <Users className="h-6 w-6" />,
    category: 'marketing',
    status: 'available',
    isActive: false,
    features: [
      'Codes de parrainage uniques',
      'Récompenses automatiques',
      'Suivi des parrainages',
      'Tableau de bord dédié'
    ],
    benefits: [
      'Acquisition client gratuite',
      'Croissance virale',
      'Fidélisation renforcée',
      'ROI élevé'
    ],
    price: '18€/mois'
  },
  {
    id: 'promotional-codes',
    name: 'Codes Promotionnels',
    description: 'Créez et gérez vos codes de réduction',
    longDescription: 'Système complet de codes promo avec conditions personnalisables et analytics.',
    icon: <Percent className="h-6 w-6" />,
    category: 'marketing',
    status: 'free',
    isActive: false,
    features: [
      'Codes personnalisables',
      'Conditions flexibles',
      'Usage limité',
      'Suivi d\'utilisation'
    ],
    benefits: [
      'Augmentation des ventes',
      'Acquisition client',
      'Fidélisation',
      'Marketing ciblé'
    ],
    price: 'Gratuit'
  },

  // AUTOMATION
  {
    id: 'ai-chatbot',
    name: 'Chatbot IA',
    description: 'Assistant virtuel pour répondre aux questions courantes',
    longDescription: 'Chatbot intelligent qui répond automatiquement aux questions fréquentes de vos clients.',
    icon: <Bot className="h-6 w-6" />,
    category: 'automation',
    status: 'premium',
    isActive: false,
    features: [
      'IA conversationnelle',
      'Formation personnalisée',
      'Intégration seamless',
      'Analytics détaillés'
    ],
    benefits: [
      'Support 24/7',
      'Réduction de la charge',
      'Réponses instantanées',
      'Satisfaction client'
    ],
    price: '35€/mois'
  },
  {
    id: 'auto-follow-up',
    name: 'Relances Automatiques',
    description: 'Automatisez le suivi de vos clients et prospects',
    longDescription: 'Système de relances automatiques pour optimiser votre relation client.',
    icon: <Clock className="h-6 w-6" />,
    category: 'automation',
    status: 'free',
    isActive: false,
    features: [
      'Séquences personnalisées',
      'Déclencheurs intelligents',
      'Multi-canaux',
      'Suivi des performances'
    ],
    benefits: [
      'Gain de temps',
      'Meilleure conversion',
      'Suivi systématique',
      'ROI optimisé'
    ],
    price: 'Gratuit'
  },

  // ANALYTICS
  {
    id: 'analytics',
    name: 'Analytics Avancés',
    description: 'Analyses approfondies de votre activité et performance',
    longDescription: 'Tableaux de bord avancés avec métriques détaillées, prédictions et recommandations personnalisées.',
    icon: <Zap className="h-6 w-6" />,
    category: 'analytics',
    status: 'premium',
    isActive: false,
    features: [
      'Métriques avancées',
      'Prédictions IA',
      'Rapports personnalisés',
      'Benchmarking',
      'Recommandations'
    ],
    benefits: [
      'Décisions éclairées',
      'Optimisation continue',
      'Croissance accélérée',
      'Avantage concurrentiel'
    ],
    price: 'Gratuit (Premium)'
  },
  {
    id: 'competitor-analysis',
    name: 'Analyse Concurrentielle',
    description: 'Surveillez et analysez vos concurrents',
    longDescription: 'Outils d\'analyse concurrentielle pour rester compétitif sur votre marché.',
    icon: <TrendingUp className="h-6 w-6" />,
    category: 'analytics',
    status: 'premium',
    isActive: false,
    features: [
      'Monitoring concurrents',
      'Analyse des prix',
      'Benchmarks sectoriels',
      'Alertes automatiques'
    ],
    benefits: [
      'Avantage stratégique',
      'Pricing optimal',
      'Veille automatisée',
      'Opportunités identifiées'
    ],
    price: '29€/mois'
  },

  // INTEGRATIONS
  {
    id: 'api-access',
    name: 'Accès API Complet',
    description: 'Intégrez Reservatoo avec vos outils existants',
    longDescription: 'API complète pour connecter Reservatoo avec vos systèmes et outils existants.',
    icon: <Webhook className="h-6 w-6" />,
    category: 'integrations',
    status: 'premium',
    isActive: false,
    features: [
      'API REST complète',
      'Webhooks en temps réel',
      'Documentation complète',
      'Support technique'
    ],
    benefits: [
      'Intégrations personnalisées',
      'Automatisation poussée',
      'Écosystème connecté',
      'Efficacité maximale'
    ],
    price: '39€/mois'
  },
  {
    id: 'zapier-integration',
    name: 'Intégration Zapier',
    description: 'Connectez Reservatoo à 6000+ applications',
    longDescription: 'Intégration native avec Zapier pour automatiser vos workflows.',
    icon: <Zap className="h-6 w-6" />,
    category: 'integrations',
    status: 'free',
    isActive: false,
    features: [
      'Connexion Zapier native',
      'Triggers personnalisés',
      'Actions automatisées',
      'Workflows prédéfinis'
    ],
    benefits: [
      'Automatisation simple',
      'Gain de temps',
      'Intégrations sans code',
      'Productivité accrue'
    ],
    price: 'Gratuit'
  }
];

const categories = [
  { id: 'customer', name: 'Clients', icon: <Users className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'events', name: 'Événements', icon: <CalendarDays className="h-4 w-4" />, color: 'bg-green-100 text-green-800 border-green-300' },
  { id: 'payments', name: 'Paiements', icon: <CreditCard className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { id: 'communication', name: 'Communication', icon: <MessageCircle className="h-4 w-4" />, color: 'bg-orange-100 text-orange-800 border-orange-300' },
  { id: 'marketing', name: 'Marketing', icon: <Gift className="h-4 w-4" />, color: 'bg-pink-100 text-pink-800 border-pink-300' },
  { id: 'automation', name: 'Automatisation', icon: <Bot className="h-4 w-4" />, color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  { id: 'analytics', name: 'Analytics', icon: <BarChart3 className="h-4 w-4" />, color: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
  { id: 'integrations', name: 'Intégrations', icon: <Webhook className="h-4 w-4" />, color: 'bg-teal-100 text-teal-800 border-teal-300' }
];

export default function AdditionalServices() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<AdditionalModule | null>(null);
  const [moduleStates, setModuleStates] = useState<Record<string, boolean>>(
    modules.reduce((acc, module) => ({ ...acc, [module.id]: module.isActive }), {})
  );

  const filteredAndSortedModules = modules
    .filter(module => {
      if (selectedCategory !== 'all' && module.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && module.status !== selectedStatus) return false;
      if (searchQuery && !module.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !module.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'price':
          aValue = a.price === 'Gratuit' ? 0 : parseFloat(a.price?.replace(/[^\d,]/g, '').replace(',', '.') || '0');
          bValue = b.price === 'Gratuit' ? 0 : parseFloat(b.price?.replace(/[^\d,]/g, '').replace(',', '.') || '0');
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleToggleModule = (moduleId: string, enabled: boolean) => {
    setModuleStates(prev => ({ ...prev, [moduleId]: enabled }));
    const module = modules.find(m => m.id === moduleId);
    
    if (enabled) {
      toast.success(`Module "${module?.name}" activé avec succès!`);
    } else {
      toast.info(`Module "${module?.name}" désactivé.`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">Disponible</Badge>;
      case 'free':
        return <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-300">Gratuit</Badge>;
      case 'coming_soon':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-300">Bientôt</Badge>;
      case 'premium':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
          <Crown className="h-3 w-3 mr-1" />
          Premium
        </Badge>;
      default:
        return null;
    }
  };

  const getModuleCardStyle = (module: AdditionalModule) => {
    if (moduleStates[module.id]) {
      return 'border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50';
    }
    if (module.popular) {
      return 'border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50';
    }
    return 'hover:border-purple-100 hover:shadow-lg';
  };

  const activatedCount = Object.values(moduleStates).filter(Boolean).length;
  const freeCount = modules.filter(m => m.status === 'free').length;

  return (
    <AppLayout>
      <Helmet>
        <title>Modules complémentaires - Reservatoo</title>
      </Helmet>
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/calendar')}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Modules complémentaires
              </h1>
              <p className="text-muted-foreground mt-1 text-sm lg:text-base">
                Enrichissez votre plateforme avec des fonctionnalités avancées
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-indigo-50 p-2 lg:p-3 rounded-lg border text-sm">
              <Star className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-purple-900">
                {activatedCount} modules activés
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 p-2 lg:p-3 rounded-lg border text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-900">
                {freeCount} modules gratuits
              </span>
            </div>
          </div>
        </div>

        {/* Improved Filters & Controls */}
        <div className="bg-white border rounded-lg p-4 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un module..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Categories Pills */}
          <div className="flex flex-wrap gap-2">
            <Toggle
              pressed={selectedCategory === 'all'}
              onPressedChange={() => setSelectedCategory('all')}
              className="data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800"
            >
              Tous ({modules.length})
            </Toggle>
            {categories.map(category => (
              <Toggle
                key={category.id}
                pressed={selectedCategory === category.id}
                onPressedChange={() => setSelectedCategory(category.id)}
                className={`data-[state=on]:${category.color} flex items-center gap-1`}
              >
                {category.icon}
                <span className="hidden sm:inline">{category.name}</span>
                <span className="sm:hidden">{category.name.slice(0, 3)}</span>
                ({modules.filter(m => m.category === category.id).length})
              </Toggle>
            ))}
          </div>

          {/* Advanced Filters & Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {/* Status Filter */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="free">Gratuit</SelectItem>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="coming_soon">Bientôt</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                    Trier
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {setSortBy('name'); setSortOrder('asc')}}>
                    Nom (A-Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {setSortBy('name'); setSortOrder('desc')}}>
                    Nom (Z-A)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {setSortBy('price'); setSortOrder('asc')}}>
                    Prix (croissant)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {setSortBy('price'); setSortOrder('desc')}}>
                    Prix (décroissant)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="text-sm text-gray-600">
            {filteredAndSortedModules.length} module(s) trouvé(s)
            {searchQuery && ` pour "${searchQuery}"`}
            {selectedCategory !== 'all' && ` dans ${categories.find(c => c.id === selectedCategory)?.name}`}
          </div>
        </div>

        {/* Modules Grid/List */}
        <div className={
          viewMode === 'grid' 
            ? "grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
            : "space-y-4"
        }>
          {filteredAndSortedModules.map((module) => (
            <Card 
              key={module.id} 
              className={`group hover:shadow-xl transition-all duration-300 ${getModuleCardStyle(module)} ${
                viewMode === 'list' ? 'flex flex-row items-center p-4' : ''
              }`}
            >
              {viewMode === 'grid' ? (
                <>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl ${
                        moduleStates[module.id] 
                          ? 'bg-purple-100 text-purple-600' 
                          : module.popular
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-gray-100 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600'
                      } transition-colors`}>
                        {module.icon}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(module.status)}
                        {(module.status === 'available' || module.status === 'free') && (
                          <Switch
                            checked={moduleStates[module.id]}
                            onCheckedChange={(checked) => handleToggleModule(module.id, checked)}
                          />
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <CardTitle className="text-lg group-hover:text-purple-600 transition-colors flex items-center gap-2">
                        {module.name}
                        {module.popular && (
                          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 text-xs">
                            Populaire
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {module.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${
                          module.status === 'free' ? 'text-green-600' :
                          module.status === 'premium' ? 'text-purple-600' :
                          'text-blue-600'
                        }`}>
                          {module.price}
                        </span>
                        {module.originalPrice && (
                          <span className="text-sm line-through text-muted-foreground">
                            {module.originalPrice}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedModule(module)}
                        className="text-xs hover:bg-purple-50 hover:border-purple-300"
                      >
                        <Info className="h-3 w-3 mr-1" />
                        Détails
                      </Button>
                    </div>
                    
                    {moduleStates[module.id] && (
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-800 font-medium">Module activé</span>
                      </div>
                    )}
                  </CardContent>
                </>
              ) : (
                /* List View */
                <div className="flex items-center gap-4 w-full">
                  <div className={`p-3 rounded-xl ${
                    moduleStates[module.id] 
                      ? 'bg-purple-100 text-purple-600' 
                      : module.popular
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-gray-100 text-gray-600'
                  } transition-colors`}>
                    {module.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg truncate">{module.name}</h3>
                      {module.popular && (
                        <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 text-xs">
                          Populaire
                        </Badge>
                      )}
                      {getStatusBadge(module.status)}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1">{module.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        module.status === 'free' ? 'text-green-600' :
                        module.status === 'premium' ? 'text-purple-600' :
                        'text-blue-600'
                      }`}>
                        {module.price}
                      </div>
                      {moduleStates[module.id] && (
                        <div className="text-xs text-green-600 font-medium">Activé</div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedModule(module)}
                        className="text-xs"
                      >
                        <Info className="h-3 w-3 mr-1" />
                        Voir
                      </Button>
                      {(module.status === 'available' || module.status === 'free') && (
                        <Switch
                          checked={moduleStates[module.id]}
                          onCheckedChange={(checked) => handleToggleModule(module.id, checked)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedModules.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun module trouvé</h3>
            <p className="text-gray-600 mb-4">Essayez de modifier vos critères de recherche</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}

        {/* Module Details Dialog */}
        <Dialog open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                  {selectedModule?.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <DialogTitle className="text-xl">{selectedModule?.name}</DialogTitle>
                    {selectedModule?.popular && (
                      <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                        Populaire
                      </Badge>
                    )}
                  </div>
                  {selectedModule && getStatusBadge(selectedModule.status)}
                </div>
              </div>
              <DialogDescription className="text-base">
                {selectedModule?.longDescription}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  Fonctionnalités incluses
                </h4>
                <ul className="space-y-2">
                  {selectedModule?.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4 text-purple-600" />
                  Bénéfices pour votre entreprise
                </h4>
                <ul className="space-y-2">
                  {selectedModule?.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-purple-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <DialogFooter className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xl font-bold ${
                  selectedModule?.status === 'free' ? 'text-green-600' :
                  selectedModule?.status === 'premium' ? 'text-purple-600' :
                  'text-blue-600'
                }`}>
                  {selectedModule?.price}
                </span>
                {selectedModule?.originalPrice && (
                  <span className="text-sm line-through text-muted-foreground">
                    {selectedModule?.originalPrice}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedModule(null)}>
                  Fermer
                </Button>
                {(selectedModule?.status === 'available' || selectedModule?.status === 'free') && (
                  <Button 
                    onClick={() => {
                      if (selectedModule) {
                        handleToggleModule(selectedModule.id, !moduleStates[selectedModule.id]);
                        setSelectedModule(null);
                      }
                    }}
                    className={`${
                      selectedModule?.status === 'free' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {moduleStates[selectedModule?.id] ? 'Désactiver' : 'Activer le module'}
                  </Button>
                )}
                {selectedModule?.status === 'coming_soon' && (
                  <Button disabled>
                    Bientôt disponible
                  </Button>
                )}
                {selectedModule?.status === 'premium' && (
                  <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                    <Crown className="h-4 w-4 mr-2" />
                    Passer au Premium
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
