
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BookingPageSettings, BookingPageSettingsForDB, BookingStep, BookingLayoutType, BookingCustomTexts } from '@/components/Visibility/BookingPage/types';
import { defaultBookingSteps, defaultCustomTexts } from '@/components/Visibility/BookingPage/constants/defaultData';

// Hook to manage booking page settings
export const useBookingPageSettings = () => {
  const [settings, setSettings] = useState<BookingPageSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Helper function to convert app format to DB format
  const convertToDBFormat = (settings: BookingPageSettings): BookingPageSettingsForDB => {
    return {
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
      steps: settings.steps,
      custom_texts: settings.customTexts
    };
  };

  // Helper function to convert DB format to app format
  const convertFromDBFormat = (dbData: any): BookingPageSettings => {
    // Ensure steps have correct format
    let steps = Array.isArray(dbData.steps) 
      ? dbData.steps 
      : defaultBookingSteps;
      
    // Ensure customTexts have correct format
    let customTexts = typeof dbData.custom_texts === 'object' && dbData.custom_texts !== null
      ? dbData.custom_texts
      : defaultCustomTexts;

    return {
      id: dbData.id,
      businessId: dbData.business_id,
      selectedTemplate: dbData.selected_template,
      primaryColor: dbData.primary_color,
      secondaryColor: dbData.secondary_color,
      buttonCorners: dbData.button_corners as "rounded" | "squared" | "pill",
      welcomeMessage: dbData.welcome_message,
      businessName: dbData.business_name,
      logo: dbData.logo,
      customUrl: dbData.custom_url,
      bookingButtonText: dbData.booking_button_text,
      showConfirmation: dbData.show_confirmation,
      confirmationMessage: dbData.confirmation_message,
      layoutType: dbData.layout_type as BookingLayoutType,
      steps: steps as BookingStep[],
      customTexts: customTexts as BookingCustomTexts
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
