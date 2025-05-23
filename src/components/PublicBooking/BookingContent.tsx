import { useState, useEffect } from 'react';
import { useBookingPage } from '@/components/Visibility/BookingPage/BookingPageContext';
import { usePublicBookingData } from '@/components/Visibility/BookingPage/PublicBookingData';
import { Service } from '@/types/service';
import StepNavigation from './StepNavigation';
import StepRenderer from './StepRenderer';
import BusinessHeader from './BusinessHeader';
import BookingConfirmation from './BookingConfirmation';
import { BookingData, BookingResult } from '@/services/booking/types';
import { createBooking } from '@/services/booking';
import { toast } from 'sonner';
import EmptyServicesState from './EmptyServicesState';
import { getAvailableTimeSlots } from '@/services/booking/availabilityService';

interface BookingContentProps {
  businessId: string;
}

const BookingContent = ({ businessId }: BookingContentProps) => {
  const { 
    services, 
    isLoading, 
    hasServices, 
    steps, 
    customTexts, 
    primaryColor, 
    buttonCorners, 
    businessName,
    welcomeMessage,
    logo 
  } = useBookingPage();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientInfo, setClientInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [booking, setBooking] = useState<BookingResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  
  // Reset selected time when date or service changes
  useEffect(() => {
    if (selectedDate && selectedService) {
      setSelectedTime(null);
      setIsLoadingTimes(true);
      
      // Fetch available times based on availability settings
      const fetchAvailableTimes = async () => {
        try {
          if (!businessId || !selectedService) {
            setAvailableTimes([]);
            return;
          }
          
          const times = await getAvailableTimeSlots(
            businessId,
            selectedDate,
            selectedService.duration
          );
          
          console.log("Available times fetched:", times);
          setAvailableTimes(times);
        } catch (error) {
          console.error("Error fetching available times:", error);
          setAvailableTimes([]);
        } finally {
          setIsLoadingTimes(false);
        }
      };
      
      fetchAvailableTimes();
    }
  }, [selectedDate, selectedService, businessId]);

  // Handle step change
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Helper to determine if current step is complete
  const isCurrentStepComplete = () => {
    if (!steps[currentStep]) {
      return false;
    }
    
    const currentStepType = steps[currentStep].type;
    
    switch (currentStepType) {
      case 'service':
        return selectedService !== null;
      case 'date':
        return selectedDate !== undefined;
      case 'time':
        return selectedTime !== null;
      case 'client_info':
        return clientInfo.firstName && clientInfo.lastName && clientInfo.email;
      default:
        return true;
    }
  };
  
  // Get button style based on booking page settings
  const getButtonStyle = () => {
    let className = "bg-primary hover:bg-primary/90";
    
    // Add corners based on buttonCorners setting
    if (buttonCorners === "pill") {
      className += " rounded-full";
    } else if (buttonCorners === "squared") {
      className += " rounded-none";
    } else {
      className += " rounded-md";
    }
    
    return {
      className,
      style: {
        backgroundColor: primaryColor,
        borderColor: primaryColor
      }
    };
  };
  
  // Handle booking submission
  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      toast.error("Veuillez compléter toutes les étapes");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a booking data object
      const bookingData: BookingData = {
        serviceId: selectedService.id,
        serviceName: selectedService.name,
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
      
      // Create the booking
      const result = await createBooking(bookingData);
      
      setBooking(result);
      // Move to end state without adding extra step
      setCurrentStep(steps.length);
      
      toast.success("Réservation confirmée !");
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Erreur lors de la création de la réservation");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="py-10">
        <div className="max-w-3xl mx-auto px-4">
          <BusinessHeader 
            businessName={businessName ?? ""}
            primaryColor={primaryColor} 
            logo={logo}
            welcomeMessage={welcomeMessage}
          />
          <div className="mt-10 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!hasServices || services.length === 0) {
    return (
      <div className="py-10">
        <div className="max-w-3xl mx-auto px-4">
          <BusinessHeader 
            businessName={businessName ?? ""}
            primaryColor={primaryColor}
            logo={logo}
            welcomeMessage={welcomeMessage}
          />
          <EmptyServicesState businessName={businessName ?? ""} />
        </div>
      </div>
    );
  }
  
  // Show confirmation page if booking is complete
  if (currentStep >= steps.length && booking) {
    return (
      <div className="py-10">
        <div className="max-w-3xl mx-auto px-4">
          <BusinessHeader 
            businessName={businessName ?? ""}
            primaryColor={primaryColor}
            logo={logo}
            welcomeMessage={welcomeMessage}
          />
          <BookingConfirmation 
            booking={booking}
            customTexts={customTexts}
            primaryColor={primaryColor}
            getButtonStyle={getButtonStyle}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="max-w-3xl mx-auto px-4">
        <BusinessHeader 
          businessName={businessName ?? ""}
          primaryColor={primaryColor}
          logo={logo}
          welcomeMessage={welcomeMessage}
        />
        
        <div className="mt-6">
          <StepNavigation 
            steps={steps}
            currentStep={currentStep} 
            primaryColor={primaryColor} 
          />
          
          <div className="mt-6">
            {steps[currentStep] && (
              <StepRenderer 
                currentStep={steps[currentStep]}
                services={services}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                clientInfo={clientInfo}
                setClientInfo={setClientInfo}
                availableTimes={availableTimes}
                isLoadingTimes={isLoadingTimes}
                customTexts={customTexts}
                getButtonStyle={getButtonStyle}
                primaryColor={primaryColor}
                businessId={businessId}
              />
            )}
          </div>
          
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
                disabled={!isCurrentStepComplete()}
                className={`px-6 py-2 ${getButtonStyle().className} text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                style={getButtonStyle().style}
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isCurrentStepComplete() || isSubmitting}
                className={`px-6 py-2 ${getButtonStyle().className} text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                style={getButtonStyle().style}
              >
                {isSubmitting ? "Traitement en cours..." : "Réserver"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingContent;
