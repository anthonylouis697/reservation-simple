
import { useState, useEffect } from 'react';
import { Service } from '@/types/service';
import { BookingResult } from '@/services/booking/types';

interface BookingStateManagerProps {
  businessId: string;
  onBookingSuccess: (result: BookingResult) => void;
}

export const useBookingState = ({ businessId, onBookingSuccess }: BookingStateManagerProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [businessSettings, setBusinessSettings] = useState<any>(null);
  
  const [clientInfo, setClientInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
  });

  // Vérifier si l'étape actuelle est complète
  const isCurrentStepComplete = () => {
    if (currentStep === 0) return selectedService !== null;
    if (currentStep === 1) return selectedDate !== undefined;
    if (currentStep === 2) return selectedTime !== null;
    if (currentStep === 3) return clientInfo.firstName && clientInfo.lastName && clientInfo.email;
    return false;
  };

  // Navigation entre les étapes
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (isCurrentStepComplete()) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Fonction pour gérer la réservation réussie
  const handleBookingSuccess = (bookingResult: BookingResult) => {
    console.log('Réservation réussie:', bookingResult);
    setBookingComplete(true);
    onBookingSuccess(bookingResult);
  };

  return {
    currentStep,
    setCurrentStep,
    selectedService,
    setSelectedService,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    clientInfo,
    setClientInfo,
    bookingComplete,
    setBookingComplete,
    businessSettings,
    setBusinessSettings,
    isCurrentStepComplete,
    handlePrevStep,
    handleNextStep,
    handleBookingSuccess
  };
};
