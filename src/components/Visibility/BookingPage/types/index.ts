// Modifier le type BookingStep si nécessaire pour s'assurer que l'icon est correctement typé
import { LucideIcon } from 'lucide-react';

export interface BookingStep {
  id: string;
  name: string;
  icon?: LucideIcon;
  enabled: boolean;
  required?: boolean;
  customLabel?: string;
}

export interface BookingPageSettings {
  businessId: string;
  businessName: string;
  welcomeMessage: string;
  primaryColor: string;
  secondaryColor: string;
  buttonCorners: 'rounded' | 'squared' | 'pill';
  logo: string | null;
  bookingButtonText: string;
  showConfirmation: boolean;
  confirmationMessage: string;
  layoutType: 'stepped' | 'all-in-one';
  steps: BookingStep[];
  customTexts: BookingCustomTexts;
  selectedTemplate: string;
  customUrl: string;
}

export interface BookingCustomTexts {
  selectServiceLabel?: string;
  selectDateLabel?: string;
  selectTimeLabel?: string;
  clientInfoLabel?: string;
  paymentMethodLabel?: string;
}

export interface BookingTemplate {
  id: string;
  name: string;
  description: string;
  style: string;
  colors: {
    primary: string;
    secondary: string;
    background?: string;
    text?: string;
  };
}

export interface BookingPageContextType {
  businessName: string;
  welcomeMessage: string;
  primaryColor: string;
  secondaryColor: string;
  buttonCorners: 'rounded' | 'squared' | 'pill';
  logo: string | null;
  bookingButtonText: string;
  showConfirmation: boolean;
  confirmationMessage: string;
  layoutType: 'stepped' | 'all-in-one';
  steps: BookingStep[];
  customTexts: BookingCustomTexts;
  selectedTemplate: string;
  templates: any; // Vous pouvez ajuster ceci en fonction de la structure réelle de vos templates
  customUrl: string;
  
  // Setters
  setSelectedTemplate: (template: string) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setButtonCorners: (corners: 'rounded' | 'squared' | 'pill') => void;
  setSteps: (steps: BookingStep[]) => void;
  handleStepChange: (stepId: string, enabled: boolean) => void;
  updateStepLabel: (stepId: string, label: string) => void;
  setBusinessName: (name: string) => void;
  setWelcomeMessage: (message: string) => void;
  setLogo: (logo: string | null) => void;
  setCustomUrl: (url: string) => void;
  setBookingButtonText: (text: string) => void;
  setShowConfirmation: (show: boolean) => void;
  setConfirmationMessage: (message: string) => void;
  setLayoutType: (layout: 'stepped' | 'all-in-one') => void;
  updateCustomText: (key: keyof BookingCustomTexts, value: string) => void;
  saveBookingPageSettings: () => Promise<void>;
}
