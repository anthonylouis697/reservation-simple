
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { BookingCustomTexts } from '@/components/Visibility/BookingPage/types';
import { defaultCustomTexts } from '@/components/Visibility/BookingPage/constants/defaultData';

interface DateSelectionProps {
  customTexts: BookingCustomTexts;
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  businessId: string;
  getButtonStyle: () => { className: string; style: { backgroundColor: string; borderColor: string; borderRadius: string } };
}

const DateSelection = ({
  customTexts = defaultCustomTexts,
  selectedDate,
  onSelectDate,
  businessId,
  getButtonStyle
}: DateSelectionProps) => {
  // Ensure customTexts is never undefined
  const safeCustomTexts = customTexts || defaultCustomTexts;
  
  // Calculer la date minimale (aujourd'hui)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Calculer la date maximale (dans 30 jours)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          {safeCustomTexts.dateSelectionTitle || "Choisissez une date"}
        </h2>
        <p className="text-gray-600 mt-2">
          {safeCustomTexts.dateSelectionDescription || "Sélectionnez la date qui vous convient"}
        </p>
      </div>
      
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          disabled={(date) => {
            // Désactiver les dates passées et les dimanches
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today || date.getDay() === 0;
          }}
          fromDate={today}
          toDate={maxDate}
          className="rounded-md border"
        />
      </div>
      
      {selectedDate && (
        <p className="text-center mt-6 text-green-600 font-medium">
          Date sélectionnée: {selectedDate.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      )}
    </div>
  );
};

export default DateSelection;
