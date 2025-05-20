import { Helmet } from "react-helmet";
import { AppLayout } from "@/components/AppLayout";
import { useVisibilityNavigation, VisibilityNavigation } from "@/components/Visibility/VisibilityNavigation";
import { PremiumPlatformCard } from "@/components/VisibilityBoost/PremiumPlatformCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Check, Info } from "lucide-react";

export default function VisibilityBoostPage() {
  const { currentTab } = useVisibilityNavigation();

  const platforms = [
    {
      name: "Premium Local",
      description: "Apparaissez en priorité sur les recherches locales",
      price: "À partir de 49€/mois",
      users: "180,000+ professionnels",
      benefits: [
        "Visibilité accrue sur les recherches locales",
        "Mise en avant dans les résultats près de chez moi",
        "Badge professionnel vérifié",
        "Accès aux statistiques de performance",
        "Présence sur les cartes interactives"
      ],
      featured: false
    },
    {
      name: "Boost Pro",
      description: "Visibilité maximale pour développer votre clientèle",
      price: "À partir de 89€/mois",
      users: "75,000+ professionnels",
      benefits: [
        "Tout le contenu de Premium Local",
        "Positionnement prioritaire dans les recherches",
        "Intégration dans les plateformes partenaires",
        "Recommandations personnalisées aux utilisateurs",
        "Reporting détaillé des conversions",
        "Support dédié et conseils d'optimisation"
      ],
      featured: true
    },
    {
      name: "Spécialiste Local",
      description: "Établissez-vous comme référence dans votre domaine",
      price: "À partir de 129€/mois",
      users: "32,000+ experts",
      benefits: [
        "Tout le contenu de Boost Pro",
        "Status d'expert recommandé",
        "Accès à la communauté de clients premium",
        "Publications d'articles d'expertise",
        "Badge de spécialiste certifié",
        "Accès aux demandes spécifiques"
      ],
      featured: false
    }
  ];

  return (
    <AppLayout>
      <Helmet>
        <title>Boost de visibilité - Reservatoo</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Visibilité et Croissance</h1>
          <p className="text-muted-foreground mt-1">
            Développez votre présence en ligne et augmentez vos revenus
          </p>
        </div>

        <VisibilityNavigation currentTab={currentTab} />

        <div>
          <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 p-6 mb-6">
            <div className="max-w-3xl mx-auto text-center space-y-3">
              <h2 className="text-2xl font-bold text-indigo-900">Boostez votre visibilité en ligne</h2>
              <p className="text-indigo-700">
                Apparaissez en tête des plateformes de réservation partenaires et augmentez significativement votre nombre de nouveaux clients.
              </p>
              <div className="flex justify-center gap-2 mt-4">
                <Button size="lg">
                  Découvrir les offres
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  Comment ça marche
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {platforms.map((platform, index) => (
              <Card key={index} className={`overflow-hidden ${platform.featured ? 'border-primary shadow-md' : ''}`}>
                {platform.featured && (
                  <div className="bg-primary text-primary-foreground text-center py-1.5 text-sm font-medium">
                    Le plus populaire
                  </div>
                )}
                <CardHeader className={platform.featured ? 'bg-primary/5' : ''}>
                  <div className="flex items-center justify-between">
                    <CardTitle>{platform.name}</CardTitle>
                    {platform.featured && <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />}
                  </div>
                  <CardDescription className="mt-2">{platform.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="text-2xl font-bold">{platform.price}</div>
                    <div className="text-sm text-muted-foreground">{platform.users}</div>
                  </div>
                  
                  <ul className="space-y-2">
                    {platform.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button className="w-full" variant={platform.featured ? "default" : "outline"}>
                    Sélectionner ce plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Comment fonctionne le boost de visibilité?</h3>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center text-blue-700 font-semibold mb-2">1</div>
                      <h4 className="font-medium">Choisissez votre plan</h4>
                      <p className="text-sm text-muted-foreground">
                        Sélectionnez le plan qui correspond le mieux à vos objectifs et à votre budget.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center text-blue-700 font-semibold mb-2">2</div>
                      <h4 className="font-medium">Optimisez votre profil</h4>
                      <p className="text-sm text-muted-foreground">
                        Complétez votre profil avec des photos, descriptions et services pour maximiser votre impact.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center text-blue-700 font-semibold mb-2">3</div>
                      <h4 className="font-medium">Développez votre clientèle</h4>
                      <p className="text-sm text-muted-foreground">
                        Apparaissez en priorité sur les plateformes partenaires et attirez de nouveaux clients.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
