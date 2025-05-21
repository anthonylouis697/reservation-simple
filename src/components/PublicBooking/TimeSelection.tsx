
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Service } from '@/types/service';
import { BookingCustomTexts } from '@/components/Visibility/BookingPage/types';
import { defaultCustomTexts } from '@/components/Visibility/BookingPage/constants/defaultData';

interface TimeSelectionProps {
  customTexts: BookingCustomTexts;
  isLoadingTimes: boolean;
  availableTimes: string[];
  selectedTime: string | null;
  setSelectedTime: (time: string) => void;
  selectedService: Service | null;
  selectedDate: Date | undefined;
  getButtonStyle: () => { className: string; style: { backgroundColor: string; borderColor: string } };
}

const TimeSelection = ({
  customTexts = defaultCustomTexts,
  isLoadingTimes,
  availableTimes = [],
  selectedTime,
  setSelectedTime,
  selectedService,
  selectedDate,
  getButtonStyle
}: TimeSelectionProps) => {
  // Ensure customTexts has safe defaults
  const safeCustomTexts = customTexts || defaultCustomTexts;
  const selectTimeLabel = safeCustomTexts.selectTimeLabel || "Sélectionnez un horaire";
  
  const mockTimes = [
    "09:00", "09:30", "10:00", "10:30", 
    "11:00", "11:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", 
    "17:00", "17:30"
  ];
  
  // Use the provided availableTimes or fallback to mock times
  const displayTimes = availableTimes && availableTimes.length > 0 
    ? availableTimes 
    : mockTimes;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">
          {selectTimeLabel}
        </h2>
        
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
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {displayTimes.map((time) => (
            <button
              key={time}
              className={`py-2 px-1 border rounded-md text-center transition-colors ${
                selectedTime === time
                  ? "border-primary text-white"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              style={
                selectedTime === time
                  ? getButtonStyle().style
                  : {}
              }
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </button>
          ))}
        </div>
      )}
      
      {!isLoadingTimes && displayTimes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun horaire disponible pour cette date</p>
          <p className="text-sm text-gray-500 mt-2">Veuillez sélectionner une autre date</p>
        </div>
      )}
    </div>
  );
};

export default TimeSelection;
