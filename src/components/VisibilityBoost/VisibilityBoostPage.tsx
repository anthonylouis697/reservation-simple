
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CalendarIcon, ChevronRight, Star, BarChart, Settings, ArrowRight } from 'lucide-react';
import PremiumPlatformCard from './PremiumPlatformCard';
import { AppLayout } from '@/components/AppLayout';

// Types d'affaires disponibles
const businessTypes = [
  { value: "coach", label: "Coach / Professeur" },
  { value: "restaurant", label: "Restaurant / Café" },
  { value: "spa", label: "Spa / Bien-être" },
  { value: "salon", label: "Salon de beauté / Coiffure" },
  { value: "medical", label: "Santé / Médical" },
  { value: "activity", label: "Activités / Loisirs" },
  { value: "other", label: "Autre" }
];

// Plateformes disponibles selon le type d'affaire
const getPlatformsByType = (type: string) => {
  switch (type) {
    case "coach":
      return [
        {
          name: "SuperProf",
          description: "La référence pour les cours particuliers",
          commission: "15%",
          features: [
            "500 000+ élèves actifs",
            "Profil vérifié",
            "Protection des paiements",
            "Messages illimités"
          ],
          popular: true
        },
        {
          name: "LeBonCoin",
          description: "Plateforme d'annonces très populaire",
          commission: "10%",
          features: [
            "Visibilité nationale",
            "28 millions de visiteurs mensuels",
            "Catégorie services dédiée",
            "Boost d'annonce inclus"
          ]
        },
        {
          name: "Stootie",
          description: "Services et prestations entre particuliers",
          commission: "12%",
          features: [
            "Mise en relation directe",
            "Système d'avis vérifiés",
            "Alertes demandes clients",
            "Application mobile"
          ]
        }
      ];
    case "restaurant":
      return [
        {
          name: "TheFork",
          description: "Leader de la réservation de restaurants",
          commission: "2€ / couvert",
          features: [
            "12 millions d'utilisateurs actifs",
            "Visibilité premium",
            "Système de points fidélité",
            "Gestion des no-shows"
          ],
          popular: true
        },
        {
          name: "TripAdvisor",
          description: "Le plus grand site de voyage au monde",
          commission: "14%",
          features: [
            "Audience mondiale",
            "Réservation directe",
            "Système d'avis",
            "Statistiques détaillées"
          ]
        },
        {
          name: "Resto.fr",
          description: "Plateforme française de réservation",
          commission: "1.5€ / couvert",
          features: [
            "Clientèle française ciblée",
            "Système anti-annulation",
            "Promotions personnalisées",
            "Intégration calendrier"
          ]
        }
      ];
    case "activity":
      return [
        {
          name: "FunBooker",
          description: "Plateforme de réservation d'activités",
          commission: "12%",
          features: [
            "Communauté d'amateurs d'activités",
            "Système de recherche géolocalisée",
            "Réservations de groupe facilitées",
            "Mises en avant saisonnières"
          ],
          popular: true
        },
        {
          name: "LesAnnuairesLocaux",
          description: "Réseau d'annuaires locaux et régionaux",
          commission: "8%",
          monthlyFee: "19€",
          features: [
            "Présence sur +250 sites locaux",
            "Référencement Google optimisé",
            "Affichage dans les offices de tourisme",
            "Photos HD illimitées"
          ]
        },
        {
          name: "TripAdvisor",
          description: "Le plus grand site de voyage au monde",
          commission: "14%",
          features: [
            "Audience mondiale",
            "Réservation directe",
            "Système d'avis",
            "Statistiques détaillées"
          ]
        }
      ];
    default:
      return [
        {
          name: "BookingBoost",
          description: "Réseau de sites de réservation",
          commission: "10%",
          features: [
            "Présence multi-plateformes",
            "Dashboard unifié",
            "Analytics avancés",
            "Support prioritaire"
          ],
          popular: true
        },
        {
          name: "LeBonCoin",
          description: "Plateforme d'annonces très populaire",
          commission: "8%",
          features: [
            "Visibilité nationale",
            "28 millions de visiteurs mensuels",
            "Catégorie services dédiée",
            "Boost d'annonce inclus"
          ]
        },
        {
          name: "TopAnnuaires",
          description: "Réseau d'annuaires professionnels",
          commission: "5%",
          monthlyFee: "15€",
          features: [
            "Présence sur 300+ annuaires",
            "Référencement local optimisé",
            "Badge entreprise vérifiée",
            "Statistiques de visites"
          ]
        }
      ];
  }
};

