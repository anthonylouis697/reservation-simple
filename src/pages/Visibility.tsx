
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
import { Link as LinkIcon, Star, Pencil } from "lucide-react";
import { VisibilityNavigation, useVisibilityNavigation } from "@/components/Visibility/VisibilityNavigation";
import { BookingPageCustomization } from "@/components/Visibility/BookingPage/BookingPageCustomization";
import { BookingPageProvider } from "@/components/Visibility/BookingPage/BookingPageContext";

export default function Visibility() {
  const navigate = useNavigate();
  const { currentTab } = useVisibilityNavigation();

  // Vue principale simplifiée
  const MainContent = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card key="booking-page" className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
              <Pencil className="h-6 w-6 text-indigo-500" />
            </div>
            <CardTitle>Personnalisation</CardTitle>
            <CardDescription>Personnalisez l'apparence et le contenu de votre page de réservation en ligne</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Adaptez votre page de réservation à votre image de marque avec nos options de personnalisation avancées.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => navigate("/visibility/booking-page")}
              className="w-full"
            >
              Personnaliser
            </Button>
          </CardFooter>
        </Card>

        <Card key="additional-services" className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
              <Star className="h-6 w-6 text-amber-500" />
            </div>
            <CardTitle>Boost de visibilité</CardTitle>
            <CardDescription>Augmentez votre présence en ligne avec nos services professionnels</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Des solutions clés en main pour améliorer votre visibilité en ligne et attirer plus de clients.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => navigate("/visibility/additional-services")}
              className="w-full"
            >
              Découvrir
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );

  return (
    <AppLayout>
      <Helmet>
        <title>Page de réservation - Reservatoo</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Page de réservation</h1>
          <p className="text-muted-foreground mt-1">
            Personnalisez votre page de réservation et augmentez votre visibilité en ligne
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
            <BookingPageProvider>
              <BookingPageCustomization />
            </BookingPageProvider>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
