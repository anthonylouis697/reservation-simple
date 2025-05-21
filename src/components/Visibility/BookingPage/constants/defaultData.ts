
import { CalendarCheck, UserCircle, CreditCard, FileCheck } from 'lucide-react';
import { BookingTemplate, BookingStep, BookingCustomTexts } from '../types';

// Define the default templates with styles
export const defaultTemplates: BookingTemplate[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Design classique professionnel',
    style: 'standard',
    preview: '/templates/standard.jpg',
    colors: {
      primary: '#9b87f5',
      secondary: '#7E69AB',
      background: '#ffffff',
      text: '#1A1F2C'
    }
  },
  {
    id: 'minimal',
    name: 'Minimaliste',
    description: 'Design épuré et moderne',
    style: 'minimal',
    preview: '/templates/minimal.jpg',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      background: '#f9fafb',
      text: '#111827'
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Design élégant et sophistiqué',
    style: 'premium',
    preview: '/templates/premium.jpg',
    colors: {
      primary: '#f59e0b',
      secondary: '#d97706',
      background: '#fffbeb',
      text: '#78350f'
    }
  }
];

// Define the default booking steps without JSX
export const defaultBookingSteps: BookingStep[] = [
  { 
    id: 'service', 
    name: 'Choix du service',
    description: 'Sélectionnez le service qui vous convient',
    enabled: true, 
    position: 0,
    icon: FileCheck 
  },
  { 
    id: 'date', 
    name: 'Date et horaire',
    description: 'Choisissez une date et un horaire disponible',
    enabled: true, 
    position: 1,
    icon: CalendarCheck 
  },
  { 
    id: 'client', 
    name: 'Informations client',
    description: 'Fournissez vos informations personnelles',
    enabled: true, 
    position: 2,
    icon: UserCircle 
  },
  { 
    id: 'payment', 
    name: 'Paiement',
    description: 'Effectuez votre paiement',
    enabled: true, 
    position: 3,
    icon: CreditCard 
  }
];

// Define the default custom texts
export const defaultCustomTexts: BookingCustomTexts = {
  selectServiceLabel: 'Sélectionnez un service',
  selectDateLabel: 'Sélectionnez une date',
  selectTimeLabel: 'Sélectionnez un horaire',
  clientInfoLabel: 'Vos informations',
  paymentMethodLabel: 'Méthode de paiement',
  confirmationMessage: 'Merci pour votre réservation ! Nous avons bien reçu votre demande.',
  serviceSelectionTitle: 'Sélection du service',
  serviceSelectionDescription: 'Choisissez le service qui vous convient',
  dateSelectionTitle: 'Sélection de la date',
  dateSelectionDescription: 'Choisissez une date et un horaire disponible',
  clientInfoTitle: 'Vos informations',
  clientInfoDescription: 'Veuillez fournir vos coordonnées',
  confirmationTitle: 'Réservation confirmée'
};
