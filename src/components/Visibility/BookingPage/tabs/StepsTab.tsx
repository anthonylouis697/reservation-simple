
import { useBookingPage } from '../BookingPageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { SortableStepList } from '../components/SortableStepList';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { toast } from 'sonner';

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

  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [tempStepName, setTempStepName] = useState<string>('');
  
  // Démarrer l'édition d'un label
  const startEditing = (stepId: string, currentName: string) => {
    setEditingStepId(stepId);
    setTempStepName(currentName);
  };
  
  // Valider l'édition d'un label
  const saveStepName = () => {
    if (editingStepId) {
      updateStepLabel(editingStepId, tempStepName);
      setEditingStepId(null);
      setTempStepName('');
      toast.success('Nom de l\'étape mis à jour');
    }
  };
  
  // Annuler l'édition
  const cancelEditing = () => {
    setEditingStepId(null);
    setTempStepName('');
  };

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
              renderStep={(step) => (
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="text-primary mt-0.5">
                      {step.icon}
                    </div>
                    {editingStepId === step.id ? (
                      <div className="flex gap-2 items-center">
                        <Input
                          value={tempStepName}
                          onChange={(e) => setTempStepName(e.target.value)}
                          className="h-8 w-48"
                          autoFocus
                        />
                        <button
                          onClick={saveStepName}
                          className="text-green-600 hover:bg-green-50 p-1 rounded-full"
                          title="Valider"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-red-600 hover:bg-red-50 p-1 rounded-full"
                          title="Annuler"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>{step.customLabel || step.name}</span>
                        <button
                          onClick={() => startEditing(step.id, step.customLabel || step.name)}
                          className="text-muted-foreground hover:text-primary p-1 rounded-full hover:bg-muted"
                          title="Modifier le nom"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <Switch
                    checked={step.enabled}
                    onCheckedChange={(checked) => handleStepChange(step.id, checked)}
                  />
                </div>
              )}
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
        </CardContent>
      </Card>
    </div>
  );
}
