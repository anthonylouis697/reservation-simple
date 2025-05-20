
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { BookingPageSettings } from '@/components/Visibility/BookingPage/types';
import { useAuth } from '@/contexts/AuthContext';
import { defaultSteps, defaultCustomTexts } from '@/components/Visibility/BookingPage/constants/defaultData';

export const useBookingPageSettings = (businessId?: string) => {
  const [settings, setSettings] = useState<BookingPageSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Charger les paramètres de la page de réservation
  useEffect(() => {
    const loadSettings = async () => {
      if (!businessId) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('booking_page_settings')
          .select('*')
          .eq('business_id', businessId)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // Aucun paramètre trouvé, créer des paramètres par défaut
            return createDefaultSettings(businessId);
          } else {
            console.error('Erreur lors du chargement des paramètres:', error);
            setError(error.message);
          }
        } else if (data) {
          setSettings({
            ...data,
            steps: data.steps || defaultSteps,
            customTexts: data.custom_texts || defaultCustomTexts
          });
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError('Une erreur est survenue lors du chargement des paramètres.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [businessId]);

  // Créer des paramètres par défaut si aucun n'existe
  const createDefaultSettings = async (businessId: string) => {
    try {
      const defaultSettings: Partial<BookingPageSettings> = {
        business_id: businessId,
        selected_template: 'standard',
        primary_color: '#4f46e5',
        secondary_color: '#ffffff',
        button_corners: 'rounded',
        welcome_message: 'Bienvenue sur notre page de réservation',
        booking_button_text: 'Réserver',
        show_confirmation: true,
        layout_type: 'stepped',
        steps: defaultSteps,
        custom_texts: defaultCustomTexts
      };

      const { data, error } = await supabase
        .from('booking_page_settings')
        .insert(defaultSettings)
        .select('*')
        .single();

      if (error) {
        console.error('Erreur lors de la création des paramètres par défaut:', error);
        setError(error.message);
      } else if (data) {
        setSettings({
          ...data,
          steps: data.steps || defaultSteps,
          customTexts: data.custom_texts || defaultCustomTexts
        });
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur est survenue lors de la création des paramètres par défaut.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sauvegarder les paramètres
  const saveSettings = async (updatedSettings: Partial<BookingPageSettings>) => {
    if (!businessId || !user) {
      toast.error('Vous devez être connecté pour sauvegarder les paramètres.');
      return;
    }

    try {
      // Formater les données pour Supabase
      const formattedSettings = {
        business_id: businessId,
        selected_template: updatedSettings.selectedTemplate,
        primary_color: updatedSettings.primaryColor,
        secondary_color: updatedSettings.secondaryColor,
        button_corners: updatedSettings.buttonCorners,
        welcome_message: updatedSettings.welcomeMessage,
        business_name: updatedSettings.businessName,
        logo: updatedSettings.logo,
        custom_url: updatedSettings.customUrl,
        booking_button_text: updatedSettings.bookingButtonText,
        show_confirmation: updatedSettings.showConfirmation,
        confirmation_message: updatedSettings.confirmationMessage,
        layout_type: updatedSettings.layoutType,
        steps: updatedSettings.steps,
        custom_texts: updatedSettings.customTexts
      };

      const { error } = await supabase
        .from('booking_page_settings')
        .upsert(formattedSettings)
        .eq('business_id', businessId);

      if (error) {
        throw error;
      }

      toast.success('Paramètres sauvegardés avec succès !');
      return true;
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
      toast.error(error.message || 'Une erreur est survenue lors de la sauvegarde des paramètres.');
      return false;
    }
  };

  return {
    settings,
    isLoading,
    error,
    saveSettings
  };
};
