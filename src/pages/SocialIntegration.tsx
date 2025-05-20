
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
import { useVisibilityNavigation, VisibilityNavigation } from "@/components/Visibility/VisibilityNavigation";
import { Share, Copy, ExternalLink, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SocialIntegration() {
  const { toast } = useToast();
  const { currentTab } = useVisibilityNavigation();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Code copié!",
      description: "Le code a été copié dans le presse-papier."
    });
  };

  const platforms = [
    {
      id: "facebook",
      name: "Facebook",
      icon: "🔵",
      description: "Intégrez votre widget de réservation à votre page Facebook"
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: "📸",
      description: "Ajoutez un lien de réservation à votre profil Instagram"
    },
    {
      id: "google",
      name: "Google Business",
      icon: "🔍",
      description: "Activez les réservations sur votre fiche Google"
    },
    {
      id: "website",
      name: "Site web",
      icon: "🌐",
      description: "Intégrez le widget de réservation sur votre site"
    }
  ];

  const integrationCode = `<div id="reservatoo-booking-widget" data-merchant-id="YOUR_ID"></div>
<script src="https://reservatoo.com/widgets/booking.js"></script>`;

  return (
    <AppLayout>
      <Helmet>
        <title>Intégrations sociales - Reservatoo</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Visibilité et Croissance</h1>
          <p className="text-muted-foreground mt-1">
            Développez votre présence en ligne et augmentez vos revenus
          </p>
        </div>

        <VisibilityNavigation currentTab={currentTab} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold">Plateformes</h2>
            <div className="space-y-2">
              {platforms.map((platform) => (
                <Card 
                  key={platform.id}
                  className={`cursor-pointer transition-all ${selectedPlatform === platform.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedPlatform(platform.id)}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span>{platform.icon}</span> {platform.name}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {platform.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedPlatform ? 
                    `Intégration ${platforms.find(p => p.id === selectedPlatform)?.name}` :
                    "Sélectionnez une plateforme"
                  }
                </CardTitle>
                <CardDescription>
                  {selectedPlatform ? 
                    "Suivez les instructions ci-dessous pour intégrer votre widget de réservation" :
                    "Cliquez sur une plateforme dans la liste à gauche pour voir les instructions"
                  }
                </CardDescription>
              </CardHeader>
              
              {selectedPlatform && (
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">1. Copiez le code d'intégration</h3>
                    <div className="bg-muted p-4 rounded-md relative">
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                        {integrationCode}
                      </pre>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => handleCopy(integrationCode)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="outline" onClick={() => handleCopy(integrationCode)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copier le code
                    </Button>
                  </div>
                  
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-medium">2. Suivez les instructions spécifiques à la plateforme</h3>
                    <ol className="list-decimal list-inside space-y-3 text-sm">
                      <li>Connectez-vous à votre compte {platforms.find(p => p.id === selectedPlatform)?.name}</li>
                      <li>Accédez aux paramètres de votre page ou profil</li>
                      <li>Recherchez l'option d'intégration ou de bouton de réservation</li>
                      <li>Collez le code d'intégration ou configurez votre lien de réservation</li>
                      <li>Enregistrez vos modifications</li>
                    </ol>
                    
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Voir le tutoriel complet
                    </Button>
                  </div>
                  
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md flex items-start gap-3">
                    <span className="rounded-full bg-green-100 p-1.5 text-green-700">
                      <Check className="h-4 w-4" />
                    </span>
                    <div className="text-sm text-green-800">
                      <p className="font-medium">Conseil professionnel</p>
                      <p className="mt-1">Ajoutez votre widget de réservation à plusieurs endroits pour maximiser les chances que vos clients le trouvent facilement.</p>
                    </div>
                  </div>
                </CardContent>
              )}
              
              {!selectedPlatform && (
                <CardContent className="py-8">
                  <div className="flex flex-col items-center justify-center text-center space-y-3">
                    <Share className="h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">Sélectionnez une plateforme pour voir les instructions d'intégration</p>
                  </div>
                </CardContent>
              )}
              
              {selectedPlatform && (
                <CardFooter className="border-t pt-4">
                  <Button className="ml-auto">
                    <Check className="h-4 w-4 mr-2" />
                    Marquer comme configuré
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
