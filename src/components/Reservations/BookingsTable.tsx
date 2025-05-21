
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Booking } from '@/services/booking/types';
import { Service } from '@/types/service';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { StatusBadge } from './StatusBadge';
import { BookingActions } from './BookingActions';

interface BookingsTableProps {
  bookings: Booking[];
  getServiceById: (id: string) => Service | undefined;
  isProcessing: boolean;
  onConfirm: (booking: Booking) => void;
  onCancel: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
}

export const BookingsTable = ({
  bookings,
  getServiceById,
  isProcessing,
  onConfirm,
  onCancel,
  onDelete
}: BookingsTableProps) => {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">Aucune réservation trouvée.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Heure</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => {
            // Ensure booking is valid and has required fields
            if (!booking || !booking.id || !booking.serviceId) {
              return null;
            }

            const service = getServiceById(booking.serviceId);
            
            // Ensure booking.date is properly converted to a Date object
            const bookingDate = booking.date instanceof Date 
              ? booking.date 
              : new Date(booking.date);
            
            // Ensure client object is properly handled
            const clientName = booking.client && typeof booking.client === 'object' && booking.client.name 
              ? booking.client.name 
              : "Client inconnu";
            
            const clientEmail = booking.client && typeof booking.client === 'object' && booking.client.email 
              ? booking.client.email 
              : "";
            
            return (
              <TableRow key={booking.id}>
                <TableCell>
                  {format(bookingDate, 'dd/MM/yyyy', { locale: fr })}
                </TableCell>
                <TableCell>{booking.time || "-"}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{clientName}</p>
                    <p className="text-sm text-muted-foreground">{clientEmail}</p>
                  </div>
                </TableCell>
                <TableCell>{service?.name || "Service inconnu"}</TableCell>
                <TableCell>{service?.price || 0} €</TableCell>
                <TableCell>
                  <StatusBadge status={booking.status} />
                </TableCell>
                <TableCell className="text-right">
                  <BookingActions 
                    booking={booking}
                    isProcessing={isProcessing}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
