
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { getAvailabilitySettings, saveAvailabilitySettings } from '@/services/booking/availabilityService';
import { useBusiness } from '@/contexts/BusinessContext';
import type { AvailabilitySettings as AvailabilitySettingsType } from '@/services/booking/availabilityService';
import { Loader, Save, Calendar, Clock, CalendarX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RegularSchedule from '@/components/Settings/Availability/RegularSchedule';
import BlockedDates from '@/components/Settings/Availability/BlockedDates';
import SpecialDates from '@/components/Settings/Availability/SpecialDates';

const AvailabilityPage = () => {
  const { currentBusiness } = useBusiness();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<AvailabilitySettingsType | null>(null);
  const [saveError, setSaveError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  
  const loadSettings = async () => {
    if (currentBusiness?.id) {
      setLoading(true);
      setSaveError(false);
      try {
        const availabilitySettings = await getAvailabilitySettings(currentBusiness.id);
        setSettings(availabilitySettings);
        setUnsavedChanges(false);
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
  
  const handleSettingsChange = (newSettings: AvailabilitySettingsType) => {
    setSettings(newSettings);
    setUnsavedChanges(true);
  };
  
  const handleSaveSettings = async () => {
    if (!currentBusiness?.id || !settings) return;
    
    try {
      setSaving(true);
      setSaveError(false);
      
      const success = await saveAvailabilitySettings({
        ...settings,
        businessId: currentBusiness.id
      });
      
      if (!success) {
        setSaveError(true);
        toast.error("Erreur lors de l'enregistrement des paramètres.");
      } else {
        setUnsavedChanges(false);
        toast.success("Paramètres enregistrés avec succès.");
      }
    } catch (error) {
      setSaveError(true);
      console.error("Error saving availability settings:", error);
      toast.error("Erreur lors de l'enregistrement des paramètres.");
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <Helmet>
        <title>Gestion des disponibilités - Reservatoo</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gestion des disponibilités</h1>
            <p className="text-muted-foreground">
              Définissez vos heures de disponibilité et paramètres pour les réservations.
            </p>
          </div>
          
          <div className="flex gap-3">
            {saveError && (
              <button 
                onClick={loadSettings} 
                className="text-sm gap-2 flex items-center text-primary hover:underline"
                disabled={loading}
              >
                {loading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Loader className="h-4 w-4" />
                )}
                Rafraîchir les données
              </button>
            )}
            
            <Button
              onClick={handleSaveSettings}
              disabled={saving || loading || !unsavedChanges}
              className="gap-2"
            >
              {saving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Enregistrer
            </Button>
          </div>
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
          <Tabs defaultValue="regular" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="regular" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Horaires réguliers</span>
              </TabsTrigger>
              <TabsTrigger value="blocked" className="flex items-center gap-2">
                <CalendarX className="h-4 w-4" />
                <span>Jours bloqués</span>
              </TabsTrigger>
              <TabsTrigger value="special" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Horaires spéciaux</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="regular">
              <RegularSchedule 
                settings={settings} 
                onSettingsChange={handleSettingsChange} 
              />
            </TabsContent>

            <TabsContent value="blocked">
              <BlockedDates 
                settings={settings} 
                onSettingsChange={handleSettingsChange} 
              />
            </TabsContent>

            <TabsContent value="special">
              <SpecialDates 
                settings={settings} 
                onSettingsChange={handleSettingsChange} 
              />
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardContent className="py-6 flex justify-center">
              <div className="text-center">
                <div className="text-lg font-medium">Aucun paramètre trouvé</div>
                <p className="text-muted-foreground mt-1">
                  Impossible de charger vos paramètres de disponibilité.
                </p>
                <button 
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  onClick={() => window.location.reload()}
                >
                  Réessayer
                </button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Status footer */}
        {settings && (
          <div className="flex justify-end text-sm text-muted-foreground">
            {unsavedChanges ? (
              <span className="text-amber-600">Modifications non enregistrées</span>
            ) : (
              <span>Tous les changements sont enregistrés</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityPage;
