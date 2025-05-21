
import { useState, useEffect, useMemo } from 'react';
import { Service, Category } from '@/types/service';

interface BookingStep {
  id: string;
  name: string;
  enabled: boolean;
}

interface UseBookingStepsProps {
  services: Service[];
  categories: Category[];
  steps: BookingStep[];
}

export const useBookingSteps = (services: Service[] = [], categories: Category[] = [], steps: BookingStep[] = []) => {
  // État pour la sélection du service
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // État pour la sélection de la date et de l'heure
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  
  // État pour les informations du client
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  
  // État pour le processus de réservation
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingComplete, setBookingComplete] = useState(false);

  console.log('useBookingSteps - Services:', services.length);
  
  // Filtre les services en fonction de la catégorie sélectionnée
  const filteredServices = useMemo(() => {
    console.log('Filtering services by category:', selectedCategory);
    console.log('Available services:', services.length);
    if (!selectedCategory) return services;
    return services.filter(service => service.categoryId === selectedCategory);
  }, [selectedCategory, services]);
  
  // Transforme les catégories en un format utilisable par l'interface
  const activeCategories = useMemo(() => {
    return categories.map(cat => ({
      id: cat.id,
      name: cat.name
    }));
  }, [categories]);
  
  // Réinitialise le service sélectionné lorsque la catégorie change
  useEffect(() => {
    setSelectedService(null);
  }, [selectedCategory]);
  
  // Simule le chargement des créneaux horaires disponibles lorsque la date change
  useEffect(() => {
    const generateTimes = async () => {
      if (!selectedDate || !selectedService) {
        setAvailableTimes([]);
        return;
      }
      
      setIsLoadingTimes(true);
      
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Générer des créneaux toutes les 30 minutes de 8h à 18h
      const times = [];
      const startHour = 8;
      const endHour = 18;
      const interval = 30; // minutes
      
      for (let hour = startHour; hour < endHour; hour++) {
        times.push(`${hour}:00`);
        times.push(`${hour}:30`);
      }
      
      setAvailableTimes(times);
      setIsLoadingTimes(false);
    };
    
    generateTimes();
  }, [selectedDate, selectedService]);
  
  // Réinitialiser la sélection d'heure lorsque la date change
  useEffect(() => {
    setSelectedTime(null);
  }, [selectedDate]);
  
  // Fonction pour recommencer le processus de réservation
  const handleStartOver = () => {
    setSelectedCategory(null);
    setSelectedService(null);
    setSelectedDate(undefined);
    setSelectedTime(null);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setClientNotes('');
    setCurrentStep(0);
    setBookingComplete(false);
  };
  
  return {
    // Service selection
    selectedCategory,
    setSelectedCategory,
    selectedService,
    setSelectedService,
    filteredServices,
    activeCategories,
    
    // Date and time selection
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    availableTimes,
    isLoadingTimes,
    
    // Client information
    clientName,
    setClientName,
    clientEmail,
    setClientEmail,
    clientPhone,
    setClientPhone,
    clientNotes,
    setClientNotes,
    
    // Booking process
    currentStep,
    setCurrentStep,
    bookingComplete,
    setBookingComplete,
    handleStartOver
  };
};

export default useBookingSteps;
