
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
  service?: Service | null;
  isProcessing: boolean;
  onConfirmDelete: () => void;
}

export const DeleteBookingDialog = ({
  open = false,
  onOpenChange,
  booking = null,
  service = null,
  isProcessing = false,
  onConfirmDelete
}: DeleteBookingDialogProps) => {
  // Safety check for required props and booking
  if (!booking) return null;
  
  const safeOnOpenChange = onOpenChange || (() => {});
  const safeOnConfirmDelete = onConfirmDelete || (() => {});

  // Safely transform date to Date object if needed
  let bookingDate: Date;
  try {
    bookingDate = booking.date instanceof Date 
      ? booking.date 
      : new Date(booking.date || Date.now());
  } catch (error) {
    console.error("Erreur lors de la conversion de la date:", error);
    bookingDate = new Date();
  }

  // Safely get client data
  const clientName = 
    booking.client && 
    typeof booking.client === 'object' && 
    booking.client.name 
      ? booking.client.name 
      : "Client inconnu";

  const serviceName = service && service.name ? service.name : "Service inconnu";
  const bookingTime = booking.time || "Heure non spécifiée";

  return (
    <Dialog open={open} onOpenChange={safeOnOpenChange}>
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
            <strong>Heure :</strong> {bookingTime}
          </p>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => safeOnOpenChange(false)}
            disabled={isProcessing}
          >
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={safeOnConfirmDelete}
            disabled={isProcessing}
          >
            {isProcessing ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
