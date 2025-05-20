
import { Helmet } from "react-helmet";
import { AppLayout } from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { VisibilityNavigation, useVisibilityNavigation } from "@/components/Visibility/VisibilityNavigation";
import { LinkShareSection } from "@/components/Visibility/BookingPage/LinkShareSection";
import { QrCodeSection } from "@/components/Visibility/BookingPage/QrCodeSection";
import { SocialNetworkSection } from "@/components/Visibility/BookingPage/SocialNetworkSection";
import { BookingPageCustomization } from "@/components/Visibility/BookingPage/BookingPageCustomization";

export default function BookingPage() {
  const { currentTab } = useVisibilityNavigation();
  const [customUrl] = useState("votre-nom");
  const bookingUrl = `https://reservatoo.com/book/${customUrl}`;

  return (
    <AppLayout>
      <Helmet>
        <title>Page de réservation - Reservatoo</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Visibilité et Croissance</h1>
          <p className="text-muted-foreground mt-1">
            Développez votre présence en ligne et augmentez vos revenus
          </p>
        </div>

        {/* Navigation tabs for Visibility section */}
        <VisibilityNavigation currentTab={currentTab} />
          
        <div>
          <h2 className="text-xl font-semibold mb-4">Page de réservation</h2>
          <p className="text-muted-foreground mb-6">
            Partagez facilement votre page de réservation avec vos clients
          </p>
        </div>
        
        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="link">Lien</TabsTrigger>
            <TabsTrigger value="qrcode">QR Code</TabsTrigger>
            <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
            <TabsTrigger value="customize">Personnaliser</TabsTrigger>
          </TabsList>
          
          <TabsContent value="link" className="space-y-4 mt-4">
            <LinkShareSection />
          </TabsContent>
          
          <TabsContent value="qrcode" className="space-y-4 mt-4">
            <QrCodeSection />
          </TabsContent>
          
          <TabsContent value="social" className="space-y-4 mt-4">
            <SocialNetworkSection bookingUrl={bookingUrl} />
          </TabsContent>
          
          <TabsContent value="customize" className="space-y-4 mt-4">
            <BookingPageCustomization />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
