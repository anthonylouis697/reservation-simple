
import { Helmet } from "react-helmet";
import { AppLayout } from "@/components/AppLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVisibilityNavigation, VisibilityNavigation } from "@/components/Visibility/VisibilityNavigation";
import { 
  Globe, 
  Star, 
  Pencil, 
  MapPin, 
  MessageCircle, 
  Image, 
  Mail,
  Check,
  ArrowRight
} from "lucide-react";

export default function AdditionalServices() {
  const { currentTab } = useVisibilityNavigation();

  const services = [
    {
      id: "google-creation",
      title: "Création Fiche Google",
      description: "Créez une fiche Google My Business optimisée pour votre entreprise",
      icon: <Globe className="h-6 w-6 text-blue-500" />,
      price: "299€",
      color: "bg-blue-100",
      benefits: [
        "Configuration complète de votre fiche Google My Business",
        "Optimisation SEO locale avec mots-clés ciblés",
        "Ajout de photos professionnelles fournies par vos soins",
        "Mise en place des horaires, services et informations de contact",
        "Vérification et validation de la fiche"
      ]
    },
    {
      id: "google-boost",
      title: "Boost local Google",
      description: "Optimisez votre référencement local sur Google",
      icon: <Star className="h-6 w-6 text-green-500" />,
      price: "199€/mois",
      color: "bg-green-100",
      benefits: [
        "Gestion mensuelle de votre fiche Google My Business",
        "Publication régulière de contenus et d'actualités",
        "Réponse aux avis clients et gestion de la réputation",
        "Optimisation continue pour améliorer votre positionnement local",
        "Rapport mensuel de performance"
      ]
    },
    {
      id: "google-repair",
      title: "Réparation Fiche Google",
      description: "Résolution des problèmes et optimisation de votre fiche existante",
      icon: <Globe className="h-6 w-6 text-orange-500" />,
      price: "149€",
      color: "bg-orange-100",
      benefits: [
        "Diagnostic complet de votre fiche Google My Business existante",
        "Correction des erreurs et incohérences",
        "Récupération d'accès en cas de perte",
        "Fusion de fiches dupliquées",
        "Suppression de fausses informations"
      ]
    },
    {
      id: "website",
      title: "Création de site web",
      description: "Site internet sur mesure adapté à votre activité",
      icon: <Pencil className="h-6 w-6 text-rose-500" />,
      price: "À partir de 499€",
      color: "bg-rose-100",
      benefits: [
        "Design moderne et responsive (mobile, tablette, ordinateur)",
        "Intégration de votre système de réservation Reservatoo",
        "Optimisation SEO de base",
        "Hébergement et nom de domaine inclus la première année",
        "Formation à l'utilisation du site"
      ]
    },
    {
      id: "local-seo",
      title: "SEO local avancé",
      description: "Stratégie complète de référencement local",
      icon: <MapPin className="h-6 w-6 text-purple-500" />,
      price: "349€/mois",
      color: "bg-purple-100",
      benefits: [
        "Audit complet de votre présence en ligne locale",
        "Optimisation de votre site web pour le référencement local",
        "Gestion des citations et annuaires locaux",
        "Création de contenu local pertinent",
        "Stratégie d'acquisition de backlinks locaux"
      ]
    },
    {
      id: "review-management",
      title: "Gestion des avis",
      description: "Améliorez votre réputation en ligne",
      icon: <MessageCircle className="h-6 w-6 text-yellow-500" />,
      price: "129€/mois",
      color: "bg-yellow-100",
      benefits: [
        "Système automatisé de collecte d'avis clients",
        "Réponse aux avis (positifs et négatifs)",
        "Alertes en temps réel pour les nouveaux avis",
        "Stratégie de gestion de réputation",
        "Rapport mensuel d'analyse des avis"
      ]
    },
    {
      id: "photo-service",
      title: "Shooting photo pro",
      description: "Séance photo professionnelle pour votre entreprise",
      icon: <Image className="h-6 w-6 text-cyan-500" />,
      price: "399€",
      color: "bg-cyan-100",
      benefits: [
        "Séance photo de 2h dans votre établissement",
        "20 photos professionnelles retouchées",
        "Photos de vos locaux, services et équipe",
        "Droits d'utilisation illimités",
        "Format optimisé pour le web et les réseaux sociaux"
      ]
    },
    {
      id: "email-marketing",
      title: "Email marketing",
      description: "Campagnes email professionnelles pour vos clients",
      icon: <Mail className="h-6 w-6 text-indigo-500" />,
      price: "149€/mois",
      color: "bg-indigo-100",
      benefits: [
        "Création mensuelle de 2 newsletters professionnelles",
        "Segmentation de votre base clients",
        "Automatisation des campagnes",
        "Analyse des performances",
        "A/B testing pour optimiser vos résultats"
      ]
    }
  ];

  return (
    <AppLayout>
      <Helmet>
        <title>Services additionnels - Reservatoo</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Visibilité et Croissance</h1>
          <p className="text-muted-foreground mt-1">
            Développez votre présence en ligne et augmentez vos revenus
          </p>
        </div>

        <VisibilityNavigation currentTab={currentTab} />

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
              <CardHeader>
                <CardTitle>Boostez votre croissance</CardTitle>
                <CardDescription>
                  Des solutions professionnelles pour augmenter votre visibilité et attirer plus de clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Services réalisés par nos experts en marketing digital</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Intégration parfaite avec votre compte Reservatoo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Résultats concrets et mesurables</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Tarifs préférentiels pour les clients Reservatoo</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button>
                  Demander un appel conseil gratuit
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Services les plus demandés</CardTitle>
                <CardDescription>
                  Les prestations plébiscitées par nos clients pour développer leur activité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Globe className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium">Création Fiche Google</span>
                  </div>
                  <span className="text-sm font-semibold">299€</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Star className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium">Boost local Google</span>
                  </div>
                  <span className="text-sm font-semibold">199€/mois</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="bg-rose-100 p-2 rounded-full">
                      <Pencil className="h-4 w-4 text-rose-600" />
                    </div>
                    <span className="font-medium">Site web vitrine</span>
                  </div>
                  <span className="text-sm font-semibold">À partir de 499€</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">Tous les services</TabsTrigger>
              <TabsTrigger value="google">Google My Business</TabsTrigger>
              <TabsTrigger value="web">Site web</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {services.map((service) => (
                  <Card key={service.id} className="border-2 hover:border-primary transition-all">
                    <CardHeader className="pb-2">
                      <div className={`w-12 h-12 rounded-full ${service.color} flex items-center justify-center`}>
                        {service.icon}
                      </div>
                      <CardTitle className="text-lg mt-1">{service.title}</CardTitle>
                      <CardDescription className="h-12">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="font-bold text-lg text-primary">{service.price}</div>
                      <ul className="text-xs space-y-1">
                        {service.benefits.slice(0, 3).map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <Check className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                        {service.benefits.length > 3 && (
                          <li className="text-muted-foreground italic">+ {service.benefits.length - 3} autres avantages</li>
                        )}
                      </ul>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button className="w-full">
                        En savoir plus
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="google">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {services.filter(s => s.id.includes('google')).map((service) => (
                  <Card key={service.id} className="border-2 hover:border-primary transition-all">
                    <CardHeader className="pb-2">
                      <div className={`w-12 h-12 rounded-full ${service.color} flex items-center justify-center`}>
                        {service.icon}
                      </div>
                      <CardTitle className="text-lg mt-1">{service.title}</CardTitle>
                      <CardDescription className="h-12">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="font-bold text-lg text-primary">{service.price}</div>
                      <ul className="text-xs space-y-1">
                        {service.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <Check className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        En savoir plus
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="web">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.filter(s => s.id === 'website').map((service) => (
                  <Card key={service.id} className="border-2 hover:border-primary transition-all">
                    <CardHeader className="pb-2">
                      <div className={`w-12 h-12 rounded-full ${service.color} flex items-center justify-center`}>
                        {service.icon}
                      </div>
                      <CardTitle className="text-lg mt-1">{service.title}</CardTitle>
                      <CardDescription className="h-12">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="font-bold text-lg text-primary">{service.price}</div>
                      <ul className="text-xs space-y-1">
                        {service.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <Check className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        En savoir plus
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="marketing">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.filter(s => ['local-seo', 'review-management', 'email-marketing', 'photo-service'].includes(s.id)).map((service) => (
                  <Card key={service.id} className="border-2 hover:border-primary transition-all">
                    <CardHeader className="pb-2">
                      <div className={`w-12 h-12 rounded-full ${service.color} flex items-center justify-center`}>
                        {service.icon}
                      </div>
                      <CardTitle className="text-lg mt-1">{service.title}</CardTitle>
                      <CardDescription className="h-12">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="font-bold text-lg text-primary">{service.price}</div>
                      <ul className="text-xs space-y-1">
                        {service.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <Check className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        En savoir plus
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
