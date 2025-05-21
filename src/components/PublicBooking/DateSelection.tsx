
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Service } from '@/types/service';
import { BookingCustomTexts } from '@/components/Visibility/BookingPage/types';
import { defaultCustomTexts } from '@/components/Visibility/BookingPage/constants/defaultData';

interface DateSelectionProps {
  customTexts: BookingCustomTexts;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedService: Service | null;
}

const DateSelection = ({
  customTexts = defaultCustomTexts,
  selectedDate,
  setSelectedDate,
  selectedService
}: DateSelectionProps) => {
  // Ensure customTexts is never undefined - use safe defaults
  const safeCustomTexts = customTexts || defaultCustomTexts;
  const dateSelectionTitle = safeCustomTexts.dateSelectionTitle || "Sélection de la date";
  const dateSelectionDescription = safeCustomTexts.dateSelectionDescription || "Choisissez une date disponible";
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const twoMonthsFromNow = new Date();
  twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">
          {dateSelectionTitle}
        </h2>
        <p className="text-gray-600 mt-2">
          {dateSelectionDescription}
        </p>
        {selectedService && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md inline-block">
            <p className="font-medium">{selectedService.name}</p>
            <p className="text-sm text-gray-500">
              {selectedService.duration} min - {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(selectedService.price)}
            </p>
          </div>
        )}
      </div>
      
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          locale={fr}
          className="rounded-md border"
          fromDate={tomorrow}
          toDate={twoMonthsFromNow}
        />
      </div>
      
      {selectedDate && (
        <div className="mt-6 text-center">
          <p className="text-green-600 font-medium">
            Date sélectionnée: {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
          </p>
        </div>
      )}
    </div>
  );
};

export default DateSelection;
