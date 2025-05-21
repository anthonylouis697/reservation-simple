
import { Button } from '@/components/ui/button';
import { Check, Trash2 } from 'lucide-react';
import { Booking } from '@/services/bookingService';

interface BookingActionsProps {
  booking: Booking;
  isProcessing: boolean;
  onConfirm: (booking: Booking) => void;
  onCancel: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
}

export const BookingActions = ({ 
  booking, 
  isProcessing, 
  onConfirm, 
  onCancel, 
  onDelete 
}: BookingActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      {booking.status === 'pending' && (
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onConfirm(booking)}
          disabled={isProcessing}
        >
          <Check className="h-4 w-4 mr-1" />
          Confirmer
        </Button>
      )}
      {booking.status !== 'cancelled' && (
        <Button 
          size="sm"
          variant="outline"
          onClick={() => onCancel(booking)}
          disabled={isProcessing}
        >
          Annuler
        </Button>
      )}
      <Button 
        size="sm"
        variant="ghost"
        className="text-destructive hover:text-destructive/80"
        onClick={() => onDelete(booking)}
        disabled={isProcessing}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
