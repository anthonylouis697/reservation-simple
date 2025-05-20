
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
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Link as LinkIcon, Share, Star, DollarSign, Globe, Pencil } from "lucide-react";
import { VisibilityNavigation, useVisibilityNavigation } from "@/components/Visibility/VisibilityNavigation";
import { BookingPageCustomization } from "@/components/Visibility/BookingPage/BookingPageCustomization";

export default function Visibility() {
  const navigate = useNavigate();
  const { currentTab } = useVisibilityNavigation();
  
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

  // Vue principale
  const MainContent = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card key="booking-page" className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
              <LinkIcon className="h-6 w-6 text-indigo-500" />
            </div>
            <CardTitle>Page de réservation</CardTitle>
            <CardDescription>Personnalisez votre page de réservation et partagez-la avec vos clients</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              onClick={() => navigate("/visibility/booking-page")}
              className="w-full"
            >
              Personnaliser
            </Button>
          </CardFooter>
        </Card>

        <Card key="social-integration" className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
              <Share className="h-6 w-6 text-purple-500" />
            </div>
            <CardTitle>Intégrations sociales</CardTitle>
            <CardDescription>Intégrez votre agenda sur vos réseaux sociaux et votre site web</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              onClick={() => navigate("/visibility/social-integration")}
              className="w-full"
            >
              Configurer
            </Button>
          </CardFooter>
        </Card>

        <Card key="visibility-boost" className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
              <Star className="h-6 w-6 text-amber-500" />
            </div>
            <CardTitle>Boost de visibilité</CardTitle>
            <CardDescription>Augmentez votre visibilité sur les plateformes partenaires</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              onClick={() => navigate("/visibility-boost")}
              className="w-full"
            >
              Explorer
            </Button>
          </CardFooter>
        </Card>
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
    </>
  );

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

        {/* Navigation */}
        <VisibilityNavigation currentTab={currentTab} />

        {/* Contenu selon l'onglet sélectionné */}
        <Tabs value={currentTab} defaultValue="main">
          <TabsContent value="main">
            <MainContent />
          </TabsContent>
          
          <TabsContent value="booking-page">
            <BookingPageCustomization />
          </TabsContent>
          
          {/* Autres onglets restent inchangés */}
        </Tabs>
      </div>
    </AppLayout>
  );
}
