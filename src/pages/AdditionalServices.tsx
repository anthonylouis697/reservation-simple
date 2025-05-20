
import { Helmet } from "react-helmet";
import { AppLayout } from "@/components/AppLayout";
import { VisibilityNavigation, useVisibilityNavigation } from "@/components/Visibility/VisibilityNavigation";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link as LinkIcon, Share, Star, DollarSign, Globe, Pencil } from "lucide-react";

export default function AdditionalServices() {
  const { currentTab } = useVisibilityNavigation();

  const handleServiceRequest = (serviceName: string) => {
    toast.success(`Votre demande pour le service "${serviceName}" a été envoyée. Nous vous contacterons rapidement.`);
  };
  
  const handleServiceInfo = (serviceName: string) => {
    toast.info(`Des informations détaillées sur "${serviceName}" vous ont été envoyées par email.`);
  };

  const additionalServices = [
    {
      title: "Création Fiche Google",
      description: "Créez une fiche Google My Business optimisée pour votre entreprise",
      icon: <Globe className="h-6 w-6 text-blue-500" />,
      price: "299€",
      color: "bg-blue-100"
    },
    {
      title: "Boost local Google",
      description: "Optimisez votre référencement local sur Google",
      icon: <Star className="h-6 w-6 text-green-500" />,
      price: "199€/mois",
      color: "bg-green-100"
    },
    {
      title: "Réparation Fiche Google",
      description: "Résolution des problèmes et optimisation de votre fiche existante",
      icon: <Globe className="h-6 w-6 text-orange-500" />,
      price: "149€",
      color: "bg-orange-100"
    },
    {
      title: "Création de site web",
      description: "Site internet sur mesure adapté à votre activité",
      icon: <Pencil className="h-6 w-6 text-rose-500" />,
      price: "À partir de 499€",
      color: "bg-rose-100"
    }
  ];

  return (
    <AppLayout>
      <Helmet>
        <title>Boost de visibilité - Reservatoo</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Page de réservation</h1>
          <p className="text-muted-foreground mt-1">
            Personnalisez votre page de réservation et augmentez votre visibilité en ligne
          </p>
        </div>

        {/* Use our shared navigation component */}
        <VisibilityNavigation currentTab={currentTab} />

        <div>
          <h2 className="text-xl font-semibold mb-4">Boost de visibilité</h2>
          <p className="text-muted-foreground mb-6">
            Augmentez votre présence en ligne et gagnez de nouveaux clients avec nos services professionnels
          </p>
          
          <Card>
            <CardHeader>
              <CardTitle>Boostez votre activité avec nos services professionnels</CardTitle>
              <CardDescription>
                Des solutions clés en main pour augmenter votre visibilité et vos revenus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {additionalServices.map((service, index) => (
                  <Card key={index} className="border-2 hover:border-primary transition-all">
                    <CardHeader className="pb-2">
                      <div className={`w-12 h-12 rounded-full ${service.color} flex items-center justify-center`}>
                        {service.icon}
                      </div>
                      <CardTitle className="text-lg mt-1">{service.title}</CardTitle>
                      <CardDescription className="h-12">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="font-bold text-lg text-primary">{service.price}</div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                      <Button 
                        onClick={() => handleServiceRequest(service.title)}
                        className="w-full"
                      >
                        Demander ce service
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleServiceInfo(service.title)}
                        className="w-full"
                      >
                        Plus d'informations
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="w-full space-y-4">
                <h3 className="text-lg font-medium">Contactez-nous pour un accompagnement personnalisé</h3>
                <p className="text-muted-foreground">
                  Notre équipe est à votre disposition pour vous conseiller et vous proposer la solution la plus adaptée à vos besoins.
                </p>
                <Button 
                  size="lg"
                  onClick={() => toast.success("Notre équipe vous contactera dans les plus brefs délais.")}
                  className="w-full md:w-auto"
                >
                  Demander un rendez-vous conseil gratuit
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
