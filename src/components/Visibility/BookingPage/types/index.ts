
import { ReactNode } from 'react';

export type BookingTemplate = {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  style: 'standard' | 'minimal' | 'premium';
};

export type BookingStep = {
  id: string;
  name: string;
  icon: ReactNode;
  enabled: boolean;
  customLabel?: string;
};

// Nouveaux types pour les modèles d'affichage
export type BookingLayoutType = 'stepped' | 'all-in-one';

export type BookingCustomTexts = {
  selectServiceLabel: string;
  selectDateLabel: string;
  selectTimeLabel: string;
  clientInfoLabel: string;
  paymentMethodLabel: string;
};

export interface BookingPageContextType {
  businessName: string;
  setBusinessName: (name: string) => void;
  welcomeMessage: string;
  setWelcomeMessage: (message: string) => void;
  selectedTemplate: string;
  setSelectedTemplate: (templateId: string) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
  buttonCorners: 'squared' | 'rounded' | 'pill';
  setButtonCorners: (style: 'squared' | 'rounded' | 'pill') => void;
  logo: string | null;
  setLogo: (logo: string | null) => void;
  templates: BookingTemplate[];
  steps: BookingStep[];
  setSteps: (steps: BookingStep[]) => void;
  handleStepChange: (id: string, enabled: boolean) => void;
  customUrl: string;
  setCustomUrl: (url: string) => void;
  // Propriétés existantes
  bookingButtonText: string;
  setBookingButtonText: (text: string) => void;
  showConfirmation: boolean;
  setShowConfirmation: (show: boolean) => void;
  confirmationMessage: string;
  setConfirmationMessage: (message: string) => void;
  // Nouvelles propriétés
  layoutType: BookingLayoutType;
  setLayoutType: (type: BookingLayoutType) => void;
  customTexts: BookingCustomTexts;
  updateCustomText: (key: keyof BookingCustomTexts, value: string) => void;
  updateStepLabel: (id: string, label: string) => void;
}
