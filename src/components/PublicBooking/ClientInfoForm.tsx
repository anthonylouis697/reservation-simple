
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Service } from '@/types/service';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ClientInfoFormProps {
  customTexts: {
    clientInfoLabel?: string;
  };
  clientName: string;
  setClientName: (name: string) => void;
  clientEmail: string;
  setClientEmail: (email: string) => void;
  clientPhone: string;
  setClientPhone: (phone: string) => void;
  clientNotes: string;
  setClientNotes: (notes: string) => void;
  selectedService: Service | null;
  selectedDate: Date | undefined;
  selectedTime: string | null;
}

const ClientInfoForm = ({
  customTexts,
  clientName,
  setClientName,
  clientEmail,
  setClientEmail,
  clientPhone,
  setClientPhone,
  clientNotes,
  setClientNotes,
  selectedService,
  selectedDate,
  selectedTime
}: ClientInfoFormProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {customTexts.clientInfoLabel || "Vos informations"}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="clientName">Nom complet*</Label>
          <Input
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Votre nom et prénom"
            required
          />
        </div>
        <div>
          <Label htmlFor="clientEmail">Email*</Label>
          <Input
            id="clientEmail"
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            placeholder="votre@email.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="clientPhone">Téléphone</Label>
          <Input
            id="clientPhone"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            placeholder="Votre numéro de téléphone"
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <Label htmlFor="clientNotes">Notes ou demandes particulières</Label>
          <Textarea
            id="clientNotes"
            value={clientNotes}
            onChange={(e) => setClientNotes(e.target.value)}
            placeholder="Informations supplémentaires..."
            rows={3}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Récapitulatif de la réservation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Service:</span>
              <span className="font-medium">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{selectedDate ? format(selectedDate, "EEEE d MMMM yyyy", { locale: fr }) : ''}</span>
            </div>
            <div className="flex justify-between">
              <span>Heure:</span>
              <span>{selectedTime}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span>Prix total:</span>
              <span className="font-medium text-lg">{selectedService?.price} €</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientInfoForm;
