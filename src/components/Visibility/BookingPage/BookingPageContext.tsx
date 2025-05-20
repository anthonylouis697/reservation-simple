
import { createContext, useContext, useState, ReactNode } from 'react';
import { BookingStep, BookingTemplate } from './types';
import { CalendarCheck, UserCircle, CreditCard, FileCheck } from 'lucide-react';

interface BookingPageContextType {
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
  // Nouvelles propriétés ajoutées
  bookingButtonText: string;
  setBookingButtonText: (text: string) => void;
  showConfirmation: boolean;
  setShowConfirmation: (show: boolean) => void;
  confirmationMessage: string;
  setConfirmationMessage: (message: string) => void;
}

const BookingPageContext = createContext<BookingPageContextType | undefined>(undefined);

interface BookingPageProviderProps {
  children: ReactNode;
}

export function BookingPageProvider({ children }: BookingPageProviderProps) {
  // Définir les templates avec des styles visuels distincts
  const templates: BookingTemplate[] = [
    {
      id: 'standard',
      name: 'Standard',
      description: 'Design classique professionnel',
      preview: '/templates/standard.jpg',
      colors: {
        primary: '#9b87f5',
        secondary: '#7E69AB',
        background: '#ffffff',
        text: '#1A1F2C'
      },
      style: 'standard'
    },
    {
      id: 'minimal',
      name: 'Minimaliste',
      description: 'Design épuré et moderne',
      preview: '/templates/minimal.jpg',
      colors: {
        primary: '#10b981',
        secondary: '#059669',
        background: '#f9fafb',
        text: '#111827'
      },
      style: 'minimal'
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Design élégant et sophistiqué',
      preview: '/templates/premium.jpg',
      colors: {
        primary: '#f59e0b',
        secondary: '#d97706',
        background: '#fffbeb',
        text: '#78350f'
      },
      style: 'premium'
    }
  ];

  // État pour les étapes de réservation
  const [steps, setSteps] = useState<BookingStep[]>([
    { id: 'service', name: 'Choix du service', icon: <FileCheck size={16} />, enabled: true },
    { id: 'date', name: 'Date et horaire', icon: <CalendarCheck size={16} />, enabled: true },
    { id: 'client', name: 'Informations client', icon: <UserCircle size={16} />, enabled: true },
    { id: 'payment', name: 'Paiement', icon: <CreditCard size={16} />, enabled: true },
  ]);

  // État pour le template et les couleurs
  const [selectedTemplate, setSelectedTemplate] = useState<string>('standard');
  const [primaryColor, setPrimaryColor] = useState<string>('#9b87f5');
  const [secondaryColor, setSecondaryColor] = useState<string>('#7E69AB');
  const [buttonCorners, setButtonCorners] = useState<'squared' | 'rounded' | 'pill'>('rounded');

  // État pour les informations de l'entreprise
  const [businessName, setBusinessName] = useState<string>('Votre Entreprise');
  const [welcomeMessage, setWelcomeMessage] = useState<string>('Bienvenue sur notre page de réservation');
  const [logo, setLogo] = useState<string | null>(null);
  const [customUrl, setCustomUrl] = useState<string>('votre-nom');
  
  // Nouvelles propriétés ajoutées
  const [bookingButtonText, setBookingButtonText] = useState<string>('Réserver maintenant');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(true);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('Merci pour votre réservation ! Nous avons bien reçu votre demande.');

  // Fonction pour gérer le changement d'activation d'une étape
  const handleStepChange = (id: string, enabled: boolean) => {
    setSteps((currentSteps) =>
      currentSteps.map((step) =>
        step.id === id ? { ...step, enabled } : step
      )
    );
  };

  return (
    <BookingPageContext.Provider
      value={{
        businessName,
        setBusinessName,
        welcomeMessage,
        setWelcomeMessage,
        selectedTemplate,
        setSelectedTemplate,
        primaryColor,
        setPrimaryColor,
        secondaryColor,
        setSecondaryColor,
        buttonCorners,
        setButtonCorners,
        logo,
        setLogo,
        templates,
        steps,
        setSteps,
        handleStepChange,
        customUrl,
        setCustomUrl,
        // Nouvelles propriétés ajoutées
        bookingButtonText,
        setBookingButtonText,
        showConfirmation,
        setShowConfirmation,
        confirmationMessage,
        setConfirmationMessage,
      }}
    >
      {children}
    </BookingPageContext.Provider>
  );
}

export function useBookingPage() {
  const context = useContext(BookingPageContext);
  if (context === undefined) {
    throw new Error('useBookingPage must be used within a BookingPageProvider');
  }
  return context;
}
