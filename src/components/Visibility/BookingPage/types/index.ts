
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

// App types for BookingStep
export interface BookingStep {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  position: number;
  icon?: LucideIcon;
}

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
  layoutType: "stepped" | "allinone";
  steps: BookingStep[];
  customTexts: BookingCustomTexts;
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
