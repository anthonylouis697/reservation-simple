
import { useBookingPage } from '../BookingPageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { SortableStepList } from '../components/SortableStepList';
import { Badge } from '@/components/ui/badge';
import { CustomTextsEditor } from '../components/CustomTextsEditor';

export function StepsTab() {
  const {
    steps,
    setSteps,
    handleStepChange,
    bookingButtonText,
    setBookingButtonText,
    showConfirmation,
    setShowConfirmation,
    confirmationMessage,
    setConfirmationMessage,
    updateStepLabel,
  } = useBookingPage();

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Étapes de réservation</Label>
              <Badge variant="outline">Glissez pour réorganiser</Badge>
            </div>

            <SortableStepList
              steps={steps}
              setSteps={setSteps}
              onStepChange={handleStepChange}
              onEditLabel={updateStepLabel}
            />
          </div>
          
          <div className="bg-accent/20 p-4 rounded-lg space-y-4">
            <div className="space-y-2">
              <Label htmlFor="booking-button-text" className="text-sm">
                Texte du bouton de réservation
              </Label>
              <Input 
                id="booking-button-text"
                value={bookingButtonText}
                onChange={(e) => setBookingButtonText(e.target.value)}
                placeholder="Réserver maintenant"
                className="max-w-md"
              />
            </div>

            <div className="flex items-center space-x-4">
              <Switch
                id="show-confirmation"
                checked={showConfirmation}
                onCheckedChange={setShowConfirmation}
              />
              <Label htmlFor="show-confirmation" className="font-medium text-sm">
                Afficher une confirmation
              </Label>
            </div>

            {showConfirmation && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="confirmation-message" className="text-sm">
                  Message de confirmation
                </Label>
                <Input
                  id="confirmation-message"
                  value={confirmationMessage}
                  onChange={(e) => setConfirmationMessage(e.target.value)}
                  placeholder="Merci pour votre réservation !"
                  className="max-w-md"
                />
              </div>
            )}
          </div>
          
          <CustomTextsEditor />
        </CardContent>
      </Card>
    </div>
  );
}
