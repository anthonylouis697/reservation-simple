
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BookingPageSettings, BookingStep, BookingLayoutType, BookingCustomTexts } from '@/components/Visibility/BookingPage/types';
import { defaultBookingSteps, defaultCustomTexts } from '@/components/Visibility/BookingPage/constants/defaultData';
import { Json } from '@/integrations/supabase/types';

// Interface for database format of booking page settings
interface BookingPageSettingsForDB {
  id?: string;
  business_id: string;
  selected_template: string;
  primary_color: string;
  secondary_color: string;
  button_corners: string;
  welcome_message: string;
  business_name?: string;
  logo?: string | null;
  custom_url?: string;
  booking_button_text: string;
  show_confirmation: boolean;
  confirmation_message?: string;
  layout_type: string;
  steps: Json;
  custom_texts: Json;
}

// Hook to manage booking page settings
export const useBookingPageSettings = () => {
  const [settings, setSettings] = useState<BookingPageSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Helper function to convert app format to DB format
  const convertToDBFormat = (settings: BookingPageSettings): BookingPageSettingsForDB => {
    return {
      id: settings.id,
      business_id: settings.businessId,
      selected_template: settings.selectedTemplate,
      primary_color: settings.primaryColor,
      secondary_color: settings.secondaryColor,
      button_corners: settings.buttonCorners,
      welcome_message: settings.welcomeMessage,
      business_name: settings.businessName,
      logo: settings.logo,
      custom_url: settings.customUrl,
      booking_button_text: settings.bookingButtonText,
      show_confirmation: settings.showConfirmation,
      confirmation_message: settings.confirmationMessage,
      layout_type: settings.layoutType,
      // Convert complex objects to JSON
      steps: JSON.stringify(settings.steps) as Json,
      custom_texts: JSON.stringify(settings.customTexts) as Json
    };
  };

  // Helper function to convert DB format to app format
  const convertFromDBFormat = (dbData: any): BookingPageSettings => {
    // Parse JSON strings back to objects
    let steps: BookingStep[];
    let customTexts: BookingCustomTexts;
    
    try {
      steps = typeof dbData.steps === 'string' 
        ? JSON.parse(dbData.steps) 
        : (Array.isArray(dbData.steps) ? dbData.steps : defaultBookingSteps);
    } catch (e) {
      console.error('Error parsing steps JSON:', e);
      steps = defaultBookingSteps;
    }
    
    try {
      customTexts = typeof dbData.custom_texts === 'string'
        ? JSON.parse(dbData.custom_texts)
        : (typeof dbData.custom_texts === 'object' && dbData.custom_texts !== null 
            ? dbData.custom_texts 
            : defaultCustomTexts);
    } catch (e) {
      console.error('Error parsing custom_texts JSON:', e);
      customTexts = defaultCustomTexts;
    }

    return {
      id: dbData.id,
      businessId: dbData.business_id,
      selectedTemplate: dbData.selected_template,
      primaryColor: dbData.primary_color,
      secondaryColor: dbData.secondary_color,
      buttonCorners: dbData.button_corners as "rounded" | "squared" | "pill",
      welcomeMessage: dbData.welcome_message,
      businessName: dbData.business_name || 'Mon entreprise',
      logo: dbData.logo,
      customUrl: dbData.custom_url || '',
      bookingButtonText: dbData.booking_button_text,
      showConfirmation: dbData.show_confirmation,
      confirmationMessage: dbData.confirmation_message || '',
      layoutType: dbData.layout_type as BookingLayoutType,
      steps: steps,
      customTexts: customTexts
    };
  };

  // Load settings from the database
  const loadSettings = useCallback(async (businessId?: string) => {
    if (!user) {
      console.error("No authenticated user");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Si businessId est fourni, utilisez-le, sinon cherchez le premier business de l'utilisateur
      let targetBusinessId = businessId;
      
      if (!targetBusinessId) {
        // Obtenir le premier business associé à l'utilisateur
        const { data: businesses, error: businessError } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_id', user.id)
          .limit(1);
          
        if (businessError) throw businessError;
        
        if (businesses && businesses.length > 0) {
          targetBusinessId = businesses[0].id;
        } else {
          // Créer un nouveau business si aucun n'existe
          const { data: newBusiness, error: createError } = await supabase
            .from('businesses')
            .insert({
              name: "Mon entreprise",
              slug: `business-${Date.now()}`,
              owner_id: user.id
            })
            .select()
            .single();
            
          if (createError) throw createError;
          targetBusinessId = newBusiness.id;
        }
      }
      
      // Obtenir les paramètres de la page de réservation
      const { data, error } = await supabase
        .from('booking_page_settings')
        .select('*')
        .eq('business_id', targetBusinessId)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        // Convertir les données de la base de données au format de l'application
        const settings = convertFromDBFormat(data);
        setSettings(settings);
      } else {
        // Create default settings
        const defaultSettings: BookingPageSettings = {
          businessId: targetBusinessId,
          selectedTemplate: 'standard',
          primaryColor: '#4f46e5',
          secondaryColor: '#ffffff',
          buttonCorners: 'rounded',
          welcomeMessage: 'Bienvenue sur notre page de réservation',
          businessName: 'Mon entreprise',
          logo: null,
          customUrl: '',
          bookingButtonText: 'Réserver',
          showConfirmation: true,
          confirmationMessage: 'Merci pour votre réservation !',
          layoutType: 'stepped',
          steps: defaultBookingSteps,
          customTexts: defaultCustomTexts
        };
        
        // Save default settings to database
        const { data: newSettings, error: createError } = await supabase
          .from('booking_page_settings')
          .insert(convertToDBFormat(defaultSettings))
          .select()
          .single();
          
        if (createError) throw createError;
        
        // Set the settings with the new ID
        setSettings(convertFromDBFormat(newSettings));
      }
    } catch (err: any) {
      console.error('Error loading booking page settings:', err);
      setError(err.message);
      toast.error('Erreur lors du chargement des paramètres de la page de réservation');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Save settings to the database
  const saveSettings = useCallback(async (updatedSettings: Partial<BookingPageSettings>) => {
    if (!settings) {
      console.error("No settings to update");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Merge the current settings with the updates
      const newSettings = { ...settings, ...updatedSettings };
      
      // Convert to database format
      const dbData = convertToDBFormat(newSettings);
      
      // Update in database
      const { error } = await supabase
        .from('booking_page_settings')
        .update(dbData)
        .eq('id', settings.id);
        
      if (error) throw error;
      
      // Update local state
      setSettings(newSettings);
      toast.success('Paramètres sauvegardés avec succès');
    } catch (err: any) {
      console.error('Error saving booking page settings:', err);
      setError(err.message);
      toast.error('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  return {
    settings,
    isLoading,
    error,
    loadSettings,
    saveSettings
  };
};
