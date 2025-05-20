
import { useState } from 'react';
import { 
  BookingStep, 
  BookingLayoutType, 
  BookingCustomTexts 
} from '../types';
import { 
  defaultSteps, 
  defaultTemplates, 
  defaultCustomTexts 
} from '../constants/defaultData';

export const useBookingPageState = () => {
  // État pour le template et les couleurs
  const [selectedTemplate, setSelectedTemplate] = useState<string>('standard');
  const [primaryColor, setPrimaryColor] = useState<string>('#9b87f5');
  const [secondaryColor, setSecondaryColor] = useState<string>('#7E69AB');
  const [buttonCorners, setButtonCorners] = useState<'squared' | 'rounded' | 'pill'>('rounded');

  // État pour les étapes de réservation
  const [steps, setSteps] = useState<BookingStep[]>(defaultSteps);

  // État pour les informations de l'entreprise
  const [businessName, setBusinessName] = useState<string>('Votre Entreprise');
  const [welcomeMessage, setWelcomeMessage] = useState<string>('Bienvenue sur notre page de réservation');
  const [logo, setLogo] = useState<string | null>(null);
  const [customUrl, setCustomUrl] = useState<string>('votre-nom');
  
  // Propriétés existantes
  const [bookingButtonText, setBookingButtonText] = useState<string>('Réserver maintenant');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(true);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('Merci pour votre réservation ! Nous avons bien reçu votre demande.');
  
  // Nouvelles propriétés
  const [layoutType, setLayoutType] = useState<BookingLayoutType>('stepped');
  const [customTexts, setCustomTexts] = useState<BookingCustomTexts>(defaultCustomTexts);

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
    updateCustomText
  };
};
