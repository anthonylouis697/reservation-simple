
import { useState } from 'react';
import { toast } from 'sonner';
import { createBooking, checkAvailability, BookingData } from '@/services/bookingService';
import { Service } from '@/types/service';

interface BookingHandlerProps {
  businessId: string | null;
  selectedService: Service | null;
  selectedDate: Date | undefined;
  selectedTime: string | null;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientNotes: string;
  setCurrentStep: (step: number) => void;
  setBookingComplete: (complete: boolean) => void;
}

export const useBookingHandler = ({
  businessId,
  selectedService,
  selectedDate,
  selectedTime,
  clientName,
  clientEmail,
  clientPhone,
  clientNotes,
  setCurrentStep,
  setBookingComplete
}: BookingHandlerProps) => {
  const [isBooking, setIsBooking] = useState(false);
  
  // Fonction pour soumettre la réservation
  const handleBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !clientName || !clientEmail || !businessId) {
      toast.error("Informations incomplètes. Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setIsBooking(true);
    
    try {
      // Vérifier à nouveau la disponibilité avant de finaliser
      const isAvailable = await checkAvailability(
        businessId, 
        selectedDate, 
        selectedTime, 
        selectedService.duration
      );
      
      if (!isAvailable) {
        toast.error("Ce créneau n'est plus disponible. Veuillez en choisir un autre.");
        // Retour à l'étape de sélection d'horaire
        setCurrentStep(2);
        setIsBooking(false);
        return;
      }
      
      // Préparer les données de réservation
      const bookingData: BookingData = {
        businessId: businessId,
        serviceId: selectedService.id,
        date: selectedDate,
        time: selectedTime,
        client: {
          name: clientName,
          email: clientEmail,
          phone: clientPhone || undefined,
          notes: clientNotes || undefined
        }
      };
      
      // Enregistrer la réservation
      const booking = await createBooking(bookingData);
      
      // Afficher le message de confirmation
      setBookingComplete(true);
      toast.success("Votre réservation a été enregistrée avec succès!");
      
      console.log("Réservation enregistrée:", booking);
    } catch (error) {
      console.error("Erreur lors de la création de la réservation:", error);
      toast.error("Une erreur est survenue lors de la réservation. Veuillez réessayer.");
    } finally {
      setIsBooking(false);
    }
  };

  return {
    isBooking,
    setIsBooking,
    handleBooking
  };
};
