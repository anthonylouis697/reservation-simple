import { LucideIcon } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

// Types for DB
export type Json = 
  | string
  | number
  | boolean
  | { [key: string]: Json | undefined }
  | Json[]
  | null;

export type BookingPageSettingsDB = Database['public']['Tables']['booking_page_settings']['Row'];

// Template type definition
export interface BookingTemplate {
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
  style: "standard" | "minimal" | "premium";
}

// App types for BookingStep
export interface BookingStep {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  position: number;
  icon?: LucideIcon;
  name: string; // Added name property
  customLabel?: string; // Added customLabel property
}

// Layout type
export type BookingLayoutType = "stepped" | "allinone";

// App types for Custom Texts
export interface BookingCustomTexts {
  confirmationTitle: string;
  confirmationMessage: string;
  serviceSelectionTitle: string;
  serviceSelectionDescription: string;
  dateSelectionTitle: string;
  dateSelectionDescription: string;
  clientInfoTitle: string;
  clientInfoDescription: string;
  selectServiceLabel: string;
  selectDateLabel: string;
  selectTimeLabel: string;
  clientInfoLabel: string;
  paymentMethodLabel: string;
}

// App types
export interface BookingPageSettings {
  id?: string;
  businessId: string;
  selectedTemplate: string;
  primaryColor: string;
  secondaryColor: string;
  buttonCorners: "rounded" | "squared" | "pill";
  welcomeMessage: string;
  businessName?: string;
  logo?: string;
  customUrl?: string;
  bookingButtonText: string;
  showConfirmation: boolean;
  confirmationMessage?: string;
  layoutType: BookingLayoutType;
  steps: BookingStep[];
  customTexts: BookingCustomTexts;
}

// Context type
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
  templates: Record<string, any>;
  setSelectedTemplate: (template: string) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setButtonCorners: (corners: 'rounded' | 'squared' | 'pill') => void;
  setSteps: (steps: BookingStep[]) => void;
  handleStepChange: (id: string, enabled: boolean) => void;
  updateStepLabel: (id: string, label: string) => void;
  setBusinessName: (name: string) => void;
  setWelcomeMessage: (message: string) => void;
  setLogo: (logo: string | null) => void;
  customUrl: string;
  setCustomUrl: (url: string) => void;
  setBookingButtonText: (text: string) => void;
  setShowConfirmation: (show: boolean) => void;
  setConfirmationMessage: (message: string) => void;
  setLayoutType: (type: BookingLayoutType) => void;
  updateCustomText: (key: keyof BookingCustomTexts, value: string) => void;
  saveBookingPageSettings: () => Promise<void>;
}

// Helper types for conversion
export interface BookingPageSettingsForDB {
  business_id: string;
  selected_template: string;
  primary_color: string;
  secondary_color: string;
  button_corners: string;
  welcome_message: string;
  business_name?: string;
  logo?: string;
  custom_url?: string;
  booking_button_text: string;
  show_confirmation: boolean;
  confirmation_message?: string;
  layout_type: string;
  steps: Json;
  custom_texts: Json;
}
