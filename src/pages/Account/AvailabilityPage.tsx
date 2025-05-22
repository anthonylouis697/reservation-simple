
import React, { useState, useEffect } from 'react';
import AccountLayout from '@/components/Account/AccountLayout';
import { Helmet } from 'react-helmet';
import AvailabilitySettings from '@/components/Settings/AvailabilitySettings';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { getAvailabilitySettings, saveAvailabilitySettings } from '@/services/booking/availabilityService';
import { useBusiness } from '@/contexts/BusinessContext';
import type { AvailabilitySettings as AvailabilitySettingsType } from '@/services/booking/availabilityService';

const AvailabilityPage = () => {
  const { currentBusiness } = useBusiness();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<AvailabilitySettingsType | null>(null);
  const [saveError, setSaveError] = useState(false);
  
  const loadSettings = async () => {
    if (currentBusiness?.id) {
      setLoading(true);
      setSaveError(false);
      try {
        const availabilitySettings = await getAvailabilitySettings(currentBusiness.id);
        setSettings(availabilitySettings);
      } catch (error) {
        console.error("Error loading availability settings:", error);
        toast.error("Impossible de charger les paramètres de disponibilité.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadSettings();
  }, [currentBusiness]);
  
  const handleSettingsChange = async (newSettings: AvailabilitySettingsType) => {
    if (!currentBusiness?.id) return;
    
    setSettings(newSettings);
    
    // Auto-save changes with debounce
    try {
      const success = await saveAvailabilitySettings({
        ...newSettings,
        businessId: currentBusiness.id
      });
      
      if (!success) {
        setSaveError(true);
        toast.error("Erreur lors de l'enregistrement des paramètres.");
      } else {
        setSaveError(false);
      }
    } catch (error) {
      setSaveError(true);
      console.error("Error saving availability settings:", error);
      toast.error("Erreur lors de l'enregistrement des paramètres.");
    }
  };
  
  return (
    <AccountLayout>
      <Helmet>
        <title>Gestion des disponibilités - Reservatoo</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Gestion des disponibilités</h1>
          <p className="text-muted-foreground">
            Définissez vos heures de disponibilité et paramètres pour les réservations.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Vos modifications sont automatiquement enregistrées.
          </p>
          {saveError && (
            <div className="flex justify-end mt-2">
              <button 
                onClick={loadSettings} 
                className="text-sm text-primary hover:underline"
              >
                Rafraîchir les données
              </button>
            </div>
          )}
        </div>
        
        {loading ? (
          <Card>
            <CardContent className="py-10">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
              </div>
            </CardContent>
          </Card>
        ) : settings ? (
          <AvailabilitySettings
            initialSettings={settings}
            onChange={handleSettingsChange}
          />
        ) : (
          <Card>
            <CardContent className="py-6 flex justify-center">
              <div className="text-center">
                <div className="text-lg font-medium">Aucun paramètre trouvé</div>
                <p className="text-muted-foreground mt-1">
                  Impossible de charger vos paramètres de disponibilité.
                </p>
                <button 
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  onClick={() => window.location.reload()}
                >
                  Réessayer
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AccountLayout>
  );
};

export default AvailabilityPage;
