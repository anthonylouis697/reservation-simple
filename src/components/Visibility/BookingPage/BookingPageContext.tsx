
import { createContext, useContext, ReactNode } from 'react';
import { BookingPageContextType } from './types';
import { useBookingPageState } from './hooks/useBookingPageState';

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
  customTexts: {},
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
  const bookingPageState = useBookingPageState();

  return (
    <BookingPageContext.Provider value={bookingPageState}>
      {children}
    </BookingPageContext.Provider>
  );
}

export function useBookingPage(): BookingPageContextType {
  const context = useContext(BookingPageContext);
  return context;
}
