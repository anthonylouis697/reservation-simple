
import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { BookingPageContextType } from './types';
import { useBookingPageState } from './hooks/useBookingPageState';
import { defaultCustomTexts, defaultBookingSteps } from './constants/defaultData';
import { supabase } from '@/integrations/supabase/client';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

// Create context with default values to satisfy TypeScript
const defaultContextValue: BookingPageContextType = {
  businessName: "",
  welcomeMessage: "",
  primaryColor: "#9b87f5",
  secondaryColor: "#7E69AB",
  buttonCorners: "rounded",
  logo: null,
  bookingButtonText: "Réserver",
  showConfirmation: true,
  confirmationMessage: "Merci pour votre réservation !",
  layoutType: "stepped",
  steps: defaultBookingSteps,
  customTexts: defaultCustomTexts,
  selectedTemplate: "standard",
  templates: [],
  setSelectedTemplate: () => {},
  setPrimaryColor: () => Promise.resolve(),
  setSecondaryColor: () => Promise.resolve(),
  setButtonCorners: () => Promise.resolve(),
  setSteps: () => Promise.resolve(),
  handleStepChange: () => Promise.resolve(),
  updateStepLabel: () => Promise.resolve(),
  setBusinessName: () => Promise.resolve(),
  setWelcomeMessage: () => Promise.resolve(),
  setLogo: () => Promise.resolve(),
  customUrl: "",
  setCustomUrl: () => Promise.resolve(),
  setBookingButtonText: () => Promise.resolve(),
  setShowConfirmation: () => Promise.resolve(),
  setConfirmationMessage: () => Promise.resolve(),
  setLayoutType: () => Promise.resolve(),
  updateCustomText: () => Promise.resolve(),
  saveBookingPageSettings: async () => {}
};

const BookingPageContext = createContext<BookingPageContextType>(defaultContextValue);

interface BookingPageProviderProps {
  children: ReactNode;
}

export function BookingPageProvider({ children }: BookingPageProviderProps) {
  // Get booking page state from the hook
  const bookingPageState = useBookingPageState();
  const { businessSlug } = useParams<{ businessSlug?: string }>();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Si on est sur la page publique de réservation, on charge les paramètres de la base de données
  useEffect(() => {
    const loadSettingsFromDatabase = async () => {
      if (!businessSlug || isInitialized) return;
      
      try {
        // Recherche du business ID par le slug
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('id')
          .eq('slug', businessSlug)
          .maybeSingle();
        
        if (businessError || !businessData) {
          console.error("Erreur lors de la récupération du business:", businessError || "Business non trouvé");
          return;
        }
        
        // Récupération des paramètres de page de réservation
        const { data: settingsData, error: settingsError } = await supabase
          .from('booking_page_settings')
          .select('*')
          .eq('business_id', businessData.id)
          .maybeSingle();
        
        if (settingsError) {
          console.error("Erreur lors de la récupération des paramètres:", settingsError);
          return;
        }
        
        if (settingsData) {
          // On applique les paramètres trouvés dans la base de données
          if (settingsData.primary_color) bookingPageState.setPrimaryColor(settingsData.primary_color);
          if (settingsData.secondary_color) bookingPageState.setSecondaryColor(settingsData.secondary_color);
          if (settingsData.button_corners) bookingPageState.setButtonCorners(settingsData.button_corners as any);
          if (settingsData.business_name) bookingPageState.setBusinessName(settingsData.business_name);
          if (settingsData.welcome_message) bookingPageState.setWelcomeMessage(settingsData.welcome_message);
          if (settingsData.logo) bookingPageState.setLogo(settingsData.logo);
          if (settingsData.booking_button_text) bookingPageState.setBookingButtonText(settingsData.booking_button_text);
          if (settingsData.layout_type) bookingPageState.setLayoutType(settingsData.layout_type as any);
          
          // Conversion des données JSON
          if (settingsData.steps) {
            const parsedSteps = typeof settingsData.steps === 'string' 
              ? JSON.parse(settingsData.steps) 
              : settingsData.steps;
            
            if (Array.isArray(parsedSteps)) {
              bookingPageState.setSteps(parsedSteps);
            }
          }
          
          if (settingsData.custom_texts) {
            const parsedTexts = typeof settingsData.custom_texts === 'string' 
              ? JSON.parse(settingsData.custom_texts) 
              : settingsData.custom_texts;
            
            if (typeof parsedTexts === 'object' && parsedTexts !== null) {
              // Mise à jour des textes personnalisés
              Object.entries(parsedTexts).forEach(([key, value]) => {
                if (typeof value === 'string') {
                  bookingPageState.updateCustomText(key as any, value);
                }
              });
            }
          }
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error("Erreur lors du chargement des paramètres:", error);
      }
    };
    
    loadSettingsFromDatabase();
  }, [businessSlug, isInitialized, bookingPageState]);
  
  // Ensure that all critical properties are defined with safe defaults
  const safeBookingPageState: BookingPageContextType = {
    ...defaultContextValue,
    ...bookingPageState,
    customTexts: bookingPageState.customTexts || defaultCustomTexts,
    steps: Array.isArray(bookingPageState.steps) ? bookingPageState.steps : defaultBookingSteps,
    primaryColor: bookingPageState.primaryColor || "#9b87f5",
    secondaryColor: bookingPageState.secondaryColor || "#7E69AB",
    buttonCorners: bookingPageState.buttonCorners || "rounded",
    bookingButtonText: bookingPageState.bookingButtonText || "Réserver",
    layoutType: bookingPageState.layoutType || "stepped",
    selectedTemplate: bookingPageState.selectedTemplate || "standard"
  };

  return (
    <BookingPageContext.Provider value={safeBookingPageState}>
      {children}
    </BookingPageContext.Provider>
  );
}

export function useBookingPage(): BookingPageContextType {
  const context = useContext(BookingPageContext);
  if (!context) {
    console.warn("useBookingPage must be used within a BookingPageProvider");
    return defaultContextValue;
  }
  return context;
}
