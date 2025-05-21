
import { Service } from '@/types/service';
import { BookingCustomTexts } from '@/components/Visibility/BookingPage/types';
import { defaultCustomTexts } from '@/components/Visibility/BookingPage/constants/defaultData';
import ServiceSelection from './ServiceSelection';
import DateSelection from './DateSelection';
import TimeSelection from './TimeSelection';
import ClientInfoForm from './ClientInfoForm';
import BookingConfirmation from './BookingConfirmation';

interface StepRendererProps {
  currentStep: number;
  bookingComplete: boolean;
  customTexts: BookingCustomTexts;
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
  customTexts = defaultCustomTexts,
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
  
  // Ensure customTexts is never undefined or null by providing a default
  const safeCustomTexts = customTexts || defaultCustomTexts;
  const safeActiveCategories = Array.isArray(activeCategories) ? activeCategories : [];
  const safeFilteredServices = Array.isArray(filteredServices) ? filteredServices : [];
  const safeAvailableTimes = Array.isArray(availableTimes) ? availableTimes : [];
  
  // Show confirmation component if booking is complete
  if (bookingComplete) {
    return (
      <BookingConfirmation 
        confirmationMessage={confirmationMessage}
        handleStartOver={handleStartOver}
        getButtonStyle={getButtonStyle}
      />
    );
  }

  // Render appropriate component based on current step
  switch (currentStep) {
    case 0: // Service selection
      return (
        <ServiceSelection
          customTexts={safeCustomTexts}
          activeCategories={safeActiveCategories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          filteredServices={safeFilteredServices}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          getButtonStyle={getButtonStyle}
          primaryColor={primaryColor}
        />
      );

    case 1: // Date selection
      return (
        <DateSelection
          customTexts={safeCustomTexts}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedService={selectedService}
        />
      );

    case 2: // Time selection
      return (
        <TimeSelection
          customTexts={safeCustomTexts}
          isLoadingTimes={isLoadingTimes}
          availableTimes={safeAvailableTimes}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          selectedService={selectedService}
          selectedDate={selectedDate}
          getButtonStyle={getButtonStyle}
        />
      );

    case 3: // Client information
      return (
        <ClientInfoForm
          customTexts={safeCustomTexts}
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
      // Fallback to service selection if step is invalid
      return (
        <ServiceSelection
          customTexts={safeCustomTexts}
          activeCategories={safeActiveCategories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          filteredServices={safeFilteredServices}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          getButtonStyle={getButtonStyle}
          primaryColor={primaryColor}
        />
      );
  }
};

export default StepRenderer;
