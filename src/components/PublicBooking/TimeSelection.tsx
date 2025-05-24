
import React from 'react';
import { BookingCustomTexts } from '@/components/Visibility/BookingPage/types';
import { defaultCustomTexts } from '@/components/Visibility/BookingPage/constants/defaultData';
import { Service } from '@/types/service';
import { Loader2 } from 'lucide-react';

interface TimeSelectionProps {
  customTexts: BookingCustomTexts;
  isLoadingTimes: boolean;
  availableTimes: string[];
  selectedTime: string | null;
  setSelectedTime: (time: string | null) => void;
  selectedService: Service | null;
  selectedDate: Date | undefined;
  getButtonStyle: () => { className: string; style: { backgroundColor: string; borderColor: string; borderRadius: string } };
}

const TimeSelection = ({
  customTexts = defaultCustomTexts,
  isLoadingTimes,
  availableTimes,
  selectedTime,
  setSelectedTime,
  selectedService,
  selectedDate,
  getButtonStyle
}: TimeSelectionProps) => {
  // Ensure customTexts is never undefined
  const safeCustomTexts = customTexts || defaultCustomTexts;
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          {safeCustomTexts.timeSelectionTitle || "Choisissez un horaire"}
        </h2>
        <p className="text-gray-600 mt-2">
          {safeCustomTexts.timeSelectionDescription || "Sélectionnez l'heure qui vous convient"}
        </p>
      </div>
      
      {selectedService && selectedDate && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">{selectedService.name}</span> - {selectedService.duration} min
          </p>
          <p className="text-sm text-gray-600">
            {selectedDate.toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      )}
      
      {isLoadingTimes ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Chargement des créneaux disponibles...</span>
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {availableTimes.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`
                p-3 rounded-md border text-center transition-all
                ${selectedTime === time 
                  ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }
              `}
            >
              {time}
            </button>
          ))}
        </div>
      )}
      
      {availableTimes.length === 0 && !isLoadingTimes && (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun créneau disponible pour cette date</p>
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
