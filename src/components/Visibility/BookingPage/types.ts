
import { ReactNode } from 'react';

export type BookingTemplate = {
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
  style: 'standard' | 'minimal' | 'premium';
};

export type BookingStep = {
  id: string;
  name: string;
  icon: ReactNode;
  enabled: boolean;
  customLabel?: string;
};

// Nouveaux types pour les modèles d'affichage
export type BookingLayoutType = 'stepped' | 'all-in-one';

export type BookingCustomTexts = {
  selectServiceLabel: string;
  selectDateLabel: string;
  selectTimeLabel: string;
  clientInfoLabel: string;
  paymentMethodLabel: string;
};
