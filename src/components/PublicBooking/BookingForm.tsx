
import React, { useState } from 'react';
import { Service } from '@/types/service';
import { BookingData, BookingResult } from '@/services/booking/types';
import { createBooking } from '@/services/booking';
import { toast } from 'sonner';
import { BookingStep } from '@/components/Visibility/BookingPage/types';
import { ArrowLeft, ArrowRight, Sparkles, Calendar } from 'lucide-react';

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
  
  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      toast.error("Veuillez compléter toutes les étapes");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
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
    borderRadius: buttonCorners === 'pill' ? '9999px' : 
                 buttonCorners === 'squared' ? '0px' : '16px'
  };

  const isLastStep = currentStep >= steps.length - 1;

  return (
    <div className="mt-12 flex justify-between items-center">
      {currentStep > 0 ? (
        <button
          onClick={handlePrevStep}
          className="group flex items-center px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          style={buttonStyle}
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-gray-700">Précédent</span>
        </button>
      ) : (
        <div></div>
      )}
      
      {!isLastStep ? (
        <button
          onClick={handleNextStep}
          disabled={!isCurrentStepComplete}
          className={`
            group flex items-center px-8 py-3 text-white font-semibold shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            transition-all duration-300 transform hover:scale-105 hover:shadow-xl
            ${isCurrentStepComplete ? 'hover:shadow-2xl' : ''}
          `}
          style={{
            ...buttonStyle,
            backgroundColor: primaryColor,
            boxShadow: isCurrentStepComplete ? `0 8px 25px ${primaryColor}40` : '0 4px 15px rgba(0,0,0,0.1)'
          }}
        >
          <span>Suivant</span>
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={!isCurrentStepComplete || isSubmitting}
          className={`
            group flex items-center px-8 py-4 text-white font-bold shadow-xl
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            transition-all duration-300 transform hover:scale-105 hover:shadow-2xl
            ${isCurrentStepComplete && !isSubmitting ? 'animate-pulse' : ''}
          `}
          style={{
            ...buttonStyle,
            background: isCurrentStepComplete && !isSubmitting 
              ? `linear-gradient(135deg, ${primaryColor}, #8b5cf6)` 
              : primaryColor,
            boxShadow: isCurrentStepComplete 
              ? `0 12px 35px ${primaryColor}50` 
              : '0 4px 15px rgba(0,0,0,0.1)'
          }}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
              Traitement en cours...
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5 mr-2" />
              Confirmer ma réservation
              <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default BookingForm;
