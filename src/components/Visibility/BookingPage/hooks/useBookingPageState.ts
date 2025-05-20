
import { useState, useCallback } from 'react';
import { 
  BookingStep, 
  BookingLayoutType, 
  BookingCustomTexts,
  BookingPageSettings
} from '../types';
import { 
  defaultSteps, 
  defaultTemplates, 
  defaultCustomTexts 
} from '../constants/defaultData';

// Simuler le chargement des données depuis le stockage local
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
    savedSettings?.steps || defaultSteps
  );

  // État pour les informations de l'entreprise
  const [businessName, setBusinessName] = useState<string>(
    savedSettings?.businessName || 'Votre Entreprise'
  );
  const [welcomeMessage, setWelcomeMessage] = useState<string>(
    savedSettings?.welcomeMessage || 'Bienvenue sur notre page de réservation'
  );
  const [logo, setLogo] = useState<string | null>(
    savedSettings?.logo || null
  );
  const [customUrl, setCustomUrl] = useState<string>(
    savedSettings?.customUrl || 'votre-nom'
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
  
  // Fonction pour sauvegarder tous les paramètres
  const saveBookingPageSettings = useCallback(async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const settings: BookingPageSettings = {
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
        
        localStorage.setItem('bookingPageSettings', JSON.stringify(settings));
        
        // Simuler un délai de sauvegarde pour montrer le feedback à l'utilisateur
        setTimeout(() => {
          resolve();
        }, 1000);
      } catch (error) {
        console.error('Error saving booking page settings:', error);
        reject(error);
      }
    });
  }, [
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

  // Fonction pour mettre à jour les textes personnalisés
  const updateCustomText = (key: keyof BookingCustomTexts, value: string) => {
    setCustomTexts(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Fonction pour mettre à jour le label d'une étape
  const updateStepLabel = (id: string, label: string) => {
    setSteps(currentSteps =>
      currentSteps.map(step =>
        step.id === id ? { ...step, customLabel: label } : step
      )
    );
  };

  // Fonction pour gérer le changement d'activation d'une étape
  const handleStepChange = (id: string, enabled: boolean) => {
    setSteps((currentSteps) =>
      currentSteps.map((step) =>
        step.id === id ? { ...step, enabled } : step
      )
    );
  };

  return {
    // Templates and styling
    templates: defaultTemplates,
    selectedTemplate,
    setSelectedTemplate,
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    buttonCorners,
    setButtonCorners,
    
    // Steps
    steps,
    setSteps,
    handleStepChange,
    updateStepLabel,
    
    // Business info
    businessName,
    setBusinessName,
    welcomeMessage,
    setWelcomeMessage,
    logo,
    setLogo,
    customUrl,
    setCustomUrl,
    
    // Booking properties
    bookingButtonText,
    setBookingButtonText,
    showConfirmation,
    setShowConfirmation,
    confirmationMessage,
    setConfirmationMessage,
    
    // Layout and texts
    layoutType,
    setLayoutType,
    customTexts,
    updateCustomText,
    
    // Save functionality
    saveBookingPageSettings
  };
};