const VisibilityBoostPage = () => {
  const [businessType, setBusinessType] = useState("coach");
  const [activeTab, setActiveTab] = useState("platforms");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);

  const handlePlatformConnect = (platformName: string) => {
    if (connectedPlatforms.includes(platformName)) {
      setConnectedPlatforms(connectedPlatforms.filter(p => p !== platformName));
      toast.success(`${platformName} déconnecté avec succès`);
    } else {
      setConnectedPlatforms([...connectedPlatforms, platformName]);
      toast.success(`Connecté avec succès à ${platformName}`);
    }
  };

  const handleSubscribe = () => {
    setIsSubscribed(true);
    toast.success("Abonnement Boost de Visibilité activé avec succès !");
  };

  const handleBusinessTypeChange = (value: string) => {
    setBusinessType(value);
  };

  const platforms = getPlatformsByType(businessType);

  // Données de démonstration pour l'analytique
  const analyticsData = {
    totalViews: 1243,
    totalClicks: 87,
    totalBookings: 14,
    platformStats: [
      { name: "SuperProf", views: 620, clicks: 43, bookings: 8 },
      { name: "LeBonCoin", views: 412, clicks: 29, bookings: 4 },
      { name: "Stootie", views: 211, clicks: 15, bookings: 2 }
    ]
  };

  // Composant step wizard pour l'onboarding
  const OnboardingWizard = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">
          <Star className="inline-block mr-2 text-amber-500 fill-amber-400" size={24} />
          Boost de Visibilité
        </h1>
        <p className="text-muted-foreground">
          Multipliez vos réservations en vous connectant aux meilleures plateformes du marché
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comment ça marche ?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex">
              <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="font-medium text-primary">1</span>
              </div>
              <div>
                <h3 className="font-medium">Activez l'abonnement Boost de Visibilité</h3>
                <p className="text-sm text-muted-foreground">
                  Pour seulement 29€/mois + 2% de commission sur les réservations issues des plateformes partenaires
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="font-medium text-primary">2</span>
              </div>
              <div>
                <h3 className="font-medium">Connectez-vous aux plateformes qui vous intéressent</h3>
                <p className="text-sm text-muted-foreground">
                  Choisissez parmi une sélection de plateformes adaptées à votre activité
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="font-medium text-primary">3</span>
              </div>
              <div>
                <h3 className="font-medium">Suivez vos performances</h3>
                <p className="text-sm text-muted-foreground">
                  Consultez le nombre de vues, clics et réservations générés par chaque plateforme
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col space-y-4">
          <div className="w-full">
            <Label htmlFor="business-type" className="mb-2 block">Sélectionnez votre type d'activité</Label>
            <Select value={businessType} onValueChange={handleBusinessTypeChange}>
              <SelectTrigger id="business-type">
                <SelectValue placeholder="Sélectionnez votre type d'activité" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleSubscribe} 
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          >
            Activer le Boost de Visibilité pour 29€/mois
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            L'abonnement est sans engagement et peut être annulé à tout moment.
            Des frais de 2% s'appliquent sur les réservations issues des plateformes partenaires.
          </p>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Les avantages du Boost de Visibilité</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <span className="text-green-600 font-bold">+</span>
              </div>
              <div>
                <h3 className="font-medium">Plus de visibilité</h3>
                <p className="text-sm text-muted-foreground">
                  Augmentez votre présence en ligne sur les plateformes les plus fréquentées
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <span className="text-blue-600 font-bold">$</span>
              </div>
              <div>
                <h3 className="font-medium">Plus de revenus</h3>
                <p className="text-sm text-muted-foreground">
                  En moyenne, nos utilisateurs augmentent leurs revenus de 35%
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <span className="text-purple-600 font-bold">⚙️</span>
              </div>
              <div>
                <h3 className="font-medium">Gestion centralisée</h3>
                <p className="text-sm text-muted-foreground">
                  Gérez toutes vos réservations depuis une seule interface
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <span className="text-amber-600 font-bold">📊</span>
              </div>
              <div>
                <h3 className="font-medium">Analytiques détaillées</h3>
                <p className="text-sm text-muted-foreground">
                  Suivez et optimisez votre performance sur chaque plateforme
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Page principale pour les utilisateurs abonnés
  const MainDashboard = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Star className="h-6 w-6 text-amber-500 fill-amber-400" />
            <h1 className="text-2xl font-bold">Boost de Visibilité</h1>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Actif</Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Gérez vos connexions aux plateformes partenaires
          </p>
        </div>
        <Button variant="outline" className="mt-2 md:mt-0" onClick={() => setActiveTab("settings")}>
          <Settings className="mr-2 h-4 w-4" />
          Gérer mon abonnement
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="platforms">
            Plateformes
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart className="mr-2 h-4 w-4" />
            Analytiques
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Plateformes disponibles</CardTitle>
                <Select value={businessType} onValueChange={handleBusinessTypeChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Type d'activité" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {platforms.map((platform) => (
                  <PremiumPlatformCard
                    key={platform.name}
                    name={platform.name}
                    description={platform.description}
                    features={platform.features}
                    commission={platform.commission}
                    monthlyFee={platform.monthlyFee}
                    popular={platform.popular}
                    onConnect={() => handlePlatformConnect(platform.name)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-muted/30 rounded-lg p-4 text-sm">
            <p>
              <span className="font-medium">Note:</span> Les commissions sont prélevées uniquement sur les réservations issues des plateformes partenaires. 
              Vous conservez 100% des revenus de vos clients directs.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <div className="rounded-full bg-blue-100 p-3">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium">Vues</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">{analyticsData.totalViews}</p>
                <p className="text-sm text-gray-500">ce mois-ci</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <div className="rounded-full bg-green-100 p-3">
                  <ChevronRight className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium">Clics</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">{analyticsData.totalClicks}</p>
                <p className="text-sm text-gray-500">ce mois-ci</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <div className="rounded-full bg-indigo-100 p-3">
                  <CalendarIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium">Réservations</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">{analyticsData.totalBookings}</p>
                <p className="text-sm text-gray-500">ce mois-ci</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance par plateforme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analyticsData.platformStats.map((platform) => (
                  <div key={platform.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{platform.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {platform.views} vues • {platform.clicks} clics • {platform.bookings} réservations
                      </div>
                    </div>
                    <div className="bg-muted h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full" 
                        style={{ width: `${(platform.clicks / platform.views * 100).toFixed(1)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de votre abonnement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Nom de l'entreprise</Label>
                <Input id="business-name" defaultValue="Entreprise ABC" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="business-type-settings">Type d'activité</Label>
                <Select defaultValue={businessType}>
                  <SelectTrigger id="business-type-settings">
                    <SelectValue placeholder="Sélectionnez votre type d'activité" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Abonnement actuel</Label>
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <div className="font-medium">Boost de Visibilité</div>
                    <div className="text-sm text-muted-foreground">29€/mois + 2% de commission</div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Actif</Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Facturation</Label>
                <div className="text-sm p-4 border rounded-md">
                  <div className="flex justify-between mb-2">
                    <span>Prochaine facture</span>
                    <span>15 juin 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Montant</span>
                    <span className="font-medium">29,00 €</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button variant="outline" className="w-full">
                Gérer mes moyens de paiement
              </Button>
              <Button variant="destructive" className="w-full">
                Annuler mon abonnement
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        {isSubscribed ? <MainDashboard /> : <OnboardingWizard />}
      </div>
    </AppLayout>
  );
};

export default VisibilityBoostPage;
