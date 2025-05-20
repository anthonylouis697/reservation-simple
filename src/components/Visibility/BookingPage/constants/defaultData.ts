
import { CalendarCheck, UserCircle, CreditCard, FileCheck } from 'lucide-react';
import { BookingTemplate, BookingStep, BookingCustomTexts } from '../types';

// Define the default templates with styles
export const defaultTemplates: BookingTemplate[] = [
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

// Define the default booking steps
export const defaultSteps: BookingStep[] = [
  { id: 'service', name: 'Choix du service', icon: <FileCheck size={16} />, enabled: true },
  { id: 'date', name: 'Date et horaire', icon: <CalendarCheck size={16} />, enabled: true },
  { id: 'client', name: 'Informations client', icon: <UserCircle size={16} />, enabled: true },
  { id: 'payment', name: 'Paiement', icon: <CreditCard size={16} />, enabled: true },
];

// Define the default custom texts
export const defaultCustomTexts: BookingCustomTexts = {
  selectServiceLabel: 'Sélectionnez un service',
  selectDateLabel: 'Sélectionnez une date',
  selectTimeLabel: 'Sélectionnez un horaire',
  clientInfoLabel: 'Vos informations',
  paymentMethodLabel: 'Méthode de paiement',
};
