
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
const convertToDB = (appSettings: Partial<BookingPageSettings>): Partial<BookingPageSettingsForDB> => {
  const result: Partial<BookingPageSettingsForDB> = {};
  
  if (appSettings.businessId !== undefined) result.business_id = appSettings.businessId;
  if (appSettings.selectedTemplate !== undefined) result.selected_template = appSettings.selectedTemplate;
  if (appSettings.primaryColor !== undefined) result.primary_color = appSettings.primaryColor;
  if (appSettings.secondaryColor !== undefined) result.secondary_color = appSettings.secondaryColor;
  if (appSettings.buttonCorners !== undefined) result.button_corners = appSettings.buttonCorners;
  if (appSettings.welcomeMessage !== undefined) result.welcome_message = appSettings.welcomeMessage;
  if (appSettings.businessName !== undefined) result.business_name = appSettings.businessName;
  if (appSettings.logo !== undefined) result.logo = appSettings.logo;
  if (appSettings.customUrl !== undefined) result.custom_url = appSettings.customUrl;
  if (appSettings.bookingButtonText !== undefined) result.booking_button_text = appSettings.bookingButtonText;
  if (appSettings.showConfirmation !== undefined) result.show_confirmation = appSettings.showConfirmation;
  if (appSettings.confirmationMessage !== undefined) result.confirmation_message = appSettings.confirmationMessage;
  if (appSettings.layoutType !== undefined) result.layout_type = appSettings.layoutType;
  if (appSettings.steps !== undefined) result.steps = appSettings.steps as unknown as Json;
  if (appSettings.customTexts !== undefined) result.custom_texts = appSettings.customTexts as unknown as Json;
  
  return result;
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
      // Convert application format to database format
      const dbSettings = convertToDB({
        ...updatedSettings,
        businessId // Ensure businessId is included
      });

      // Remove steps and custom_texts from dbSettings to avoid type issues
      // We'll handle them separately
      const { steps, custom_texts, ...restDbSettings } = dbSettings;

      // Prepare the final object for upsert, with appropriately typed fields
      const formattedSettings = {
        ...restDbSettings,
        // Ensure business_id is set
        business_id: businessId,
        // Convert complex objects to JSON strings for database storage
        steps: JSON.stringify(updatedSettings.steps || []),
        custom_texts: JSON.stringify(updatedSettings.customTexts || {})
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
