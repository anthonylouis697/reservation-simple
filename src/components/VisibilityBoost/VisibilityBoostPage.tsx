
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Check, ArrowUpRight, ChevronRight, TrendingUp, Award, Rocket } from 'lucide-react';
import { toast } from 'sonner';

const VisibilityBoostPage = () => {
  const [activeTab, setActiveTab] = useState("marketplaces");
  const [subscribedToBoost, setSubscribedToBoost] = useState(false);
  const [activePlatforms, setActivePlatforms] = useState<string[]>([]);

  const handleActivatePlatform = (platform: string, isActive: boolean) => {
    if (isActive) {
      setActivePlatforms([...activePlatforms, platform]);
      toast.success(`Intégration avec ${platform} activée`);
    } else {
      setActivePlatforms(activePlatforms.filter(p => p !== platform));
      toast.success(`Intégration avec ${platform} désactivée`);
    }
  };

  const handleSubscribeToBoost = () => {
    setSubscribedToBoost(true);
    toast.success("Félicitations! Vous êtes abonné au module Boost de Visibilité");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-2 mb-6">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">Boost de Visibilité</h1>
          <Badge variant="outline" className="ml-3 bg-amber-100 text-amber-800 hover:bg-amber-100">Premium</Badge>
        </div>
        <p className="text-muted-foreground">
          Augmentez votre visibilité et vos revenus en vous connectant aux meilleures plateformes du marché
        </p>
      </div>

      {!subscribedToBoost ? (
        <Card className="mb-8 border-2 border-primary/20">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-6 w-6 text-primary" />
              Boostez votre activité
            </CardTitle>
            <CardDescription>
              Accédez à notre module premium pour multiplier vos réservations et revenus
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-medium text-lg mb-4">Le module Boost de Visibilité inclut :</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <span>Intégration avec les principales plateformes de réservation de votre secteur</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <span>Synchronisation automatique de votre calendrier et disponibilités</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <span>Gestion centralisée de toutes vos réservations depuis BookWise</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <span>Tableau de bord analytics pour suivre les performances par plateforme</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <span>Support dédié pour optimiser votre présence en ligne</span>
                  </li>
                </ul>
              </div>
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-medium text-lg mb-4">Tarification</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">29€</span>
                  <span className="text-muted-foreground">/mois</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  + commission de 2% sur les réservations provenant des plateformes partenaires
                </p>
                <Button className="w-full" onClick={handleSubscribeToBoost}>
                  Activer maintenant
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-3">
                  Sans engagement - Annulez à tout moment
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Module Boost de Visibilité actif</h3>
                  <p className="text-sm text-muted-foreground">
                    Vous êtes abonné au forfait Premium à 29€/mois
                  </p>
                </div>
                <Button variant="outline" className="ml-auto" size="sm">
                  Gérer l'abonnement
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-6">
              <TabsTrigger value="marketplaces">Places de marché</TabsTrigger>
              <TabsTrigger value="analytics">Analyses</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            <TabsContent value="marketplaces" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Places de marché recommandées</CardTitle>
                  <CardDescription>
                    Connectez-vous aux plateformes adaptées à votre secteur pour augmenter votre visibilité
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <MarketPlaceCategory
                    title="Pour coachs et professeurs"
                    platforms={[
                      {
                        name: "SuperProf",
                        description: "Plateforme de mise en relation avec des élèves",
                        logo: "https://example.com/superprof.png", 
                        commission: "3%",
                        active: activePlatforms.includes("SuperProf"),
                        onToggle: (isActive) => handleActivatePlatform("SuperProf", isActive)
                      },
                      {
                        name: "LeBonCoin",
                        description: "Annonces de cours particuliers",
                        logo: "https://example.com/leboncoin.png",
                        commission: "2%",
                        active: activePlatforms.includes("LeBonCoin"),
                        onToggle: (isActive) => handleActivatePlatform("LeBonCoin", isActive)
                      },
                      {
                        name: "Kelprof",
                        description: "Plateforme de cours particuliers",
                        logo: "https://example.com/kelprof.png",
                        commission: "3%",
                        active: activePlatforms.includes("Kelprof"),
                        onToggle: (isActive) => handleActivatePlatform("Kelprof", isActive)
                      }
                    ]}
                  />
                  
                  <Separator />
                  
                  <MarketPlaceCategory
                    title="Pour restaurants et établissements food"
                    platforms={[
                      {
                        name: "TheFork",
                        description: "Plateforme de réservation de restaurant",
                        logo: "https://example.com/thefork.png",
                        commission: "2%",
                        active: activePlatforms.includes("TheFork"),
                        onToggle: (isActive) => handleActivatePlatform("TheFork", isActive)
                      },
                      {
                        name: "TripAdvisor",
                        description: "Avis et réservations",
                        logo: "https://example.com/tripadvisor.png",
                        commission: "2,5%",
                        active: activePlatforms.includes("TripAdvisor"),
                        onToggle: (isActive) => handleActivatePlatform("TripAdvisor", isActive)
                      }
                    ]}
                  />
                  
                  <Separator />
                  
                  <MarketPlaceCategory
                    title="Pour activités de loisirs"
                    platforms={[
                      {
                        name: "FunBooker",
                        description: "Réservation d'activités de loisirs",
                        logo: "https://example.com/funbooker.png",
                        commission: "3%",
                        active: activePlatforms.includes("FunBooker"),
                        onToggle: (isActive) => handleActivatePlatform("FunBooker", isActive)
                      },
                      {
                        name: "Regiondo",
                        description: "Plateforme européenne d'activités",
                        logo: "https://example.com/regiondo.png",
                        commission: "2,5%",
                        active: activePlatforms.includes("Regiondo"),
                        onToggle: (isActive) => handleActivatePlatform("Regiondo", isActive)
                      }
                    ]}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analyse des performances</CardTitle>
                  <CardDescription>
                    Suivez vos performances sur l'ensemble des plateformes connectées
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-60 border-2 border-dashed rounded-lg">
                    <div className="text-center px-4">
                      <TrendingUp className="mx-auto h-10 w-10 text-muted-foreground/60 mb-3" />
                      <h3 className="font-medium text-lg">Aucune donnée disponible</h3>
                      <p className="text-sm text-muted-foreground mt-2 max-w-md">
                        Connectez-vous à au moins une plateforme pour commencer à afficher vos performances de réservation
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres d'intégration</CardTitle>
                  <CardDescription>
                    Configurez les options avancées de vos intégrations avec les plateformes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Synchronisation bidirectionnelle</Label>
                      <p className="text-sm text-muted-foreground">
                        Synchroniser les disponibilités dans les deux sens
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Notifications de réservation</Label>
                      <p className="text-sm text-muted-foreground">
                        Être notifié des réservations provenant des plateformes externes
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Confirmation automatique</Label>
                      <p className="text-sm text-muted-foreground">
                        Accepter automatiquement les réservations externes
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

// Composant pour afficher une catégorie de plateformes
interface MarketplacePlatform {
  name: string;
  description: string;
  logo: string;
  commission: string;
  active: boolean;
  onToggle: (isActive: boolean) => void;
}

interface MarketPlaceCategoryProps {
  title: string;
  platforms: MarketplacePlatform[];
}

const MarketPlaceCategory = ({ title, platforms }: MarketPlaceCategoryProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">{title}</h3>
      <div className="space-y-3">
        {platforms.map((platform) => (
          <div key={platform.name} className="flex items-center justify-between border rounded-md p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center mr-3 text-xs font-medium">
                {platform.name.substring(0, 2)}
              </div>
              <div>
                <h4 className="font-medium">{platform.name}</h4>
                <p className="text-sm text-muted-foreground">{platform.description}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-right mr-4">
                <Badge variant="outline" className="text-xs font-normal">
                  Commission: {platform.commission}
                </Badge>
              </div>
              <Switch
                checked={platform.active}
                onCheckedChange={platform.onToggle}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisibilityBoostPage;
