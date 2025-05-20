
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Move, Type, Check, CheckCheck, ArrowUp } from 'lucide-react';
import { useBookingPage } from '../BookingPageContext';
import { SortableStepList } from '../components/SortableStepList';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
  
  const [hasSaved, setHasSaved] = useState(false);
  
  // Fonction pour changer l'état d'activation d'une étape
  const handleStepChange = (id: string, enabled: boolean) => {
    setSteps(steps.map(step => step.id === id ? { ...step, enabled } : step));
    setHasSaved(false);
    
    // Show toast to indicate change
    if (enabled) {
      toast.success(`Étape "${steps.find(s => s.id === id)?.name}" activée`);
    } else {
      toast.info(`Étape "${steps.find(s => s.id === id)?.name}" désactivée`);
    }
  };
  
  // Handle save changes
  const handleSave = () => {
    setHasSaved(true);
    toast.success("Configuration sauvegardée avec succès");
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
            Personnalisez l'expérience de réservation en gérant les étapes que vos clients devront suivre
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="business-name" className="flex items-center gap-1">
                Nom de l'entreprise
                <div className="text-xs text-primary bg-primary/10 rounded-full px-2 py-0.5">Obligatoire</div>
              </Label>
              <Input 
                id="business-name" 
                value={businessName} 
                onChange={(e) => setBusinessName(e.target.value)} 
                className="transition-all border-primary/30 focus-visible:border-primary/50"
                placeholder="Nom de votre entreprise"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="button-text" className="flex items-center gap-1">
                Texte du bouton
                <div className="text-xs text-primary bg-primary/10 rounded-full px-2 py-0.5">Obligatoire</div>
              </Label>
              <Input 
                id="button-text" 
                value={bookingButtonText} 
                onChange={(e) => setBookingButtonText(e.target.value)} 
                className="transition-all border-primary/30 focus-visible:border-primary/50"
                placeholder="Réserver maintenant"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="welcome-message" className="flex items-center gap-1">
              Message de bienvenue
              <div className="text-xs text-primary bg-primary/10 rounded-full px-2 py-0.5">Obligatoire</div>
            </Label>
            <Textarea 
              id="welcome-message" 
              value={welcomeMessage} 
              onChange={(e) => setWelcomeMessage(e.target.value)} 
              rows={2}
              className="transition-all border-primary/30 focus-visible:border-primary/50"
              placeholder="Bienvenue sur notre page de réservation"
            />
          </div>
          
          <div 
            className={cn(
              "flex items-center justify-between p-4 rounded-lg border transition-all",
              showConfirmation ? "bg-primary/5 border-primary/20" : "bg-background"
            )}
          >
            <div>
              <Label htmlFor="show-confirmation" className="text-base">Message de confirmation</Label>
              <p className="text-sm text-muted-foreground">
                Affiche un message de remerciement après la réservation
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
              <Label htmlFor="confirmation-message">Texte du message de confirmation</Label>
              <Textarea 
                id="confirmation-message" 
                value={confirmationMessage} 
                onChange={(e) => setConfirmationMessage(e.target.value)} 
                rows={3}
                className="transition-all"
                placeholder="Merci pour votre réservation ! Nous avons bien reçu votre demande."
              />
              <div className="text-xs flex items-center gap-1 text-muted-foreground">
                <CheckCheck className="h-3 w-3" />
                <span>Ce message sera affiché après que le client ait complété sa réservation</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {hasSaved ? (
            <span className="flex items-center gap-1 text-green-600">
              <Check className="h-4 w-4" />
              Modifications sauvegardées
            </span>
          ) : (
            <span>Modifications non sauvegardées</span>
          )}
        </div>
        <Button 
          onClick={handleSave}
          className="gap-2"
        >
          <ArrowUp className="h-4 w-4" />
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
}
