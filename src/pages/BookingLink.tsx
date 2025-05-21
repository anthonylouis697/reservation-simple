
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { AppLayout } from "@/components/AppLayout";
import { useBusiness } from "@/contexts/BusinessContext";
import { LinkShareSection } from "@/components/Visibility/BookingPage/LinkShareSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BookingLink() {
  const { currentBusiness } = useBusiness();
  const navigate = useNavigate();
  
  const bookingUrl = currentBusiness?.slug 
    ? `${window.location.origin}/booking/${currentBusiness.slug}` 
    : null;
    
  const handleOpenPreview = () => {
    if (bookingUrl) {
      window.open(bookingUrl, '_blank');
    }
  };
  
  const handleGoToPersonalization = () => {
    navigate('/booking-page');
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Lien de réservation - Reservatoo</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Lien de réservation</h1>
          <p className="text-muted-foreground mt-1">
            Partagez votre lien de réservation avec vos clients
          </p>
        </div>
        
        {!currentBusiness?.slug ? (
          <Card>
            <CardHeader>
              <CardTitle>Configuration requise</CardTitle>
              <CardDescription>
                Vous devez d'abord configurer les informations de votre entreprise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/settings/business')}>
                Configurer mon entreprise
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Votre lien de réservation</CardTitle>
                <CardDescription>
                  Utilisez ce lien pour permettre à vos clients de réserver directement en ligne
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-md flex items-center justify-between mb-4">
                  <div className="font-mono text-sm truncate">{bookingUrl}</div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={handleOpenPreview} className="flex-1">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Voir ma page de réservation
                  </Button>
                  <Button onClick={handleGoToPersonalization} variant="outline" className="flex-1">
                    Personnaliser ma page
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <LinkShareSection />
          </>
        )}
      </div>
    </AppLayout>
  );
}
