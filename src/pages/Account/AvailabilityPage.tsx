
import React, { useState, useEffect } from 'react';
import { AccountLayout } from '@/components/Account/AccountLayout';
import { Helmet } from 'react-helmet';
import { AvailabilitySettings } from '@/components/Settings/AvailabilitySettings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { getAvailabilitySettings, saveAvailabilitySettings } from '@/services/booking/availabilityService';
import { useBusinesses } from '@/hooks/useBusinesses';
import type { AvailabilitySettings as AvailabilitySettingsType, DaySchedule, TimeSlot } from '@/services/booking/availabilityService';

const AvailabilityPage = () => {
  const { currentBusiness } = useBusinesses();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<AvailabilitySettingsType | null>(null);
  
  useEffect(() => {
    const loadSettings = async () => {
      if (currentBusiness?.id) {
        setLoading(true);
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
    
    loadSettings();
  }, [currentBusiness]);
  
  const handleSaveSettings = async (updatedSettings: AvailabilitySettingsType) => {
    if (!currentBusiness?.id) return;
    
    setSaving(true);
    try {
      const success = await saveAvailabilitySettings({
        ...updatedSettings,
        businessId: currentBusiness.id
      });
      
      if (success) {
        toast.success("Paramètres de disponibilité enregistrés avec succès.");
      } else {
        toast.error("Erreur lors de l'enregistrement des paramètres.");
      }
    } catch (error) {
      console.error("Error saving availability settings:", error);
      toast.error("Erreur lors de l'enregistrement des paramètres.");
    } finally {
      setSaving(false);
    }
  };
  
  const handleSettingsChange = (newSettings: AvailabilitySettingsType) => {
    setSettings(newSettings);
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
          <>
            <AvailabilitySettings
              initialSettings={settings}
              onChange={handleSettingsChange}
            />
            
            <div className="flex justify-end mt-6">
              <Button 
                onClick={() => handleSaveSettings(settings)}
                disabled={saving}
              >
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </div>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Aucun paramètre trouvé</CardTitle>
              <CardDescription>
                Impossible de charger vos paramètres de disponibilité.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.reload()}>
                Réessayer
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AccountLayout>
  );
};

export default AvailabilityPage;
