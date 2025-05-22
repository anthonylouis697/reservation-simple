
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Service } from '@/types/service';
import { BookingCustomTexts } from '@/components/Visibility/BookingPage/types';
import { defaultCustomTexts } from '@/components/Visibility/BookingPage/constants/defaultData';
import { Clock, Loader } from 'lucide-react';

interface TimeSelectionProps {
  customTexts: BookingCustomTexts;
  selectedService: Service | null;
  selectedDate: Date | undefined;
  availableTimes: string[];
  isLoadingTimes: boolean;
  selectedTime: string | null;
  setSelectedTime: (time: string | null) => void;
  getButtonStyle: () => { className: string; style: { backgroundColor: string; borderColor: string } };
}

const TimeSelection = ({
  customTexts = defaultCustomTexts,
  selectedService,
  selectedDate,
  availableTimes,
  isLoadingTimes,
  selectedTime,
  setSelectedTime,
  getButtonStyle
}: TimeSelectionProps) => {
  // Ensure customTexts is never undefined
  const safeCustomTexts = customTexts || defaultCustomTexts;
  
  // Use the correct property names or fallbacks
  const timeSelectionTitle = safeCustomTexts.timeSelectionTitle || "Sélection de l'horaire";
  const timeSelectionDescription = safeCustomTexts.timeSelectionDescription || "Choisissez un horaire disponible";
  const noTimesMessage = safeCustomTexts.noAvailableTimesMessage || "Aucun horaire disponible pour cette date";

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">
          {timeSelectionTitle}
        </h2>
        <p className="text-gray-600 mt-2">
          {timeSelectionDescription}
        </p>
        
        {selectedService && selectedDate && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md inline-block">
            <p className="font-medium">{selectedService.name}</p>
            <p className="text-sm text-gray-500">
              {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
            </p>
            <p className="text-sm text-gray-500">
              {selectedService.duration} min - {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(selectedService.price)}
            </p>
          </div>
        )}
      </div>
      
      {isLoadingTimes ? (
        <div className="flex justify-center py-8">
          <div className="flex flex-col items-center">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-gray-600">Chargement des horaires disponibles...</p>
          </div>
        </div>
      ) : availableTimes.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {availableTimes.map((time, index) => (
            <button
              key={index}
              onClick={() => setSelectedTime(time)}
              className={`
                flex items-center justify-center gap-2 px-4 py-3 border rounded-md
                ${selectedTime === time 
                  ? `${getButtonStyle().className} text-white` 
                  : 'border-gray-300 hover:border-gray-400 bg-white'
                }
              `}
              style={selectedTime === time ? getButtonStyle().style : {}}
            >
              <Clock className={`h-4 w-4 ${selectedTime === time ? 'text-white' : 'text-gray-500'}`} />
              <span>{time}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          <p className="mt-4 text-gray-600">{noTimesMessage}</p>
        </div>
      )}
      
      {selectedTime && (
        <p className="text-center mt-6 text-green-600 font-medium">
          Horaire sélectionné: {selectedTime}
        </p>
      )}
    </div>
  );
};

export default TimeSelection;
