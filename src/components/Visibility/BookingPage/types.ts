
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
};
