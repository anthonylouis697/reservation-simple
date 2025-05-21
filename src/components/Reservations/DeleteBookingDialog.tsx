
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Booking } from '@/services/booking/types';
import { Service } from '@/types/service';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
  service?: Service;
  isProcessing: boolean;
  onConfirmDelete: () => void;
}

export const DeleteBookingDialog = ({
  open,
  onOpenChange,
  booking,
  service,
  isProcessing,
  onConfirmDelete
}: DeleteBookingDialogProps) => {
  if (!booking) return null;

  // Ensure booking.date is a Date object
  const bookingDate = booking.date instanceof Date 
    ? booking.date 
    : new Date(booking.date);

  // Ensure client object exists and has name property
  const clientName = booking.client && typeof booking.client === 'object' && booking.client.name 
    ? booking.client.name 
    : "Client inconnu";

  const serviceName = service?.name || "Service inconnu";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer la réservation</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer définitivement cette réservation ? Cette action ne peut pas être annulée.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p>
            <strong>Client :</strong> {clientName}
          </p>
          <p>
            <strong>Service :</strong> {serviceName}
          </p>
          <p>
            <strong>Date :</strong> {format(bookingDate, 'dd/MM/yyyy', { locale: fr })}
          </p>
          <p>
            <strong>Heure :</strong> {booking.time || "Heure non spécifiée"}
          </p>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirmDelete}
            disabled={isProcessing}
          >
            {isProcessing ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
