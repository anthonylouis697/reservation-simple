
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingResult } from '@/services/booking/types';
import { BookingCustomTexts } from '@/components/Visibility/BookingPage/types';

interface BookingConfirmationProps {
  booking?: BookingResult;
  customTexts: BookingCustomTexts;
  primaryColor: string;
  confirmationMessage?: string;
  handleStartOver?: () => void;
  getButtonStyle: () => { className: string; style: { backgroundColor: string; borderColor: string } };
}

const BookingConfirmation = ({
  booking,
  customTexts,
  primaryColor,
  confirmationMessage = "Votre réservation a été enregistrée avec succès.",
  handleStartOver = () => window.location.reload(),
  getButtonStyle
}: BookingConfirmationProps) => {
  // Use confirmation message from customTexts if available
  const message = customTexts?.confirmationMessage || confirmationMessage;
  
  return (
    <div className="text-center py-8">
      <div className="mx-auto bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold mb-4">
        {customTexts?.confirmationTitle || "Réservation confirmée!"}
      </h2>
      <p className="text-gray-600 mb-6">{message}</p>
      <Button onClick={handleStartOver} {...getButtonStyle()}>
        Nouvelle réservation
      </Button>
    </div>
  );
};

export default BookingConfirmation;
