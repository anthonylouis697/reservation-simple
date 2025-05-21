
import { createContext, useContext, ReactNode } from 'react';
import { BookingPageContextType } from './types';
import { useBookingPageState } from './hooks/useBookingPageState';
import { defaultCustomTexts } from './constants/defaultData';

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
  steps: [],
  customTexts: defaultCustomTexts,
  selectedTemplate: "standard",
  templates: {},
  setSelectedTemplate: () => {},
  setPrimaryColor: () => {},
  setSecondaryColor: () => {},
  setButtonCorners: () => {},
  setSteps: () => {},
  handleStepChange: () => {},
  updateStepLabel: () => {},
  setBusinessName: () => {},
  setWelcomeMessage: () => {},
  setLogo: () => {},
  customUrl: "",
  setCustomUrl: () => {},
  setBookingButtonText: () => {},
  setShowConfirmation: () => {},
  setConfirmationMessage: () => {},
  setLayoutType: () => {},
  updateCustomText: () => {},
  saveBookingPageSettings: async () => {}
};

const BookingPageContext = createContext<BookingPageContextType>(defaultContextValue);

interface BookingPageProviderProps {
  children: ReactNode;
}

export function BookingPageProvider({ children }: BookingPageProviderProps) {
  // Get booking page state from the hook
  const bookingPageState = useBookingPageState();
  
  // Ensure that all critical properties are defined with safe defaults
  const safeBookingPageState: BookingPageContextType = {
    ...defaultContextValue,
    ...bookingPageState,
    customTexts: bookingPageState.customTexts || defaultCustomTexts,
    steps: Array.isArray(bookingPageState.steps) ? bookingPageState.steps : [],
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
