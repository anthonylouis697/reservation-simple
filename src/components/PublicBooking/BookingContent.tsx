
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBookingSteps } from '@/hooks/useBookingSteps';
import { useBookingPage } from '@/components/Visibility/BookingPage/BookingPageContext';
import { usePublicBookingData } from '@/components/Visibility/BookingPage/PublicBookingData';
import { useBookingHandler } from '@/hooks/useBookingHandler';
import { useStepNavigation } from '@/hooks/useStepNavigation';
import { useButtonStyle } from '@/hooks/useButtonStyle';
import { BookingPageContextType } from '@/components/Visibility/BookingPage/types';

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
  
  // Get booking page style data with explicit type and default values
  const bookingPageData: BookingPageContextType = useBookingPage() || {
    businessName: "",
    welcomeMessage: "",
    primaryColor: "#9b87f5",
    secondaryColor: "#7E69AB",
    buttonCorners: "rounded" as const,
    logo: "",
    bookingButtonText: "Réserver",
    showConfirmation: true,
    confirmationMessage: "Merci pour votre réservation !",
    layoutType: "stepped" as const,
    steps: [],
    customTexts: {},
    // Including other required properties with default values
    selectedTemplate: "standard",
    templates: {},
    setSelectedTemplate: () => {},
    setPrimaryColor: () => {},
    setSecondaryColor: () => {},
    setButtonCorners: () => {},
    setSteps: () => {},
    handleStepChange: () => {},
    updateStepLabel: () => {},
    setBusinessName: () => {},
    setWelcomeMessage: () => {},
    setLogo: () => {},
    customUrl: "",
    setCustomUrl: () => {},
    setBookingButtonText: () => {},
    setShowConfirmation: () => {},
    setConfirmationMessage: () => {},
    setLayoutType: () => {},
    updateCustomText: () => {},
    saveBookingPageSettings: async () => {}
  };
  
  // Destructure with default values to prevent undefined errors
  const { 
    businessName = "", 
    welcomeMessage = "", 
    primaryColor = "#9b87f5", 
    secondaryColor = "#7E69AB", 
    buttonCorners = "rounded" as const, 
    logo = "", 
    bookingButtonText = "Réserver",
    showConfirmation = true,
    confirmationMessage = "Merci pour votre réservation !",
    layoutType = "stepped" as const,
    steps = [],
    customTexts = {}
  } = bookingPageData;

  // Get services and categories with explicit type
  const publicBookingData = usePublicBookingData() || {
    services: [],
    categories: [],
    isLoading: false,
    error: null
  };
  
  // Destructure with default values
  const { 
    services = [], 
    categories = [], 
    isLoading: isLoadingData = false 
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
        currentStep={currentStep}
        bookingComplete={bookingComplete}
        customTexts={customTexts || {}}
        activeCategories={activeCategories || []}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        filteredServices={filteredServices || []}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        isLoadingTimes={isLoadingTimes}
        availableTimes={availableTimes || []}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        clientName={clientName}
        setClientName={setClientName}
        clientEmail={clientEmail}
        setClientEmail={setClientEmail}
        clientPhone={clientPhone}
        setClientPhone={setClientPhone}
        clientNotes={clientNotes}
        setClientNotes={setClientNotes}
        confirmationMessage={confirmationMessage || ""}
        handleStartOver={handleStartOver}
        getButtonStyle={getButtonStyle}
        primaryColor={primaryColor || ""}
      />
      
      {/* Step navigation */}
      {!bookingComplete && (
        <StepNavigation 
          currentStep={currentStep}
          handlePrevStep={handlePrevStep}
          handleNextStep={handleNextStep}
          isBooking={isBooking}
          getButtonStyle={getButtonStyle}
          getCurrentStepIcon={getCurrentStepIcon}
          getStepLabel={getStepLabel}
          bookingButtonText={bookingButtonText}
          activeStepsLength={getActiveStepsLength()}
        />
      )}
    </div>
  );
};

export default BookingContent;
