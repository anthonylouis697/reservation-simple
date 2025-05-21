
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
  currentStep = 0,
  bookingComplete = false,
  customTexts = {},
  activeCategories = [],
  selectedCategory = null,
  setSelectedCategory = () => {},
  filteredServices = [],
  selectedService = null,
  setSelectedService = () => {},
  selectedDate = undefined,
  setSelectedDate = () => {},
  isLoadingTimes = false,
  availableTimes = [],
  selectedTime = null,
  setSelectedTime = () => {},
  clientName = "",
  setClientName = () => {},
  clientEmail = "",
  setClientEmail = () => {},
  clientPhone = "",
  setClientPhone = () => {},
  clientNotes = "",
  setClientNotes = () => {},
  confirmationMessage = "Merci pour votre réservation !",
  handleStartOver = () => {},
  getButtonStyle = () => ({ className: "", style: { backgroundColor: "", borderColor: "" } }),
  primaryColor = "#9b87f5",
}: StepRendererProps) => {
  
  // S'assurer d'avoir des fonctions valides  
  const safeSetSelectedCategory = setSelectedCategory || (() => {});
  const safeSetSelectedService = setSelectedService || (() => {});
  const safeSetSelectedDate = setSelectedDate || (() => {});
  const safeSetSelectedTime = setSelectedTime || (() => {});
  const safeSetClientName = setClientName || (() => {});
  const safeSetClientEmail = setClientEmail || (() => {});
  const safeSetClientPhone = setClientPhone || (() => {});
  const safeSetClientNotes = setClientNotes || (() => {});
  const safeHandleStartOver = handleStartOver || (() => {});
  const safeGetButtonStyle = getButtonStyle || (() => ({ className: "", style: { backgroundColor: "", borderColor: "" } }));
  
  if (bookingComplete) {
    return (
      <BookingConfirmation 
        confirmationMessage={confirmationMessage}
        handleStartOver={safeHandleStartOver}
        getButtonStyle={safeGetButtonStyle}
      />
    );
  }

  switch (currentStep) {
    case 0: // Sélection du service
      return (
        <ServiceSelection
          customTexts={customTexts || {}}
          activeCategories={activeCategories || []}
          selectedCategory={selectedCategory}
          setSelectedCategory={safeSetSelectedCategory}
          filteredServices={filteredServices || []}
          selectedService={selectedService}
          setSelectedService={safeSetSelectedService}
          getButtonStyle={safeGetButtonStyle}
          primaryColor={primaryColor || "#9b87f5"}
        />
      );

    case 1: // Sélection de la date
      return (
        <DateSelection
          customTexts={customTexts || {}}
          selectedDate={selectedDate}
          setSelectedDate={safeSetSelectedDate}
          selectedService={selectedService}
        />
      );

    case 2: // Sélection de l'horaire
      return (
        <TimeSelection
          customTexts={customTexts || {}}
          isLoadingTimes={isLoadingTimes}
          availableTimes={availableTimes || []}
          selectedTime={selectedTime}
          setSelectedTime={safeSetSelectedTime}
          selectedService={selectedService}
          selectedDate={selectedDate}
          getButtonStyle={safeGetButtonStyle}
        />
      );

    case 3: // Informations du client
      return (
        <ClientInfoForm
          customTexts={customTexts || {}}
          clientName={clientName}
          setClientName={safeSetClientName}
          clientEmail={clientEmail}
          setClientEmail={safeSetClientEmail}
          clientPhone={clientPhone}
          setClientPhone={safeSetClientPhone}
          clientNotes={clientNotes}
          setClientNotes={safeSetClientNotes}
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
