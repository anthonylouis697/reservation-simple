
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { 
  BookingPageSettings, 
  BookingStep,
  BookingCustomTexts,
  BookingPageSettingsForDB,
  Json
} from '@/components/Visibility/BookingPage/types';
import { useAuth } from '@/contexts/AuthContext';
import { defaultSteps, defaultCustomTexts } from '@/components/Visibility/BookingPage/constants/defaultData';

// Helper function to convert from DB format to app format
const convertFromDB = (dbSettings: any): BookingPageSettings => {
  return {
    id: dbSettings.id,
    businessId: dbSettings.business_id,
    selectedTemplate: dbSettings.selected_template,
    primaryColor: dbSettings.primary_color,
    secondaryColor: dbSettings.secondary_color,
    buttonCorners: dbSettings.button_corners as "rounded" | "squared" | "pill",
    welcomeMessage: dbSettings.welcome_message,
    businessName: dbSettings.business_name,
    logo: dbSettings.logo,
    customUrl: dbSettings.custom_url,
    bookingButtonText: dbSettings.booking_button_text,
    showConfirmation: dbSettings.show_confirmation,
    confirmationMessage: dbSettings.confirmation_message,
    layoutType: dbSettings.layout_type as "stepped" | "allinone",
    steps: Array.isArray(dbSettings.steps) ? dbSettings.steps : defaultSteps,
    customTexts: dbSettings.custom_texts ? dbSettings.custom_texts : defaultCustomTexts
  };
};

// Helper function to convert from app format to DB format
const convertToDB = (appSettings: Partial<BookingPageSettings>): BookingPageSettingsForDB => {
  // Always ensure business_id is included
  if (!appSettings.businessId) {
    throw new Error("Business ID is required");
  }

  return {
    business_id: appSettings.businessId,
    selected_template: appSettings.selectedTemplate || 'standard',
    primary_color: appSettings.primaryColor || '#4f46e5',
    secondary_color: appSettings.secondaryColor || '#ffffff',
    button_corners: appSettings.buttonCorners || 'rounded',
    welcome_message: appSettings.welcomeMessage || 'Bienvenue sur notre page de réservation',
    business_name: appSettings.businessName,
    logo: appSettings.logo || null,
    custom_url: appSettings.customUrl,
    booking_button_text: appSettings.bookingButtonText || 'Réserver',
    show_confirmation: appSettings.showConfirmation !== undefined ? appSettings.showConfirmation : true,
    confirmation_message: appSettings.confirmationMessage,
    layout_type: appSettings.layoutType || 'stepped',
    steps: appSettings.steps as unknown as Json,
    custom_texts: appSettings.customTexts as unknown as Json
  };
};

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
          setSettings(convertFromDB(data));
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
      const defaultSettings: BookingPageSettingsForDB = {
        business_id: businessId,
        selected_template: 'standard',
        primary_color: '#4f46e5',
        secondary_color: '#ffffff',
        button_corners: 'rounded',
        welcome_message: 'Bienvenue sur notre page de réservation',
        booking_button_text: 'Réserver',
        show_confirmation: true,
        layout_type: 'stepped',
        steps: defaultSteps as unknown as Json,
        custom_texts: defaultCustomTexts as unknown as Json
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
        setSettings(convertFromDB(data));
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
      // Ensure businessId is included
      const settingsWithBusinessId = {
        ...updatedSettings,
        businessId: businessId
      };

      // Convert application format to database format
      const dbSettings = convertToDB(settingsWithBusinessId);

      // Prepare the final object for upsert
      const { error } = await supabase
        .from('booking_page_settings')
        .upsert(dbSettings)
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
