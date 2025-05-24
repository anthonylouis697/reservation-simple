
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
    steps = [],
    showConfirmation = true
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8 text-center transform animate-scale-in">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
            Réservation confirmée !
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            🎉 Fantastique ! Votre réservation a été enregistrée avec succès. 
            Vous recevrez un email de confirmation dans quelques instants.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
          >
            ✨ Nouvelle réservation
          </button>
        </div>
      </div>
    );
  }

  const currentStepData = activeSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-pink-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-indigo-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <Helmet>
        <title>{businessSettings?.name || businessName || 'Réservation'} - Réservation en ligne</title>
      </Helmet>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* En-tête avec design amélioré */}
        <div className="text-center mb-12">
          {businessSettings?.logo_url && (
            <div className="mb-6">
              <img 
                src={businessSettings.logo_url} 
                alt={businessSettings.name}
                className="h-20 mx-auto rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            {businessSettings?.name || businessName || 'Réservation en ligne'}
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            ✨ Bienvenue sur notre expérience de réservation unique ✨
          </p>
          <div className="mt-4 inline-block px-6 py-2 bg-white rounded-full shadow-md">
            <span className="text-sm text-gray-500">🚀 Rapide • 🎯 Simple • 🔒 Sécurisé</span>
          </div>
        </div>

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
      </div>

      {/* Styles CSS personnalisés pour les animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(2deg); }
          50% { transform: translateY(-20px) rotate(-2deg); }
          75% { transform: translateY(-10px) rotate(1deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default BookingContent;
