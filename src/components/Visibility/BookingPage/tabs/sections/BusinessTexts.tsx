
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useBookingPage } from '../../BookingPageContext';

export function BusinessTexts() {
  const { 
    businessName,
    setBusinessName,
    welcomeMessage,
    setWelcomeMessage,
    bookingButtonText,
    setBookingButtonText,
  } = useBookingPage();

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-medium">Textes principaux</Label>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business-name">Nom de l'entreprise</Label>
              <Input
                id="business-name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Votre entreprise"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="welcome-message">Message de bienvenue</Label>
              <Input
                id="welcome-message"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                placeholder="Bienvenue sur notre page de réservation"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="booking-button">Texte du bouton de réservation</Label>
              <Input
                id="booking-button"
                value={bookingButtonText}
                onChange={(e) => setBookingButtonText(e.target.value)}
                placeholder="Réserver maintenant"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
