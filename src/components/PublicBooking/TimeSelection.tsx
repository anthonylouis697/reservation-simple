
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Service } from '@/types/service';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TimeSelectionProps {
  customTexts: {
    selectTimeLabel?: string;
  };
  isLoadingTimes: boolean;
  availableTimes: string[];
  selectedTime: string | null;
  setSelectedTime: (time: string) => void;
  selectedService: Service | null;
  selectedDate: Date | undefined;
  getButtonStyle: () => { className: string; style: { backgroundColor: string; borderColor: string } };
}

const TimeSelection = ({
  customTexts,
  isLoadingTimes,
  availableTimes,
  selectedTime,
  setSelectedTime,
  selectedService,
  selectedDate,
  getButtonStyle
}: TimeSelectionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {customTexts.selectTimeLabel || "Sélectionnez un horaire"}
      </h2>
      
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1">
          {isLoadingTimes ? (
            <div className="flex justify-center items-center h-40">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p>Chargement des horaires disponibles...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  onClick={() => setSelectedTime(time)}
                  {...(selectedTime === time ? getButtonStyle() : {})}
                  className="w-full"
                >
                  {time}
                </Button>
              ))}
              
              {!isLoadingTimes && availableTimes.length === 0 && (
                <div className="col-span-4 text-center p-6 border rounded-lg">
                  <p>Aucun horaire disponible pour cette date. Veuillez sélectionner une autre date.</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: fr }) : ''}</span>
                </div>
                {selectedTime && (
                  <div className="flex justify-between">
                    <span>Heure:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between">
                  <span>Prix:</span>
                  <span className="font-medium">{selectedService?.price} €</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TimeSelection;
