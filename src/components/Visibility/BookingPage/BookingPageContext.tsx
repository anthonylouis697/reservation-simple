
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { BookingStep, BookingTemplate } from './types';
import { 
  CalendarIcon, 
  CheckSquare, 
  Clock, 
  Users, 
  CreditCard 
} from 'lucide-react';

interface BookingPageContextType {
  // Templates
  templates: BookingTemplate[];
  selectedTemplate: string;
  setSelectedTemplate: (templateId: string) => void;
  
  // Colors
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
  
  // Business info
  businessName: string;
  setBusinessName: (name: string) => void;
  welcomeMessage: string;
  setWelcomeMessage: (message: string) => void;
  
  // Button styling
  buttonCorners: 'squared' | 'rounded' | 'pill';
  setButtonCorners: (corners: 'squared' | 'rounded' | 'pill') => void;
  bookingButtonText: string;
  setBookingButtonText: (text: string) => void;
  
  // Logo
  logo: string | null;
  setLogo: (logo: string | null) => void;
  
  // Confirmation
  showConfirmation: boolean;
  setShowConfirmation: (show: boolean) => void;
  confirmationMessage: string;
  setConfirmationMessage: (message: string) => void;
  
  // Booking steps
  steps: BookingStep[];
  setSteps: (steps: BookingStep[]) => void;
  
  // Preview
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}

const BookingPageContext = createContext<BookingPageContextType | undefined>(undefined);

export const BookingPageProvider = ({ children }: { children: ReactNode }) => {
  // Templates state
  const [templates] = useState<BookingTemplate[]>([
    {
      id: 'standard',
      name: 'Standard',
      description: 'Design professionnel avec des couleurs équilibrées',
      preview: 'standard-preview',
      colors: {
        primary: '#9b87f5',
        secondary: '#f3f4f6',
        background: '#ffffff',
        text: '#1f2937',
      },
      style: 'standard',
    },
    {
      id: 'minimal',
      name: 'Minimaliste',
      description: 'Design épuré avec beaucoup d\'espace blanc',
      preview: 'minimal-preview',
      colors: {
        primary: '#0ea5e9',
        secondary: '#f9fafb',
        background: '#ffffff',
        text: '#111827',
      },
      style: 'minimal',
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Design élégant avec des détails raffinés',
      preview: 'premium-preview',
      colors: {
        primary: '#8b5cf6',
        secondary: '#f3f4f6',
        background: '#ffffff',
        text: '#1f2937',
      },
      style: 'premium',
    },
  ]);
  
  const [selectedTemplate, setSelectedTemplate] = useState('premium');
  
  // Colors state
  const [primaryColor, setPrimaryColor] = useState('#9b87f5');
  const [secondaryColor, setSecondaryColor] = useState('#f3f4f6');
  
  // Business info state
  const [businessName, setBusinessName] = useState('Mon Entreprise');
  const [welcomeMessage, setWelcomeMessage] = useState('Bienvenue sur ma page de réservation');
  
  // Button styling state
  const [buttonCorners, setButtonCorners] = useState<'squared' | 'rounded' | 'pill'>('rounded');
  const [bookingButtonText, setBookingButtonText] = useState('Confirmer la réservation');
  
  // Logo state
  const [logo, setLogo] = useState<string | null>(null);
  
  // Confirmation state
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [confirmationMessage, setConfirmationMessage] = useState('Votre rendez-vous a bien été confirmé !');
  
  // Booking steps state
  const [steps, setSteps] = useState<BookingStep[]>([
    { id: 'service', name: 'Choix du service', icon: <CheckSquare className="h-4 w-4" />, enabled: true },
    { id: 'date', name: 'Sélection de la date', icon: <CalendarIcon className="h-4 w-4" />, enabled: true },
    { id: 'time', name: 'Choix de l\'horaire', icon: <Clock className="h-4 w-4" />, enabled: true },
    { id: 'info', name: 'Informations client', icon: <Users className="h-4 w-4" />, enabled: true },
    { id: 'payment', name: 'Paiement (optionnel)', icon: <CreditCard className="h-4 w-4" />, enabled: false },
  ]);
  
  // Preview state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const value = {
    templates,
    selectedTemplate,
    setSelectedTemplate,
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    businessName,
    setBusinessName,
    welcomeMessage,
    setWelcomeMessage,
    buttonCorners,
    setButtonCorners,
    bookingButtonText,
    setBookingButtonText,
    logo,
    setLogo,
    showConfirmation,
    setShowConfirmation,
    confirmationMessage,
    setConfirmationMessage,
    steps,
    setSteps,
    selectedDate,
    setSelectedDate,
  };
  
  return (
    <BookingPageContext.Provider value={value}>
      {children}
    </BookingPageContext.Provider>
  );
};

export const useBookingPage = (): BookingPageContextType => {
  const context = useContext(BookingPageContext);
  if (context === undefined) {
    throw new Error('useBookingPage must be used within a BookingPageProvider');
  }
  return context;
};
