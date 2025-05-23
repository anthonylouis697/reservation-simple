
import React from 'react';
import { BookingResult } from '@/services/booking/types';
import { BookingCustomTexts } from '@/components/Visibility/BookingPage/types';
import { defaultCustomTexts } from '@/components/Visibility/BookingPage/constants/defaultData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCircle, Calendar, Clock, User, Mail, Phone, ArrowLeft } from 'lucide-react';

export interface BookingConfirmationProps {
  booking?: BookingResult | null;
  customTexts: BookingCustomTexts;
  primaryColor?: string;
  getButtonStyle?: () => { className: string; style: { backgroundColor: string; borderColor: string } };
  confirmationMessage?: string;
  handleStartOver?: () => void;
}

const BookingConfirmation = ({
  booking,
  customTexts = defaultCustomTexts,
  primaryColor = "#4f46e5",
  getButtonStyle = () => ({ 
    className: "bg-primary hover:bg-primary/90 rounded", 
    style: { backgroundColor: "#4f46e5", borderColor: "#4f46e5" }
  }),
  confirmationMessage,
  handleStartOver = () => {}
}: BookingConfirmationProps) => {
  // Ensure customTexts is never undefined
  const safeCustomTexts = customTexts || defaultCustomTexts;
  
  // Default buttonStyle if getButtonStyle is not provided
  const buttonStyle = getButtonStyle();
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">
          {safeCustomTexts.confirmationTitle || "Réservation confirmée"}
        </h2>
        <p className="text-gray-600 mt-2">
          {confirmationMessage || safeCustomTexts.confirmationMessage || "Votre réservation a bien été enregistrée. Merci!"}
        </p>
      </div>
      
      {booking && (
        <div className="bg-gray-50 rounded-lg p-6 border max-w-lg mx-auto">
          <h3 className="font-medium text-lg mb-4">Détails de votre réservation</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="text-gray-700 font-medium">Service</p>
                <p className="text-gray-600">{booking.serviceName}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="text-gray-700 font-medium">Date</p>
                <p className="text-gray-600">
                  {format(new Date(booking.startTime), 'EEEE d MMMM yyyy', { locale: fr })}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="text-gray-700 font-medium">Horaire</p>
                <p className="text-gray-600">
                  {format(new Date(booking.startTime), 'HH:mm', { locale: fr })}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <User className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="text-gray-700 font-medium">Nom</p>
                <p className="text-gray-600">{booking.clientName}</p>
              </div>
            </div>
            
            {booking.clientEmail && (
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-gray-700 font-medium">Email</p>
                  <p className="text-gray-600">{booking.clientEmail}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {handleStartOver && (
        <div className="text-center mt-8">
          <button
            onClick={handleStartOver}
            className="inline-flex items-center justify-center px-6 py-2 border rounded-md hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingConfirmation;
