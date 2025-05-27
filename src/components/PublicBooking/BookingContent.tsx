
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { usePublicBookingData } from '@/components/Visibility/BookingPage/PublicBookingData';
import { useBookingPage } from '@/components/Visibility/BookingPage/BookingPageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { defaultCustomTexts } from '@/components/Visibility/BookingPage/constants/defaultData';

// Composants refactorisés
import StepRenderer from './StepRenderer';
import BookingProgress from './BookingProgress';
import BookingForm from './BookingForm';
import BookingLayout from './BookingLayout';
import BusinessHeader from './BusinessHeader';
import BookingSuccess from './BookingSuccess';
import { useBookingState } from './BookingStateManager';
import { useTimeSlots } from './TimeSlotManager';

interface BookingContentProps {
  businessId: string;
}

const BookingContent = ({ businessId }: BookingContentProps) => {
  const { services: bookingServices = [], isLoading } = usePublicBookingData();
  const { 
    businessName,
    primaryColor = '#9b87f5',
    buttonCorners = 'rounded',
    customTexts = defaultCustomTexts,
    steps = [],
    showConfirmation = true
  } = useBookingPage();

  // Convert showConfirmation to boolean properly with type safety
  const confirmationEnabled: boolean = (() => {
    if (typeof showConfirmation === 'boolean') {
      return showConfirmation;
    }
    if (typeof showConfirmation === 'string') {
      return showConfirmation === 'true';
    }
    return true; // default fallback
  })();

  // États de la réservation
  const {
    currentStep,
    selectedService,
    setSelectedService,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    clientInfo,
    setClientInfo,
    bookingComplete,
    businessSettings,
    setBusinessSettings,
    isCurrentStepComplete,
    handlePrevStep,
    handleNextStep,
    handleBookingSuccess
  } = useBookingState({
    businessId,
    onBookingSuccess: (result) => {
      toast.success('Votre réservation a été confirmée !');
    }
  });

  // Gestion des créneaux horaires
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);

  useTimeSlots({
    selectedDate,
    selectedService,
    onTimesChange: setAvailableTimes,
    onLoadingChange: setIsLoadingTimes
  });

  console.log('BookingContent - Services reçus:', bookingServices?.length || 0);
  console.log('BookingContent - Steps:', steps);

  // Charger les paramètres de l'entreprise
  useEffect(() => {
    const loadBusinessSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', businessId)
          .single();

        if (error) {
          console.error('Erreur lors du chargement des paramètres:', error);
          return;
        }

        setBusinessSettings(data);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    if (businessId) {
      loadBusinessSettings();
    }
  }, [businessId, setBusinessSettings]);

  // Réinitialiser la sélection d'heure lorsque la date change
  useEffect(() => {
    setSelectedTime(null);
  }, [selectedDate, setSelectedTime]);

  // Filtrer les étapes actives
  const activeSteps = steps.filter(step => step.enabled);

  // Fonction pour obtenir le style des boutons
  const getButtonStyle = () => {
    const borderRadius = buttonCorners === 'pill' ? '9999px' : 
                        buttonCorners === 'squared' ? '0px' : '6px';
    
    return {
      className: "px-8 py-3 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg transform hover:scale-105",
      style: {
        backgroundColor: primaryColor,
        borderColor: primaryColor,
        borderRadius: borderRadius,
        boxShadow: `0 4px 15px ${primaryColor}30`
      }
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-purple-200 border-r-purple-600 mx-auto animate-ping"></div>
          </div>
          <p className="mt-6 text-lg text-gray-700 font-medium">Chargement de votre expérience de réservation...</p>
          <div className="mt-2 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (bookingComplete) {
    return <BookingSuccess onStartOver={() => window.location.reload()} />;
  }

  const currentStepData = activeSteps[currentStep];

  return (
    <BookingLayout>
      <Helmet>
        <title>{businessSettings?.name || businessName || 'Réservation'} - Réservation en ligne</title>
      </Helmet>
      
      {/* En-tête avec design amélioré */}
      <BusinessHeader 
        businessSettings={businessSettings}
        businessName={businessName}
      />

      {/* Indicateur de progression avec design amélioré */}
      <div className="mb-12">
        <BookingProgress 
          currentStep={currentStep}
          totalSteps={activeSteps.length}
          steps={activeSteps}
        />
      </div>

      {/* Contenu de l'étape avec design amélioré */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
        {currentStepData && (
          <StepRenderer
            currentStep={currentStepData}
            services={bookingServices}
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

      {/* Boutons de navigation avec design amélioré */}
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
        steps={activeSteps}
        onBookingSuccess={handleBookingSuccess}
      />
    </BookingLayout>
  );
};

export default BookingContent;
