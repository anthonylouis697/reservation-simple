import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { usePublicBookingData } from '@/components/Visibility/BookingPage/PublicBookingData';
import { useBookingPage } from '@/components/Visibility/BookingPage/BookingPageContext';
import StepRenderer from './StepRenderer';
import BookingProgress from './BookingProgress';
import BookingForm from './BookingForm';
import { Service } from '@/types/service';
import { BookingResult } from '@/services/booking/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { defaultCustomTexts } from '@/components/Visibility/BookingPage/constants/defaultData';

interface BookingContentProps {
  businessId: string;
}

const BookingContent = ({ businessId }: BookingContentProps) => {
  // Utiliser les bons hooks
  const { services: bookingServices = [], isLoading } = usePublicBookingData();
  const { 
    businessName,
    primaryColor = '#9b87f5',
    buttonCorners = 'rounded',
    customTexts = defaultCustomTexts,
    steps = []
  } = useBookingPage();

  // États pour le processus de réservation
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [businessSettings, setBusinessSettings] = useState<any>(null);
  
  // Informations du client
  const [clientInfo, setClientInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
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
  }, [businessId]);

  // Filtrer les étapes actives
  const activeSteps = steps.filter(step => step.enabled);

  // Fonction pour obtenir le style des boutons
  const getButtonStyle = () => {
    return {
      className: "px-6 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
      style: {
        backgroundColor: primaryColor,
        borderColor: primaryColor,
        borderRadius: buttonCorners === 'pill' ? '9999px' : 
                    buttonCorners === 'squared' ? '0px' : '6px'
      }
    };
  };

  // Générer les créneaux horaires disponibles
  useEffect(() => {
    const generateTimeSlots = async () => {
      if (!selectedDate || !selectedService) {
        setAvailableTimes([]);
        return;
      }
      
      setIsLoadingTimes(true);
      
      try {
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Générer des créneaux toutes les 30 minutes de 8h à 18h
        const times = [];
        const startHour = 8;
        const endHour = 18;
        
        for (let hour = startHour; hour < endHour; hour++) {
          times.push(`${hour.toString().padStart(2, '0')}:00`);
          times.push(`${hour.toString().padStart(2, '0')}:30`);
        }
        
        setAvailableTimes(times);
      } catch (error) {
        console.error('Erreur lors de la génération des créneaux:', error);
        setAvailableTimes([]);
      } finally {
        setIsLoadingTimes(false);
      }
    };
    
    generateTimeSlots();
  }, [selectedDate, selectedService]);

  // Réinitialiser la sélection d'heure lorsque la date change
  useEffect(() => {
    setSelectedTime(null);
  }, [selectedDate]);

  // Vérifier si l'étape actuelle est complète
  const isCurrentStepComplete = () => {
    if (currentStep === 0) return selectedService !== null;
    if (currentStep === 1) return selectedDate !== undefined;
    if (currentStep === 2) return selectedTime !== null;
    if (currentStep === 3) return clientInfo.firstName && clientInfo.lastName && clientInfo.email;
    return false;
  };

  // Navigation entre les étapes
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < activeSteps.length - 1 && isCurrentStepComplete()) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Fonction pour gérer la réservation
  const handleBookingSuccess = (bookingResult: BookingResult) => {
    console.log('Réservation réussie:', bookingResult);
    setBookingComplete(true);
    toast.success('Votre réservation a été confirmée !');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Réservation confirmée !</h2>
          <p className="text-gray-600 mb-6">
            Votre réservation a été enregistrée avec succès. Vous recevrez un email de confirmation.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Nouvelle réservation
          </button>
        </div>
      </div>
    );
  }

  const currentStepData = activeSteps[currentStep];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{businessSettings?.name || businessName || 'Réservation'} - Réservation en ligne</title>
      </Helmet>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          {businessSettings?.logo_url && (
            <img 
              src={businessSettings.logo_url} 
              alt={businessSettings.name}
              className="h-16 mx-auto mb-4"
            />
          )}
          <h1 className="text-3xl font-bold text-gray-900">
            {businessSettings?.name || businessName || 'Réservation en ligne'}
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenue sur notre page de réservation
          </p>
        </div>

        {/* Indicateur de progression */}
        <BookingProgress 
          currentStep={currentStep}
          totalSteps={activeSteps.length}
          steps={activeSteps}
        />

        {/* Contenu de l'étape */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
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

        {/* Boutons de navigation */}
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
      </div>
    </div>
  );
};

export default BookingContent;
