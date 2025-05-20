
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Move, Type } from 'lucide-react';
import { useBookingPage } from '../BookingPageContext';
import { SortableStepList } from '../components/SortableStepList';

export function StepsTab() {
  const { 
    businessName,
    setBusinessName,
    welcomeMessage,
    setWelcomeMessage,
    bookingButtonText,
    setBookingButtonText,
    showConfirmation,
    setShowConfirmation,
    confirmationMessage,
    setConfirmationMessage,
    steps,
    setSteps
  } = useBookingPage();
  
  // Fonction pour changer l'état d'activation d'une étape
  const handleStepChange = (id: string, enabled: boolean) => {
    setSteps(steps.map(step => step.id === id ? { ...step, enabled } : step));
  };
  
  return (
    <div className="space-y-6">
      {/* Configuration des étapes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Move className="h-4 w-4" />
            Ordre des étapes
          </CardTitle>
          <CardDescription>
            Glissez-déposez pour réorganiser les étapes et activer/désactiver celles que vous souhaitez
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SortableStepList steps={steps} setSteps={setSteps} onStepChange={handleStepChange} />
        </CardContent>
      </Card>

      {/* Textes personnalisés */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Type className="h-4 w-4" />
            Textes personnalisés
          </CardTitle>
          <CardDescription>
            Personnalisez les textes de votre page de réservation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business-name">Nom de l'entreprise</Label>
            <Input 
              id="business-name" 
              value={businessName} 
              onChange={(e) => setBusinessName(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="welcome-message">Message de bienvenue</Label>
            <Textarea 
              id="welcome-message" 
              value={welcomeMessage} 
              onChange={(e) => setWelcomeMessage(e.target.value)} 
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="button-text">Texte du bouton</Label>
            <Input 
              id="button-text" 
              value={bookingButtonText} 
              onChange={(e) => setBookingButtonText(e.target.value)} 
            />
          </div>
          
          <div className="flex items-center justify-between mb-3 pt-3">
            <div>
              <Label htmlFor="show-confirmation" className="text-base">Afficher message de confirmation</Label>
              <p className="text-sm text-muted-foreground">
                Affiche un message de confirmation après la réservation
              </p>
            </div>
            <Switch 
              id="show-confirmation" 
              checked={showConfirmation} 
              onCheckedChange={setShowConfirmation} 
            />
          </div>
          
          {showConfirmation && (
            <div className="space-y-2 pl-4 border-l-2 border-primary/20">
              <Label htmlFor="confirmation-message">Message de confirmation</Label>
              <Textarea 
                id="confirmation-message" 
                value={confirmationMessage} 
                onChange={(e) => setConfirmationMessage(e.target.value)} 
                rows={2}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
