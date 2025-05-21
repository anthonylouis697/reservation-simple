import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBookingSteps } from '@/hooks/useBookingSteps';
import { useBookingPage } from '@/components/Visibility/BookingPage/BookingPageContext';
import { usePublicBookingData } from '@/components/Visibility/BookingPage/PublicBookingData';
import { useBookingHandler } from '@/hooks/useBookingHandler';
import { useStepNavigation } from '@/hooks/useStepNavigation';
import { useButtonStyle } from '@/hooks/useButtonStyle';
import { BookingPageContextType, BookingCustomTexts } from '@/components/Visibility/BookingPage/types';
import { defaultCustomTexts } from '@/components/Visibility/BookingPage/constants/defaultData';

// Import components
import StepNavigation from './StepNavigation';
import StepRenderer from './StepRenderer';
import LoadingScreen from './LoadingScreen';
import EmptyServicesState from './EmptyServicesState';
import BusinessHeader from './BusinessHeader';

interface BookingContentProps {
  businessId: string | null;
}

const BookingContent = ({ businessId = null }: BookingContentProps) => {
  const { businessSlug } = useParams<{ businessSlug?: string }>();
  
  // Get booking page style data and handle potential undefined values
  const bookingPageContext = useBookingPage();
  
  // Create safe default values
  const {
    businessName = "",
    welcomeMessage = "",
    primaryColor = "#9b87f5",
    secondaryColor = "#7E69AB",
    buttonCorners = "rounded" as const,
    logo = null,
    bookingButtonText = "Réserver",
    showConfirmation = true,
    confirmationMessage = "Merci pour votre réservation !",
    layoutType = "stepped" as const,
    steps = [],
    customTexts = defaultCustomTexts
  } = bookingPageContext;

  // Get services and categories
  const publicBookingData = usePublicBookingData();
  
  // Destructure with default values
  const { 
    services = [], 
    categories = [], 
    isLoading: isLoadingData = false,
    error: dataError = null
  } = publicBookingData;
  
  // Custom hook for booking steps
  const bookingSteps = useBookingSteps(
    Array.isArray(services) ? services : [], 
    Array.isArray(categories) ? categories : [], 
    Array.isArray(steps) ? steps : []
  );
  
  const {
    selectedCategory = null,
    setSelectedCategory = () => {},
    selectedService = null,
    setSelectedService = () => {},
    selectedDate = undefined,
    setSelectedDate = () => {},
    selectedTime = null,
    setSelectedTime = () => {},
    availableTimes = [],
    currentStep = 0,
    setCurrentStep = () => {},
    clientName = "",
    setClientName = () => {},
    clientEmail = "",
    setClientEmail = () => {},
    clientPhone = "",
    setClientPhone = () => {},
    clientNotes = "",
    setClientNotes = () => {},
    bookingComplete = false,
    setBookingComplete = () => {},
    isLoadingTimes = false,
    filteredServices = [],
    activeCategories = [],
    handleStartOver = () => {}
  } = bookingSteps;

  // Hook for booking handling
  const bookingHandler = useBookingHandler({
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
  });
  
  const {
    isBooking = false,
    handleBooking = () => {}
  } = bookingHandler || {};

  // Hook for step navigation
  const stepNavigation = useStepNavigation({
    selectedService,
    selectedDate,
    selectedTime,
    clientName,
    clientEmail,
    currentStep,
    setCurrentStep,
    handleBooking,
    steps: Array.isArray(steps) ? steps : []
  });
  
  const {
    handleNextStep = () => {},
    handlePrevStep = () => {},
    getStepLabel = () => "",
    getCurrentStepIcon = () => null,
    getActiveStepsLength = () => 4
  } = stepNavigation || {};

  // Hook for button styling
  const buttonStyleHook = useButtonStyle({ 
    buttonCorners: buttonCorners || "rounded", 
    primaryColor: primaryColor || "#9b87f5" 
  });
  
  const { 
    getButtonStyle = () => ({ className: "", style: { backgroundColor: "", borderColor: "" } }) 
  } = buttonStyleHook || {};

  // If data is loading
  if (isLoadingData) {
    return <LoadingScreen />;
  }

  // If no services available
  if (!Array.isArray(services) || services.length === 0) {
    return <EmptyServicesState />;
  }

  return (
    <div 
      className="max-w-4xl mx-auto p-4 md:p-8" 
      style={{ 
        '--primary-color': primaryColor || '#9b87f5',
        '--secondary-color': secondaryColor || '#7E69AB'
      } as React.CSSProperties}
    >
      {/* Header */}
      <BusinessHeader
        businessName={businessName || ""}
        welcomeMessage={welcomeMessage || ""}
        logo={logo || ""}
        primaryColor={primaryColor || ""}
      />
      
      {/* Current step content */}
      <StepRenderer
        currentStep={bookingSteps.currentStep}
        bookingComplete={bookingSteps.bookingComplete}
        customTexts={customTexts || defaultCustomTexts}
        activeCategories={bookingSteps.activeCategories || []}
        selectedCategory={bookingSteps.selectedCategory}
        setSelectedCategory={bookingSteps.setSelectedCategory}
        filteredServices={bookingSteps.filteredServices || []}
        selectedService={bookingSteps.selectedService}
        setSelectedService={bookingSteps.setSelectedService}
        selectedDate={bookingSteps.selectedDate}
        setSelectedDate={bookingSteps.setSelectedDate}
        isLoadingTimes={bookingSteps.isLoadingTimes}
        availableTimes={bookingSteps.availableTimes || []}
        selectedTime={bookingSteps.selectedTime}
        setSelectedTime={bookingSteps.setSelectedTime}
        clientName={bookingSteps.clientName}
        setClientName={bookingSteps.setClientName}
        clientEmail={bookingSteps.clientEmail}
        setClientEmail={bookingSteps.setClientEmail}
        clientPhone={bookingSteps.clientPhone}
        setClientPhone={bookingSteps.setClientPhone}
        clientNotes={bookingSteps.clientNotes}
        setClientNotes={bookingSteps.setClientNotes}
        confirmationMessage={confirmationMessage || ""}
        handleStartOver={bookingSteps.handleStartOver}
        getButtonStyle={useButtonStyle({ buttonCorners, primaryColor }).getButtonStyle}
        primaryColor={primaryColor || ""}
      />
      
      {/* Step navigation */}
      {!bookingSteps.bookingComplete && (
        <StepNavigation 
          currentStep={bookingSteps.currentStep}
          handlePrevStep={useStepNavigation({
            ...bookingSteps,
            steps
          }).handlePrevStep}
          handleNextStep={useStepNavigation({
            ...bookingSteps,
            steps
          }).handleNextStep}
          isBooking={useBookingHandler({
            businessId,
            ...bookingSteps
          }).isBooking || false}
          getButtonStyle={useButtonStyle({ buttonCorners, primaryColor }).getButtonStyle}
          getCurrentStepIcon={useStepNavigation({
            ...bookingSteps,
            steps
          }).getCurrentStepIcon}
          getStepLabel={useStepNavigation({
            ...bookingSteps,
            steps
          }).getStepLabel}
          bookingButtonText={bookingButtonText}
          activeStepsLength={useStepNavigation({
            ...bookingSteps,
            steps
          }).getActiveStepsLength()}
        />
      )}
    </div>
  );
};

export default BookingContent;
