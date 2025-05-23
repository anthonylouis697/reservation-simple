
import { useState, useEffect } from 'react';
import { useBookingPage } from '@/components/Visibility/BookingPage/BookingPageContext';
import { usePublicBookingData } from '@/components/Visibility/BookingPage/PublicBookingData';
import { Service } from '@/types/service';
import StepNavigation from './StepNavigation';
import StepRenderer from './StepRenderer';
import BusinessHeader from './BusinessHeader';
import { toast } from 'sonner';
import EmptyServicesState from './EmptyServicesState';
import { getAvailableTimeSlots } from '@/services/booking/availabilityService';
import { useButtonStyle } from '@/hooks/useButtonStyle';
import BookingForm from './BookingForm';
import BookingConfirmation from './BookingConfirmation';
import { BookingResult } from '@/services/booking/types';

interface BookingContentProps {
  businessId: string;
}

const BookingContent = ({ businessId }: BookingContentProps) => {
  // Use both contexts to get the required data
  const { 
    steps, 
    customTexts, 
    primaryColor, 
    buttonCorners, 
    businessName,
    welcomeMessage,
    logo 
  } = useBookingPage();
  
  // Use PublicBookingData for service-related information
  const { services, isLoading, hasServices } = usePublicBookingData();
  
  // Get button style using our custom hook
  const { getButtonStyle } = useButtonStyle({ buttonCorners, primaryColor });
  
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
          toast.error("Erreur lors du chargement des créneaux disponibles");
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
    
    switch (currentStepType.toLowerCase()) {
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
  
  // Handle booking success
  const handleBookingSuccess = (bookingResult: BookingResult) => {
    setBooking(bookingResult);
    setCurrentStep(steps.length); // Move to confirmation step (beyond normal steps)
    toast.success("Réservation confirmée !");
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
          
          <BookingForm
            currentStep={currentStep}
            isCurrentStepComplete={isCurrentStepComplete()}
            handlePrevStep={handlePrevStep}
            handleNextStep={handleNextStep}
            selectedService={selectedService}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            clientInfo={clientInfo}
            businessId={businessId}
            buttonCorners={buttonCorners}
            primaryColor={primaryColor}
            steps={steps}
            onBookingSuccess={handleBookingSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingContent;
