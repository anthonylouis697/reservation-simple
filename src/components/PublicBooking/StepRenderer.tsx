
import { BookingStep } from '@/components/Visibility/BookingPage/types';
import { Service } from '@/types/service';
import { BookingCustomTexts } from '@/components/Visibility/BookingPage/types';
import { defaultCustomTexts } from '@/components/Visibility/BookingPage/constants/defaultData';
import ServiceSelection from './ServiceSelection';
import DateSelection from './DateSelection';
import TimeSelection from './TimeSelection';
import ClientInfoForm from './ClientInfoForm';
import BookingConfirmation from './BookingConfirmation';
import { Steps } from '@/components/Visibility/BookingPage/types';

interface StepRendererProps {
  currentStep: BookingStep;
  services: Service[];
  selectedService: Service | null;
  setSelectedService: (service: Service | null) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: string | null;
  setSelectedTime: (time: string | null) => void;
  clientInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    notes: string;
  };
  setClientInfo: (clientInfo: any) => void;
  availableTimes: string[];
  isLoadingTimes: boolean;
  customTexts: BookingCustomTexts;
  getButtonStyle: () => { className: string; style: { backgroundColor: string; borderColor: string } };
  primaryColor: string;
  businessId: string;
}

const StepRenderer = ({
  currentStep,
  services = [],
  selectedService = null,
  setSelectedService = () => {},
  selectedDate = undefined,
  setSelectedDate = () => {},
  isLoadingTimes = false,
  availableTimes = [],
  selectedTime = null,
  setSelectedTime = () => {},
  clientInfo = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: ""
  },
  setClientInfo = () => {},
  customTexts = defaultCustomTexts,
  getButtonStyle = () => ({ className: "", style: { backgroundColor: "", borderColor: "" } }),
  primaryColor = "#9b87f5",
  businessId = ""
}: StepRendererProps) => {
  
  // Ensure customTexts is never undefined or null by providing a default
  const safeCustomTexts = customTexts || defaultCustomTexts;
  const safeAvailableTimes = Array.isArray(availableTimes) ? availableTimes : [];
  
  // Determine which component to render based on step type
  switch (currentStep.type.toLowerCase()) {
    case 'service':
    case Steps.SERVICE.toLowerCase():
      return (
        <ServiceSelection
          customTexts={safeCustomTexts}
          services={services}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          getButtonStyle={getButtonStyle}
          primaryColor={primaryColor}
        />
      );

    case 'date':
    case Steps.DATE.toLowerCase():
      return (
        <DateSelection
          customTexts={safeCustomTexts}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          businessId={businessId}
          getButtonStyle={getButtonStyle}
        />
      );

    case 'time':
    case Steps.TIME.toLowerCase():
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

    case 'client_info':
    case Steps.CLIENT_INFO.toLowerCase():
      return (
        <ClientInfoForm
          customTexts={safeCustomTexts}
          clientInfo={clientInfo}
          setClientInfo={setClientInfo}
          selectedService={selectedService}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
        />
      );
      
    case 'confirmation':
    case Steps.CONFIRMATION.toLowerCase():
      return (
        <BookingConfirmation
          customTexts={safeCustomTexts}
          primaryColor={primaryColor}
          getButtonStyle={getButtonStyle}
          confirmationMessage="Réservation confirmée."
          handleStartOver={() => {}}
        />
      );
      
    default:
      return (
        <div className="text-center py-6">
          <p>Type de composant non reconnu: {currentStep.type}</p>
          <pre className="text-xs text-gray-500 mt-2">{JSON.stringify(currentStep, null, 2)}</pre>
        </div>
      );
  }
};

export default StepRenderer;
