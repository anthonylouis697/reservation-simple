
import React, { useState } from 'react';
import { Service } from '@/types/service';
import { BookingData, BookingResult } from '@/services/booking/types';
import { createBooking } from '@/services/booking';
import { toast } from 'sonner';
import { BookingStep } from '@/components/Visibility/BookingPage/types';

interface BookingFormProps {
  currentStep: number;
  isCurrentStepComplete: boolean;
  handlePrevStep: () => void;
  handleNextStep: () => void;
  selectedService: Service | null;
  selectedDate: Date | undefined;
  selectedTime: string | null;
  clientInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    notes: string;
  };
  businessId: string;
  buttonCorners: 'rounded' | 'squared' | 'pill';
  primaryColor: string;
  steps: BookingStep[];
  onBookingSuccess: (bookingResult: BookingResult) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  currentStep,
  isCurrentStepComplete,
  handlePrevStep,
  handleNextStep,
  selectedService,
  selectedDate,
  selectedTime,
  clientInfo,
  businessId,
  buttonCorners,
  primaryColor,
  steps,
  onBookingSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fonction pour soumettre une réservation
  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      toast.error("Veuillez compléter toutes les étapes");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Création des données de réservation
      const bookingData: BookingData = {
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        serviceDuration: selectedService.duration,
        date: selectedDate,
        time: selectedTime,
        clientInfo: {
          firstName: clientInfo.firstName,
          lastName: clientInfo.lastName,
          email: clientInfo.email,
          phone: clientInfo.phone || '',
        },
        notes: clientInfo.notes || '',
        businessId: businessId
      };
      
      console.log("Création de la réservation avec les données:", bookingData);
      
      // Création de la réservation via le service booking
      const result = await createBooking(bookingData);
      
      console.log("Résultat de la réservation:", result);
      
      if (result && result.id) {
        onBookingSuccess(result);
      } else {
        throw new Error("Aucun identifiant de réservation retourné");
      }
    } catch (error) {
      console.error("Erreur lors de la création de la réservation:", error);
      toast.error("Erreur lors de la création de la réservation. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonStyle = {
    backgroundColor: primaryColor,
    borderRadius: buttonCorners === 'pill' ? '9999px' : 
                 buttonCorners === 'squared' ? '0px' : '6px'
  };

  return (
    <div className="mt-10 flex justify-between">
      {currentStep > 0 ? (
        <button
          onClick={handlePrevStep}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Précédent
        </button>
      ) : (
        <div></div> // Spacer
      )}
      
      {currentStep < steps.length - 1 ? (
        <button
          onClick={handleNextStep}
          disabled={!isCurrentStepComplete}
          className="px-6 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          style={buttonStyle}
        >
          Suivant
        </button>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={!isCurrentStepComplete || isSubmitting}
          className="px-6 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          style={buttonStyle}
        >
          {isSubmitting ? "Traitement en cours..." : "Réserver"}
        </button>
      )}
    </div>
  );
};

export default BookingForm;
