
import { useState, useCallback, useEffect } from 'react';
import { 
  BookingStep, 
  BookingLayoutType,
  BookingCustomTexts,
  BookingPageSettings
} from '../types';
import { 
  defaultBookingSteps, 
  defaultTemplates, 
  defaultCustomTexts 
} from '../constants/defaultData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useBusiness } from '@/contexts/BusinessContext';

// Fonction pour charger les paramètres depuis le stockage local
const loadSavedSettings = (): BookingPageSettings | null => {
  try {
    const savedSettings = localStorage.getItem('bookingPageSettings');
    return savedSettings ? JSON.parse(savedSettings) : null;
  } catch (error) {
    console.error('Error loading booking page settings:', error);
    return null;
  }
};

export const useBookingPageState = () => {
  const { currentBusiness } = useBusiness();
  const businessId = currentBusiness?.id;
  
  // Charger les paramètres sauvegardés ou utiliser les valeurs par défaut
  const savedSettings = loadSavedSettings();
  
  // État pour le template et les couleurs
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    savedSettings?.selectedTemplate || 'standard'
  );
  const [primaryColor, setPrimaryColor] = useState<string>(
    savedSettings?.primaryColor || '#9b87f5'
  );
  const [secondaryColor, setSecondaryColor] = useState<string>(
    savedSettings?.secondaryColor || '#7E69AB'
  );
  const [buttonCorners, setButtonCorners] = useState<'squared' | 'rounded' | 'pill'>(
    savedSettings?.buttonCorners || 'rounded'
  );

  // État pour les étapes de réservation
  const [steps, setSteps] = useState<BookingStep[]>(
    savedSettings?.steps || defaultBookingSteps
  );

  // État pour les informations de l'entreprise
  const [businessName, setBusinessName] = useState<string>(
    savedSettings?.businessName || currentBusiness?.name || 'Votre Entreprise'
  );
  const [welcomeMessage, setWelcomeMessage] = useState<string>(
    savedSettings?.welcomeMessage || 'Bienvenue sur notre page de réservation'
  );
  const [logo, setLogo] = useState<string | null>(
    savedSettings?.logo || null
  );
  const [customUrl, setCustomUrl] = useState<string>(
    savedSettings?.customUrl || currentBusiness?.slug || 'votre-nom'
  );
  
  // Propriétés existantes
  const [bookingButtonText, setBookingButtonText] = useState<string>(
    savedSettings?.bookingButtonText || 'Réserver maintenant'
  );
  const [showConfirmation, setShowConfirmation] = useState<boolean>(
    savedSettings?.showConfirmation !== undefined ? savedSettings.showConfirmation : true
  );
  const [confirmationMessage, setConfirmationMessage] = useState<string>(
    savedSettings?.confirmationMessage || 'Merci pour votre réservation ! Nous avons bien reçu votre demande.'
  );
  
  // Nouvelles propriétés
  const [layoutType, setLayoutType] = useState<BookingLayoutType>(
    savedSettings?.layoutType || 'stepped'
  );
  const [customTexts, setCustomTexts] = useState<BookingCustomTexts>(
    savedSettings?.customTexts || defaultCustomTexts
  );
  
  // Charger les paramètres depuis la base de données au chargement initial
  useEffect(() => {
    const loadSettingsFromDatabase = async () => {
      if (!businessId) return;
      
      try {
        const { data, error } = await supabase
          .from('booking_page_settings')
          .select('*')
          .eq('business_id', businessId)
          .maybeSingle();
          
        if (error) {
          console.error('Error loading booking page settings from database:', error);
          return;
        }
        
        if (data) {
          // Conversion des données JSON
          let parsedSteps: BookingStep[] = defaultBookingSteps;
          let parsedTexts: BookingCustomTexts = defaultCustomTexts;
          
          try {
            if (data.steps) {
              parsedSteps = typeof data.steps === 'string' 
                ? JSON.parse(data.steps) 
                : data.steps;
            }
            
            if (data.custom_texts) {
              parsedTexts = typeof data.custom_texts === 'string' 
                ? JSON.parse(data.custom_texts) 
                : data.custom_texts;
            }
          } catch (e) {
            console.error('Error parsing JSON data:', e);
          }
          
          // Mise à jour des états avec les données de la base de données
          setSelectedTemplate(data.selected_template || 'standard');
          setPrimaryColor(data.primary_color || '#9b87f5');
          setSecondaryColor(data.secondary_color || '#7E69AB');
          setButtonCorners((data.button_corners as 'squared' | 'rounded' | 'pill') || 'rounded');
          setSteps(Array.isArray(parsedSteps) ? parsedSteps : defaultBookingSteps);
          setBusinessName(data.business_name || currentBusiness?.name || 'Votre Entreprise');
          setWelcomeMessage(data.welcome_message || 'Bienvenue sur notre page de réservation');
          setLogo(data.logo || null);
          setCustomUrl(data.custom_url || currentBusiness?.slug || 'votre-nom');
          setBookingButtonText(data.booking_button_text || 'Réserver maintenant');
          setShowConfirmation(data.show_confirmation !== undefined ? data.show_confirmation : true);
          setConfirmationMessage(data.confirmation_message || 'Merci pour votre réservation !');
          setLayoutType((data.layout_type as BookingLayoutType) || 'stepped');
          setCustomTexts(parsedTexts);
          
          // Mise à jour du stockage local
          localStorage.setItem('bookingPageSettings', JSON.stringify({
            selectedTemplate: data.selected_template,
            primaryColor: data.primary_color,
            secondaryColor: data.secondary_color,
            buttonCorners: data.button_corners,
            steps: parsedSteps,
            businessName: data.business_name,
            welcomeMessage: data.welcome_message,
            logo: data.logo,
            customUrl: data.custom_url,
            bookingButtonText: data.booking_button_text,
            showConfirmation: data.show_confirmation,
            confirmationMessage: data.confirmation_message,
            layoutType: data.layout_type,
            customTexts: parsedTexts,
          }));
        }
      } catch (error) {
        console.error('Error loading booking page settings from database:', error);
      }
    };
    
    loadSettingsFromDatabase();
  }, [businessId, currentBusiness]);
  
  // Fonctions de mise à jour avec promesses pour enchaîner les actions
  const updatePrimaryColor = useCallback((color: string) => {
    return new Promise<void>((resolve) => {
      setPrimaryColor(color);
      resolve();
    });
  }, []);
  
  const updateSecondaryColor = useCallback((color: string) => {
    return new Promise<void>((resolve) => {
      setSecondaryColor(color);
      resolve();
    });
  }, []);
  
  const updateButtonCorners = useCallback((corners: 'squared' | 'rounded' | 'pill') => {
    return new Promise<void>((resolve) => {
      setButtonCorners(corners);
      resolve();
    });
  }, []);
  
  const updateSteps = useCallback((newSteps: BookingStep[]) => {
    return new Promise<void>((resolve) => {
      setSteps(newSteps);
      resolve();
    });
  }, []);
  
  const updateBusinessName = useCallback((name: string) => {
    return new Promise<void>((resolve) => {
      setBusinessName(name);
      resolve();
    });
  }, []);
  
  const updateWelcomeMessage = useCallback((message: string) => {
    return new Promise<void>((resolve) => {
      setWelcomeMessage(message);
      resolve();
    });
  }, []);
  
  const updateLogo = useCallback((logoData: string | null) => {
    return new Promise<void>((resolve) => {
      setLogo(logoData);
      resolve();
    });
  }, []);
  
  const updateCustomUrl = useCallback((url: string) => {
    return new Promise<void>((resolve) => {
      setCustomUrl(url);
      resolve();
    });
  }, []);
  
  const updateBookingButtonText = useCallback((text: string) => {
    return new Promise<void>((resolve) => {
      setBookingButtonText(text);
      resolve();
    });
  }, []);
  
  const updateShowConfirmation = useCallback((show: boolean) => {
    return new Promise<void>((resolve) => {
      setShowConfirmation(show);
      resolve();
    });
  }, []);
  
  const updateConfirmationMessage = useCallback((message: string) => {
    return new Promise<void>((resolve) => {
      setConfirmationMessage(message);
      resolve();
    });
  }, []);
  
  const updateLayoutType = useCallback((type: BookingLayoutType) => {
    return new Promise<void>((resolve) => {
      setLayoutType(type);
      resolve();
    });
  }, []);
  
  // Fonction pour mettre à jour les textes personnalisés
  const updateCustomText = useCallback((key: keyof BookingCustomTexts, value: string) => {
    return new Promise<void>((resolve) => {
      setCustomTexts(prev => ({
        ...prev,
        [key]: value
      }));
      resolve();
    });
  }, []);
  
  // Fonction pour mettre à jour le label d'une étape
  const updateStepLabel = useCallback((id: string, label: string) => {
    return new Promise<void>((resolve) => {
      setSteps(currentSteps =>
        currentSteps.map(step =>
          step.id === id ? { ...step, customLabel: label } : step
        )
      );
      resolve();
    });
  }, []);

  // Fonction pour gérer le changement d'activation d'une étape
  const handleStepChange = useCallback((id: string, enabled: boolean) => {
    return new Promise<void>((resolve) => {
      setSteps((currentSteps) =>
        currentSteps.map((step) =>
          step.id === id ? { ...step, enabled } : step
        )
      );
      resolve();
    });
  }, []);
  
  // Fonction pour sauvegarder tous les paramètres
  const saveBookingPageSettings = useCallback(async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        if (!businessId) {
          console.error('No business ID available for saving settings');
          reject(new Error('No business ID available'));
          return;
        }
        
        // On capture l'état actuel pour la sauvegarde
        const settings: BookingPageSettings = {
          businessId,
          selectedTemplate,
          primaryColor,
          secondaryColor,
          buttonCorners,
          steps,
          businessName,
          welcomeMessage,
          logo,
          customUrl,
          bookingButtonText,
          showConfirmation,
          confirmationMessage,
          layoutType,
          customTexts,
        };
        
        // Sauvegarde dans le stockage local
        localStorage.setItem('bookingPageSettings', JSON.stringify(settings));
        
        // Sauvegarde dans la base de données
        const saveToDatabase = async () => {
          try {
            // Vérifier si un enregistrement existe déjà
            const { data, error } = await supabase
              .from('booking_page_settings')
              .select('id')
              .eq('business_id', businessId)
              .maybeSingle();
              
            if (error) {
              console.error('Error checking for existing booking page settings:', error);
              throw error;
            }
            
            // Préparer les données pour la base de données
            const dbData = {
              business_id: businessId,
              selected_template: selectedTemplate,
              primary_color: primaryColor,
              secondary_color: secondaryColor,
              button_corners: buttonCorners,
              welcome_message: welcomeMessage,
              business_name: businessName,
              logo,
              custom_url: customUrl,
              booking_button_text: bookingButtonText,
              show_confirmation: showConfirmation,
              confirmation_message: confirmationMessage,
              layout_type: layoutType,
              steps: JSON.stringify(steps),
              custom_texts: JSON.stringify(customTexts)
            };
            
            // Insérer ou mettre à jour l'enregistrement
            if (data) {
              // Mise à jour
              const { error: updateError } = await supabase
                .from('booking_page_settings')
                .update(dbData)
                .eq('id', data.id);
                
              if (updateError) {
                console.error('Error updating booking page settings:', updateError);
                throw updateError;
              }
            } else {
              // Insertion
              const { error: insertError } = await supabase
                .from('booking_page_settings')
                .insert([dbData]);
                
              if (insertError) {
                console.error('Error inserting booking page settings:', insertError);
                throw insertError;
              }
            }
            
            console.log('Settings saved to database successfully');
          } catch (error) {
            console.error('Error saving settings to database:', error);
            throw error;
          }
        };
        
        // Exécuter la sauvegarde en base de données
        saveToDatabase()
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      } catch (error) {
        console.error('Error saving booking page settings:', error);
        reject(error);
      }
    });
  }, [
    businessId,
    selectedTemplate,
    primaryColor,
    secondaryColor,
    buttonCorners,
    steps,
    businessName,
    welcomeMessage,
    logo,
    customUrl,
    bookingButtonText,
    showConfirmation,
    confirmationMessage,
    layoutType,
    customTexts
  ]);

  return {
    // Templates and styling
    templates: defaultTemplates,
    selectedTemplate,
    setSelectedTemplate,
    primaryColor,
    setPrimaryColor: updatePrimaryColor,
    secondaryColor,
    setSecondaryColor: updateSecondaryColor,
    buttonCorners,
    setButtonCorners: updateButtonCorners,
    
    // Steps
    steps,
    setSteps: updateSteps,
    handleStepChange,
    updateStepLabel,
    
    // Business info
    businessName,
    setBusinessName: updateBusinessName,
    welcomeMessage,
    setWelcomeMessage: updateWelcomeMessage,
    logo,
    setLogo: updateLogo,
    customUrl,
    setCustomUrl: updateCustomUrl,
    
    // Booking properties
    bookingButtonText,
    setBookingButtonText: updateBookingButtonText,
    showConfirmation,
    setShowConfirmation: updateShowConfirmation,
    confirmationMessage,
    setConfirmationMessage: updateConfirmationMessage,
    
    // Layout and texts
    layoutType,
    setLayoutType: updateLayoutType,
    customTexts,
    updateCustomText,
    
    // Save functionality
    saveBookingPageSettings
  };
};
