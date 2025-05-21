
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Service } from '@/types/service';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DateSelectionProps {
  customTexts: {
    selectDateLabel?: string;
  };
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedService: Service | null;
}

const DateSelection = ({
  customTexts,
  selectedDate,
  setSelectedDate,
  selectedService
}: DateSelectionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {customTexts.selectDateLabel || "Sélectionnez une date"}
      </h2>
      
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="border rounded-md p-2 flex-1">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => {
              // Désactiver les dates passées
              return date < new Date(new Date().setHours(0, 0, 0, 0));
            }}
            locale={fr}
            className="p-3 pointer-events-auto"
          />
        </div>
        
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Détails du service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Durée:</span>
                  <span>{selectedService?.duration} min</span>
                </div>
                <div className="flex justify-between">
                  <span>Prix:</span>
                  <span className="font-medium">{selectedService?.price} €</span>
                </div>
                {selectedDate && (
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DateSelection;
