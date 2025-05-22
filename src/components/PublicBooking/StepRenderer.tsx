
import { BookingStep } from '@/components/Visibility/BookingPage/types';
import { Service } from '@/types/service';
import { BookingCustomTexts } from '@/components/Visibility/BookingPage/types';
import { defaultCustomTexts } from '@/components/Visibility/BookingPage/constants/defaultData';
import ServiceSelection from './ServiceSelection';
import DateSelection from './DateSelection';
import TimeSelection from './TimeSelection';
import ClientInfoForm from './ClientInfoForm';
import BookingConfirmation from './BookingConfirmation';

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
  switch (currentStep.type) {
    case 'service':
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
      return (
        <DateSelection
          customTexts={safeCustomTexts}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedService={selectedService}
        />
      );

    case 'time':
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
      
    default:
      return (
        <div className="text-center py-6">
          <p>Type de composant non reconnu: {currentStep.type}</p>
        </div>
      );
  }
};

export default StepRenderer;
