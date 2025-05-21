
import { LucideIcon } from 'lucide-react';

export interface BookingStep {
  id: string;
  name: string;
  icon?: LucideIcon;
  enabled: boolean;
  required?: boolean;
  customLabel?: string;
  description?: string;
  position?: number;
}

export interface BookingTemplate {
  id: string;
  name: string;
  description: string;
  style: string;
  preview?: string;
  colors: {
    primary: string;
    secondary: string;
    background?: string;
    text?: string;
  };
}

export type BookingLayoutType = 'stepped' | 'all-in-one';

export interface BookingPageSettingsForDB {
  business_id: string;
  business_name?: string;
  welcome_message: string;
  primary_color: string;
  secondary_color: string;
  button_corners: 'rounded' | 'squared' | 'pill';
  logo: string | null;
  booking_button_text: string;
  show_confirmation: boolean;
  confirmation_message: string;
  layout_type: BookingLayoutType;
  steps: any;
  custom_texts: any;
  selected_template: string;
  custom_url: string;
  id?: string;
}

export interface BookingPageSettings {
  id?: string;
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
  layoutType: BookingLayoutType;
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
  serviceSelectionTitle?: string;
  serviceSelectionDescription?: string;
  dateSelectionTitle?: string;
  dateSelectionDescription?: string;
  clientInfoTitle?: string;
  clientInfoDescription?: string;
  confirmationTitle?: string;
  confirmationMessage?: string;
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
  layoutType: BookingLayoutType;
  steps: BookingStep[];
  customTexts: BookingCustomTexts;
  selectedTemplate: string;
  templates: any;
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
  setLayoutType: (layout: BookingLayoutType) => void;
  updateCustomText: (key: keyof BookingCustomTexts, value: string) => void;
  saveBookingPageSettings: () => Promise<void>;
}
