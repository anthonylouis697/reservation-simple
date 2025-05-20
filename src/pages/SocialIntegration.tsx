
import { Helmet } from "react-helmet";
import { AppLayout } from "@/components/AppLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { 
  Alert,
  AlertDescription,
  AlertTitle 
} from "@/components/ui/alert";
import { Copy, ExternalLink, Info, Facebook, Instagram, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SocialIntegration() {
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Code copié!",
      description: "Le code a été copié dans le presse-papier.",
    });
  };

  const integrations = [
    {
      name: "Facebook",
      icon: <Facebook className="h-6 w-6 text-blue-600" />,
      description: "Ajoutez un bouton de réservation sur votre page Facebook",
      instructions: [
        "Connectez-vous à votre page Facebook",
        "Cliquez sur 'Modifier les informations' sous la photo de couverture",
        "Cliquez sur 'Ajouter un bouton'",
        "Sélectionnez 'Prendre rendez-vous'",
        "Entrez l'URL de votre page de réservation",
        "Cliquez sur 'Enregistrer'"
      ],
      link: "https://www.facebook.com/business/help/327029232278948",
      embedCode: null
    },
    {
      name: "Instagram",
      icon: <Instagram className="h-6 w-6 text-pink-600" />,
      description: "Ajoutez un lien de réservation à votre bio Instagram",
      instructions: [
        "Ouvrez Instagram et allez sur votre profil",
        "Cliquez sur 'Modifier le profil'",
        "Collez l'URL de votre page de réservation dans 'Site web'",
        "Mentionnez dans votre bio que les clients peuvent prendre rendez-vous via le lien",
        "Enregistrez vos modifications"
      ],
      link: "https://help.instagram.com/1791090447643166",
      embedCode: null
    },
    {
      name: "Site web",
      icon: <ExternalLink className="h-6 w-6 text-indigo-600" />,
      description: "Intégrez un widget de réservation sur votre site web",
      instructions: [
        "Copiez le code d'intégration ci-dessous",
        "Collez ce code dans votre site web où vous souhaitez que le widget apparaisse",
        "Personnalisez les couleurs et la taille selon vos besoins"
      ],
      link: null,
      embedCode: `<iframe src="https://reservatoo.com/embed/votre-nom" width="100%" height="600" frameborder="0"></iframe><script src="https://reservatoo.com/js/embed.js"></script>`
    }
  ];

  return (
    <AppLayout>
      <Helmet>
        <title>Intégrations sociales - Reservatoo</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Intégrations sociales</h1>
          <p className="text-muted-foreground mt-1">
            Intégrez votre agenda sur vos réseaux sociaux et votre site web
          </p>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Astuce</AlertTitle>
          <AlertDescription>
            Intégrer votre système de réservation sur vos réseaux sociaux peut augmenter vos réservations jusqu'à 30%.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, index) => (
            <Card key={index} className="hover:shadow-md transition-all">
              <CardHeader>
                <div className="flex items-center gap-2">
                  {integration.icon}
                  <CardTitle>{integration.name}</CardTitle>
                </div>
                <CardDescription>{integration.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="instructions">
                    <AccordionTrigger>Instructions</AccordionTrigger>
                    <AccordionContent className="space-y-2 pt-2">
                      <ol className="list-decimal pl-4 space-y-1 text-sm">
                        {integration.instructions.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                      
                      {integration.embedCode && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-1">Code d'intégration:</p>
                          <div className="p-3 bg-muted rounded-md relative">
                            <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                              {integration.embedCode}
                            </pre>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="absolute top-2 right-2"
                              onClick={() => handleCopy(integration.embedCode!)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter className="flex justify-between">
                {integration.embedCode && (
                  <Button variant="outline" onClick={() => handleCopy(integration.embedCode!)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copier le code
                  </Button>
                )}
                
                {integration.link && (
                  <Button onClick={() => window.open(integration.link!, '_blank')}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Voir le guide
                  </Button>
                )}
                
                {!integration.link && !integration.embedCode && (
                  <Button disabled>
                    Bientôt disponible
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Besoin d'aide pour l'intégration?</CardTitle>
            <CardDescription>
              Notre équipe peut vous aider à mettre en place ces intégrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="default">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Service d'intégration personnalisée</AlertTitle>
              <AlertDescription>
                Nos experts peuvent configurer votre système de réservation sur tous vos canaux numériques pour seulement 49€. Ce service inclut l'intégration sur votre site web, vos réseaux sociaux et votre fiche Google.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              Demander une intégration personnalisée
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
