
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
  style: string;
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
  selectServiceLabel: string; // Added missing property
  selectDateLabel: string; // Added missing property
  selectTimeLabel: string; // Added missing property
  clientInfoLabel: string; // Added missing property
  paymentMethodLabel: string; // Added missing property
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
  templates: BookingTemplate[];
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
  buttonCorners: "rounded" | "squared" | "pill";
  setButtonCorners: (corners: "rounded" | "squared" | "pill") => void;
  steps: BookingStep[];
  setSteps: (steps: BookingStep[]) => void;
  handleStepChange: (id: string, enabled: boolean) => void;
  updateStepLabel: (id: string, label: string) => void;
  businessName: string;
  setBusinessName: (name: string) => void;
  welcomeMessage: string;
  setWelcomeMessage: (message: string) => void;
  logo: string | null;
  setLogo: (logo: string | null) => void;
  customUrl: string;
  setCustomUrl: (url: string) => void;
  bookingButtonText: string;
  setBookingButtonText: (text: string) => void;
  showConfirmation: boolean;
  setShowConfirmation: (show: boolean) => void;
  confirmationMessage: string;
  setConfirmationMessage: (message: string) => void;
  layoutType: BookingLayoutType;
  setLayoutType: (type: BookingLayoutType) => void;
  customTexts: BookingCustomTexts;
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
