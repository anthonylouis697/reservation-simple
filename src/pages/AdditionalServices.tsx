
import { useState } from 'react';
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Helmet } from "react-helmet";
import { ArrowLeft, Heart, CalendarDays, Ticket, CreditCard, Users, Crown, Star, Zap, CheckCircle, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Types pour les modules
interface AdditionalModule {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: React.ReactNode;
  category: 'customer' | 'events' | 'payments' | 'analytics';
  status: 'available' | 'coming_soon' | 'premium';
  isActive: boolean;
  features: string[];
  benefits: string[];
  price?: string;
}

// Données des modules
const modules: AdditionalModule[] = [
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
    price: '29€/mois'
  },
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
    price: '19€/mois'
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
    price: '35€/mois'
  },
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
    price: '79€/mois'
  }
];

const categories = [
  { id: 'all', name: 'Tous les modules', count: modules.length },
  { id: 'customer', name: 'Gestion Client', count: modules.filter(m => m.category === 'customer').length },
  { id: 'events', name: 'Événements', count: modules.filter(m => m.category === 'events').length },
  { id: 'payments', name: 'Paiements', count: modules.filter(m => m.category === 'payments').length },
  { id: 'analytics', name: 'Analytics', count: modules.filter(m => m.category === 'analytics').length }
];

export default function AdditionalServices() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedModule, setSelectedModule] = useState<AdditionalModule | null>(null);
  const [moduleStates, setModuleStates] = useState<Record<string, boolean>>(
    modules.reduce((acc, module) => ({ ...acc, [module.id]: module.isActive }), {})
  );

  const filteredModules = activeTab === 'all' 
    ? modules 
    : modules.filter(module => module.category === activeTab);

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
        return <Badge variant="default" className="bg-green-100 text-green-800">Disponible</Badge>;
      case 'coming_soon':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Bientôt</Badge>;
      case 'premium':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
          <Crown className="h-3 w-3 mr-1" />
          Premium
        </Badge>;
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Modules complémentaires - Reservatoo</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Modules complémentaires
              </h1>
              <p className="text-muted-foreground mt-1">
                Enrichissez votre plateforme avec des fonctionnalités avancées
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-lg border">
            <Star className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">
              {Object.values(moduleStates).filter(Boolean).length} modules activés
            </span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            {categories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="text-xs lg:text-sm"
              >
                {category.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredModules.map((module) => (
                <Card 
                  key={module.id} 
                  className={`group hover:shadow-xl transition-all duration-300 border-2 ${
                    moduleStates[module.id] 
                      ? 'border-purple-200 bg-purple-50/50' 
                      : 'hover:border-purple-100'
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl ${
                        moduleStates[module.id] 
                          ? 'bg-purple-100 text-purple-600' 
                          : 'bg-gray-100 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600'
                      } transition-colors`}>
                        {module.icon}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(module.status)}
                        {module.status === 'available' && (
                          <Switch
                            checked={moduleStates[module.id]}
                            onCheckedChange={(checked) => handleToggleModule(module.id, checked)}
                            disabled={module.status !== 'available'}
                          />
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                        {module.name}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {module.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-purple-600">
                        {module.price}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedModule(module)}
                        className="text-xs hover:bg-purple-50 hover:border-purple-300"
                      >
                        <Info className="h-3 w-3 mr-1" />
                        En savoir plus
                      </Button>
                    </div>
                    
                    {moduleStates[module.id] && (
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-800 font-medium">Module activé</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Module Details Dialog */}
        <Dialog open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                  {selectedModule?.icon}
                </div>
                <div>
                  <DialogTitle className="text-xl">{selectedModule?.name}</DialogTitle>
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
              <div className="text-xl font-bold text-purple-600">
                {selectedModule?.price}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedModule(null)}>
                  Fermer
                </Button>
                {selectedModule?.status === 'available' && (
                  <Button 
                    onClick={() => {
                      if (selectedModule) {
                        handleToggleModule(selectedModule.id, !moduleStates[selectedModule.id]);
                        setSelectedModule(null);
                      }
                    }}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {moduleStates[selectedModule.id] ? 'Désactiver' : 'Activer le module'}
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
