
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
import { Link, useNavigate } from "react-router-dom";
import { Link as LinkIcon, Share, Star, DollarSign, Globe, Pencil } from "lucide-react";

export default function Visibility() {
  const navigate = useNavigate();
  
  const visibilityOptions = [
    {
      title: "Page de réservation",
      description: "Personnalisez votre page de réservation et partagez-la avec vos clients",
      icon: <LinkIcon className="h-6 w-6 text-indigo-500" />,
      href: "/visibility/booking-page",
      color: "bg-indigo-100"
    },
    {
      title: "Intégrations sociales",
      description: "Intégrez votre agenda sur vos réseaux sociaux et votre site web",
      icon: <Share className="h-6 w-6 text-purple-500" />,
      href: "/visibility/social-integration",
      color: "bg-purple-100"
    },
    {
      title: "Boost de visibilité",
      description: "Augmentez votre visibilité sur les plateformes partenaires",
      icon: <Star className="h-6 w-6 text-amber-500" />,
      href: "/visibility-boost",
      color: "bg-amber-100"
    }
  ];
  
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
        <title>Visibilité - Reservatoo</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Visibilité et Croissance</h1>
          <p className="text-muted-foreground mt-1">
            Développez votre présence en ligne et augmentez vos revenus
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {visibilityOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center mb-2`}>
                  {option.icon}
                </div>
                <CardTitle>{option.title}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  onClick={() => navigate(option.href)}
                  className="w-full"
                >
                  Accéder
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-green-600" />
            Services additionnels
          </h2>
          
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
                    <CardFooter>
                      <Button 
                        onClick={() => navigate("/visibility/additional-services")}
                        className="w-full"
                      >
                        En savoir plus
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button 
                onClick={() => navigate("/visibility/additional-services")}
                variant="outline"
                size="lg"
              >
                Voir tous les services disponibles
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
