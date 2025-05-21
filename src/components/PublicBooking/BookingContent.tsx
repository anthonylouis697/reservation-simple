
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBookingSteps } from '@/hooks/useBookingSteps';
import { useBookingPage } from '@/components/Visibility/BookingPage/BookingPageContext';
import { usePublicBookingData } from '@/components/Visibility/BookingPage/PublicBookingData';
import { useBookingHandler } from '@/hooks/useBookingHandler';
import { useStepNavigation } from '@/hooks/useStepNavigation';
import { useButtonStyle } from '@/hooks/useButtonStyle';

// Import components
import StepNavigation from './StepNavigation';
import StepRenderer from './StepRenderer';
import LoadingScreen from './LoadingScreen';
import EmptyServicesState from './EmptyServicesState';
import BusinessHeader from './BusinessHeader';

interface BookingContentProps {
  businessId: string | null;
}

const BookingContent = ({ businessId }: BookingContentProps) => {
  const { businessSlug } = useParams();
  
  // Récupération des données de style de la page de réservation
  const { 
    businessName, 
    welcomeMessage, 
    primaryColor, 
    secondaryColor, 
    buttonCorners, 
    logo, 
    bookingButtonText,
    showConfirmation,
    confirmationMessage,
    layoutType,
    steps,
    customTexts
  } = useBookingPage();

  // Récupération des services et catégories depuis la base de données
  const { services, categories, isLoading: isLoadingData } = usePublicBookingData();
  
  // Hook personnalisé pour gérer les étapes de réservation
  const {
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
    isLoadingTimes,
    filteredServices,
    activeCategories,
    handleStartOver
  } = useBookingSteps(services, categories, steps);

  // Hook pour gérer la logique de réservation
  const {
    isBooking,
    handleBooking
  } = useBookingHandler({
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

  // Hook pour gérer la navigation entre les étapes
  const {
    handleNextStep,
    handlePrevStep,
    getStepLabel,
    getCurrentStepIcon,
    getActiveStepsLength
  } = useStepNavigation({
    selectedService,
    selectedDate,
    selectedTime,
    clientName,
    clientEmail,
    currentStep,
    setCurrentStep,
    handleBooking,
    steps
  });

  // Hook pour gérer les styles des boutons
  const { getButtonStyle } = useButtonStyle({ buttonCorners, primaryColor });

  // Si les données sont en chargement
  if (isLoadingData) {
    return <LoadingScreen />;
  }

  // Si aucun service n'est disponible
  if (services.length === 0) {
    return <EmptyServicesState />;
  }
  
  // S'assurer que customTexts est un objet et non pas null/undefined
  const safeCustomTexts = customTexts || {};

  return (
    <div 
      className="max-w-4xl mx-auto p-4 md:p-8" 
      style={{ 
        '--primary-color': primaryColor,
        '--secondary-color': secondaryColor
      } as React.CSSProperties}
    >
      {/* En-tête */}
      <BusinessHeader
        businessName={businessName}
        welcomeMessage={welcomeMessage}
        logo={logo}
        primaryColor={primaryColor}
      />
      
      {/* Contenu de l'étape en cours via le StepRenderer */}
      <StepRenderer
        currentStep={currentStep}
        bookingComplete={bookingComplete}
        customTexts={safeCustomTexts}
        activeCategories={activeCategories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        filteredServices={filteredServices}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        isLoadingTimes={isLoadingTimes}
        availableTimes={availableTimes}
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
        primaryColor={primaryColor}
      />
      
      {/* Navigation des étapes */}
      {!bookingComplete && (
        <StepNavigation 
          currentStep={currentStep}
          handlePrevStep={handlePrevStep}
          handleNextStep={handleNextStep}
          isBooking={isBooking}
          getButtonStyle={getButtonStyle}
          getCurrentStepIcon={getCurrentStepIcon}
          getStepLabel={getStepLabel}
          bookingButtonText={bookingButtonText || "Réserver"}
          activeStepsLength={getActiveStepsLength()}
        />
      )}
    </div>
  );
};

export default BookingContent;
