
import { useState, useEffect } from 'react';
import { Service } from '@/types/service';
import { getAvailableTimeSlots } from '@/utils/availability';
import { checkAvailability } from '@/services/bookingService';
import { toast } from 'sonner';

export const useBookingSteps = (services: Service[], categories: any[], steps: any[]) => {
  // États pour le processus de réservation
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // États pour les informations du client
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');

  // État pour le succès de la réservation
  const [bookingComplete, setBookingComplete] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);

  // Réinitialiser le service sélectionné lorsque la catégorie change
  useEffect(() => {
    setSelectedService(null);
  }, [selectedCategory]);

  // Filtrage des services par catégorie sélectionnée
  const filteredServices = selectedCategory
    ? services.filter(service => service.isActive && service.categoryId === selectedCategory)
    : services.filter(service => service.isActive);

  // Filtre des catégories actives
  const activeCategories = categories.filter(cat => cat.isActive);
  
  // Mise à jour des créneaux horaires disponibles lorsque la date est sélectionnée
  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (selectedDate && selectedService) {
        setIsLoadingTimes(true);
        try {
          // Obtenir tous les créneaux potentiels
          const allSlots = getAvailableTimeSlots(selectedDate, selectedService.duration);
          
          // Vérifier la disponibilité réelle de chaque créneau
          const availabilityPromises = allSlots.map(async (slot) => {
            const isAvailable = await checkAvailability(selectedDate, slot, selectedService.duration);
            return { time: slot, available: isAvailable };
          });
          
          const availabilityResults = await Promise.all(availabilityPromises);
          const available = availabilityResults
            .filter(result => result.available)
            .map(result => result.time);
          
          setAvailableTimes(available);
        } catch (error) {
          console.error("Error fetching available times:", error);
          toast.error("Erreur lors du chargement des horaires disponibles");
        } finally {
          setIsLoadingTimes(false);
        }
        
        setSelectedTime(null);  // Réinitialiser le temps sélectionné
      }
    };
    
    fetchAvailableTimes();
  }, [selectedDate, selectedService]);

  // Fonction pour recommencer le processus
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
    selectedCategory,
    setSelectedCategory,
    selectedService,
    setSelectedService,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    availableTimes,
    currentStep,
    setCurrentStep,
    clientName,
    setClientName,
    clientEmail,
    setClientEmail,
    clientPhone,
    setClientPhone,
    clientNotes,
    setClientNotes,
    bookingComplete,
    setBookingComplete,
    isBooking,
    setIsBooking,
    isLoadingTimes,
    filteredServices,
    activeCategories,
    handleStartOver
  };
};
