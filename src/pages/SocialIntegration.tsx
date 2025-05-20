import { Helmet } from "react-helmet";
import { AppLayout } from "@/components/AppLayout";
import { VisibilityNavigation, useVisibilityNavigation } from "@/components/Visibility/VisibilityNavigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Globe, ExternalLink } from "lucide-react";

export default function SocialIntegration() {
  const { currentTab } = useVisibilityNavigation();

  const socialPlatforms = [
    {
      name: "Facebook",
      icon: <Facebook className="h-6 w-6 text-blue-600" />,
      description: "Ajoutez un bouton de réservation sur votre page Facebook",
      steps: [
        "Connectez-vous à votre page Facebook",
        "Cliquez sur 'Modifier les informations'",
        "Sélectionnez 'Ajouter un bouton'",
        "Choisissez 'Prendre rendez-vous'",
        "Entrez l'URL de votre page de réservation"
      ],
      link: "https://www.facebook.com/business/help/327029232278948"
    },
    {
      name: "Instagram",
      icon: <Instagram className="h-6 w-6 text-pink-600" />,
      description: "Ajoutez un lien de réservation à votre bio Instagram",
      steps: [
        "Passez à un compte professionnel si ce n'est pas déjà fait",
        "Modifiez votre profil",
        "Ajoutez votre lien de réservation dans la section 'Site web'",
        "Mentionnez la réservation en ligne dans votre bio"
      ],
      link: "https://help.instagram.com/1791090447643166"
    },
    {
      name: "Google Business",
      icon: <Globe className="h-6 w-6 text-green-600" />,
      description: "Activez les réservations sur votre fiche Google My Business",
      steps: [
        "Connectez-vous à Google My Business",
        "Sélectionnez votre établissement",
        "Cliquez sur 'Info'",
        "Trouvez la section 'Réservation' et ajoutez votre URL",
        "Validez les modifications"
      ],
      link: "https://support.google.com/business/answer/6218037"
    }
  ];

  return (
    <AppLayout>
      <Helmet>
        <title>Intégrations Sociales - Reservatoo</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Visibilité et Croissance</h1>
          <p className="text-muted-foreground mt-1">
            Développez votre présence en ligne et augmentez vos revenus
          </p>
        </div>

        {/* Use our shared navigation component */}
        <VisibilityNavigation currentTab={currentTab} />

        <div>
          <h2 className="text-xl font-semibold mb-4">Intégrations Sociales</h2>
          <p className="text-muted-foreground mb-6">
            Connectez votre agenda avec vos réseaux sociaux pour maximiser votre visibilité
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {socialPlatforms.map((platform, index) => (
              <Card key={index} className="hover:shadow-md transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    {platform.icon}
                    <CardTitle>{platform.name}</CardTitle>
                  </div>
                  <CardDescription>{platform.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <h4 className="font-medium mb-2">Comment faire :</h4>
                  <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
                    {platform.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open(platform.link, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Voir les instructions détaillées
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Conseils pour maximiser votre présence en ligne</CardTitle>
              <CardDescription>
                Quelques bonnes pratiques pour augmenter votre visibilité sur les réseaux sociaux
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">1. Publiez régulièrement</h3>
                <p className="text-sm text-muted-foreground">
                  Maintenez une présence active en publiant du contenu pertinent au moins 3 fois par semaine.
                </p>
              </div>
              <div>
                <h3 className="font-medium">2. Mentionnez votre système de réservation</h3>
                <p className="text-sm text-muted-foreground">
                  Rappelez régulièrement à vos abonnés qu'ils peuvent réserver en ligne facilement.
                </p>
              </div>
              <div>
                <h3 className="font-medium">3. Partagez des témoignages clients</h3>
                <p className="text-sm text-muted-foreground">
                  Les avis positifs renforcent la confiance et encouragent les nouvelles réservations.
                </p>
              </div>
              <div>
                <h3 className="font-medium">4. Utilisez des hashtags pertinents</h3>
                <p className="text-sm text-muted-foreground">
                  Augmentez votre portée en utilisant des hashtags liés à votre secteur et votre localité.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
