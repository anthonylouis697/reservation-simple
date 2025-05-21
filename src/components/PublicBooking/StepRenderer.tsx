
import { Service } from '@/types/service';
import ServiceSelection from './ServiceSelection';
import DateSelection from './DateSelection';
import TimeSelection from './TimeSelection';
import ClientInfoForm from './ClientInfoForm';
import BookingConfirmation from './BookingConfirmation';

interface StepRendererProps {
  currentStep: number;
  bookingComplete: boolean;
  customTexts: Record<string, string>;
  activeCategories: any[];
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
  filteredServices: Service[];
  selectedService: Service | null;
  setSelectedService: (service: Service) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  isLoadingTimes: boolean;
  availableTimes: string[];
  selectedTime: string | null;
  setSelectedTime: (time: string) => void;
  clientName: string;
  setClientName: (name: string) => void;
  clientEmail: string;
  setClientEmail: (email: string) => void;
  clientPhone: string;
  setClientPhone: (phone: string) => void;
  clientNotes: string;
  setClientNotes: (notes: string) => void;
  confirmationMessage: string;
  handleStartOver: () => void;
  getButtonStyle: () => { className: string; style: { backgroundColor: string; borderColor: string } };
  primaryColor: string;
}

const StepRenderer = ({
  currentStep,
  bookingComplete,
  customTexts,
  activeCategories,
  selectedCategory,
  setSelectedCategory,
  filteredServices,
  selectedService,
  setSelectedService,
  selectedDate,
  setSelectedDate,
  isLoadingTimes,
  availableTimes,
  selectedTime,
  setSelectedTime,
  clientName,
  setClientName,
  clientEmail,
  setClientEmail,
  clientPhone,
  setClientPhone,
  clientNotes,
  setClientNotes,
  confirmationMessage,
  handleStartOver,
  getButtonStyle,
  primaryColor,
}: StepRendererProps) => {
  
  // S'assurer que customTexts est un objet pour éviter les erreurs
  const safeCustomTexts = customTexts || {};
  
  if (bookingComplete) {
    return (
      <BookingConfirmation 
        confirmationMessage={confirmationMessage || "Merci pour votre réservation !"}
        handleStartOver={handleStartOver}
        getButtonStyle={getButtonStyle}
      />
    );
  }

  switch (currentStep) {
    case 0: // Sélection du service
      return (
        <ServiceSelection
          customTexts={safeCustomTexts}
          activeCategories={activeCategories || []}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          filteredServices={filteredServices || []}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          getButtonStyle={getButtonStyle}
          primaryColor={primaryColor || "#9b87f5"}
        />
      );

    case 1: // Sélection de la date
      return (
        <DateSelection
          customTexts={safeCustomTexts}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedService={selectedService}
        />
      );

    case 2: // Sélection de l'horaire
      return (
        <TimeSelection
          customTexts={safeCustomTexts}
          isLoadingTimes={isLoadingTimes}
          availableTimes={availableTimes || []}
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
          customTexts={safeCustomTexts}
          clientName={clientName || ""}
          setClientName={setClientName}
          clientEmail={clientEmail || ""}
          setClientEmail={setClientEmail}
          clientPhone={clientPhone || ""}
          setClientPhone={setClientPhone}
          clientNotes={clientNotes || ""}
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

export default StepRenderer;
