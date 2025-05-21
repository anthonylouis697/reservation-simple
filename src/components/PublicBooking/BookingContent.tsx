
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBookingSteps } from '@/hooks/useBookingSteps';
import { useBookingPage } from '@/components/Visibility/BookingPage/BookingPageContext';
import { usePublicBookingData } from '@/components/Visibility/BookingPage/PublicBookingData';
import { createBooking, checkAvailability, BookingData } from '@/services/bookingService';

// Import steps components
import BookingConfirmation from './BookingConfirmation';
import ServiceSelection from './ServiceSelection';
import DateSelection from './DateSelection';
import TimeSelection from './TimeSelection';
import ClientInfoForm from './ClientInfoForm';
import StepNavigation from './StepNavigation';

const BookingContent = () => {
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
    isBooking,
    setIsBooking,
    isLoadingTimes,
    filteredServices,
    activeCategories,
    handleStartOver
  } = useBookingSteps(services, categories, steps);

  // Styles dynamiques basés sur la configuration
  const getButtonStyle = () => {
    let roundedClass = '';
    
    switch (buttonCorners) {
      case 'squared': roundedClass = 'rounded-none'; break;
      case 'rounded': roundedClass = 'rounded-md'; break;
      case 'pill': roundedClass = 'rounded-full'; break;
      default: roundedClass = 'rounded-md';
    }
    
    return {
      className: `${roundedClass} transition-colors`,
      style: { backgroundColor: primaryColor, borderColor: primaryColor }
    };
  };

  // Fonction pour passer à l'étape suivante
  const handleNextStep = () => {
    // Validation de l'étape actuelle
    if (currentStep === 0 && !selectedService) {
      toast.error("Veuillez sélectionner un service");
      return;
    }
    
    if (currentStep === 1 && !selectedDate) {
      toast.error("Veuillez sélectionner une date");
      return;
    }
    
    if (currentStep === 2 && !selectedTime) {
      toast.error("Veuillez sélectionner un horaire");
      return;
    }
    
    if (currentStep === 3 && (!clientName || !clientEmail)) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // Si nous sommes à la dernière étape, finaliser la réservation
    const activeSteps = steps.filter(step => step.enabled);
    if (currentStep === activeSteps.length - 1) {
      handleBooking();
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };

  // Fonction pour revenir à l'étape précédente
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Fonction pour soumettre la réservation
  const handleBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !clientName || !clientEmail) {
      toast.error("Informations incomplètes. Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setIsBooking(true);
    
    try {
      // Vérifier à nouveau la disponibilité avant de finaliser
      const isAvailable = await checkAvailability(selectedDate, selectedTime, selectedService.duration);
      
      if (!isAvailable) {
        toast.error("Ce créneau n'est plus disponible. Veuillez en choisir un autre.");
        // Retour à l'étape de sélection d'horaire
        setCurrentStep(2);
        setIsBooking(false);
        return;
      }
      
      // Préparer les données de réservation
      const bookingData: BookingData = {
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

  // Affichage du label de l'étape en cours
  const getStepLabel = (index: number) => {
    const activeSteps = steps.filter(step => step.enabled);
    if (index >= 0 && index < activeSteps.length) {
      return activeSteps[index].customLabel || activeSteps[index].name;
    }
    return "";
  };

  // Récupération de l'icône de l'étape en cours
  const getCurrentStepIcon = () => {
    const activeSteps = steps.filter(step => step.enabled);
    if (currentStep >= 0 && currentStep < activeSteps.length) {
      const StepIcon = activeSteps[currentStep].icon;
      return <StepIcon className="h-6 w-6" />;
    }
    return null;
  };

  // Si les données sont en chargement
  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement des services disponibles...</p>
        </div>
      </div>
    );
  }

  // Si aucun service n'est disponible
  if (services.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Aucun service disponible</h2>
          <p className="text-gray-600 mb-6">
            Cette entreprise n'a pas encore configuré ses services de réservation. 
            Veuillez réessayer ultérieurement ou contacter directement l'entreprise.
          </p>
        </div>
      </div>
    );
  }

  // Affichage du contenu en fonction de l'étape du processus
  const renderStepContent = () => {
    const activeSteps = steps.filter(step => step.enabled);
    
    if (bookingComplete) {
      return (
        <BookingConfirmation 
          confirmationMessage={confirmationMessage}
          handleStartOver={handleStartOver}
          getButtonStyle={getButtonStyle}
        />
      );
    }

    switch (currentStep) {
      case 0: // Sélection du service
        return (
          <ServiceSelection
            customTexts={customTexts}
            activeCategories={activeCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            filteredServices={filteredServices}
            selectedService={selectedService}
            setSelectedService={setSelectedService}
            getButtonStyle={getButtonStyle}
            primaryColor={primaryColor}
          />
        );

      case 1: // Sélection de la date
        return (
          <DateSelection
            customTexts={customTexts}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedService={selectedService}
          />
        );

      case 2: // Sélection de l'horaire
        return (
          <TimeSelection
            customTexts={customTexts}
            isLoadingTimes={isLoadingTimes}
            availableTimes={availableTimes}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            selectedService={selectedService}
            selectedDate={selectedDate}
            getButtonStyle={getButtonStyle}
          />
        );

      case 3: // Informations du client
        return (
          <ClientInfoForm
            customTexts={customTexts}
            clientName={clientName}
            setClientName={setClientName}
            clientEmail={clientEmail}
            setClientEmail={setClientEmail}
            clientPhone={clientPhone}
            setClientPhone={setClientPhone}
            clientNotes={clientNotes}
            setClientNotes={setClientNotes}
            selectedService={selectedService}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="max-w-4xl mx-auto p-4 md:p-8" 
      style={{ 
        '--primary-color': primaryColor,
        '--secondary-color': secondaryColor
      } as React.CSSProperties}
    >
      {/* En-tête */}
      <div className="mb-8 text-center">
        {logo && (
          <div className="mb-4 flex justify-center">
            <img src={logo} alt={businessName} className="h-16" />
          </div>
        )}
        <h1 className="text-3xl font-bold" style={{ color: primaryColor }}>{businessName}</h1>
        {welcomeMessage && <p className="mt-2 text-gray-600">{welcomeMessage}</p>}
      </div>
      
      {/* Contenu de l'étape en cours */}
      {renderStepContent()}
      
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
          bookingButtonText={bookingButtonText}
          activeStepsLength={steps.filter(step => step.enabled).length}
        />
      )}
    </div>
  );
};

export default BookingContent;
