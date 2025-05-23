
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Paintbrush, Save, Check } from 'lucide-react';
import { toast } from 'sonner';

import { CustomizeTab } from './tabs/CustomizeTab';
import { PreviewPanel } from './preview/PreviewPanel';
import { useBookingPage } from './BookingPageContext';

export function BookingPageCustomization() {
  const [saved, setSaved] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const { saveBookingPageSettings } = useBookingPage();
  
  // Save changes handler
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveBookingPageSettings();
      toast.success("Configuration sauvegardée avec succès");
      setSaved(true);
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'enregistrement");
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Reset saved state when something changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSaved(false);
    }, 500);
    
    return () => clearTimeout(timeout);
  }, []);
  
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Paintbrush className="h-5 w-5 text-primary" />
          Personnalisation de votre page de réservation
        </CardTitle>
        <CardDescription>
          Créez une expérience de réservation unique adaptée à votre image de marque
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-6 animate-in fade-in-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomizeTab />
            <PreviewPanel />
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-muted-foreground">
            {saved ? (
              <span className="flex items-center gap-1 text-green-600">
                <Check className="h-4 w-4" />
                Toutes les modifications sont sauvegardées
              </span>
            ) : (
              <span>Des modifications sont en attente de sauvegarde</span>
            )}
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || saved}
            className="gap-2"
          >
            {isSaving ? (
              <>Enregistrement...</>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Enregistrer les modifications
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
