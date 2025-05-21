
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarCheck } from 'lucide-react';
import { toast } from 'sonner';
import { getAllBookings, updateBookingStatus, deleteBooking } from '@/services/booking';
import { Booking } from '@/services/booking/types';
import { Service } from '@/types/service';
import { initialServices } from '@/mock/serviceData';
import { LoadingState } from '@/components/Reservations/LoadingState';
import { BookingsTable } from '@/components/Reservations/BookingsTable';
import { DeleteBookingDialog } from '@/components/Reservations/DeleteBookingDialog';

const Reservations = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load reservations on page load
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const fetchedBookings = await getAllBookings();
        
        // Ensure all bookings have proper structure
        const validBookings = fetchedBookings.filter(booking => 
          booking && booking.id && booking.client && typeof booking.client === 'object'
        );
        
        setBookings(validBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Erreur lors du chargement des réservations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings according to active tab
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return booking.status === 'pending';
    if (activeTab === 'confirmed') return booking.status === 'confirmed';
    if (activeTab === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  // Find a service by its ID
  const getServiceById = (id: string): Service | undefined => {
    return services.find(service => service.id === id);
  };

  // Handle booking confirmation
  const handleConfirmBooking = async (booking: Booking) => {
    setIsProcessing(true);
    try {
      await updateBookingStatus(booking.id, 'confirmed');
      
      // Update local state
      setBookings(prev => 
        prev.map(b => 
          b.id === booking.id ? { ...b, status: 'confirmed' } : b
        )
      );
      
      toast.success('Réservation confirmée avec succès');
    } catch (error) {
      console.error('Error confirming booking:', error);
      toast.error('Erreur lors de la confirmation de la réservation');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async (booking: Booking) => {
    setIsProcessing(true);
    try {
      await updateBookingStatus(booking.id, 'cancelled');
      
      // Update local state
      setBookings(prev => 
        prev.map(b => 
          b.id === booking.id ? { ...b, status: 'cancelled' } : b
        )
      );
      
      toast.success('Réservation annulée');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Erreur lors de l\'annulation de la réservation');
    } finally {
      setIsProcessing(false);
    }
  };

  // Open the delete dialog
  const openDeleteDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDeleteDialog(true);
  };

  // Handle booking deletion
  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;
    
    setIsProcessing(true);
    try {
      const success = await deleteBooking(selectedBooking.id);
      
      if (success) {
        // Update local state
        setBookings(prev => prev.filter(b => b.id !== selectedBooking.id));
        toast.success('Réservation supprimée');
      }
      
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Erreur lors de la suppression de la réservation');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Réservations - Reservatoo</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Réservations</h1>
            <p className="text-muted-foreground mt-1">
              Gérez les réservations de vos clients
            </p>
          </div>
          <div>
            <Button onClick={() => window.location.reload()}>
              Actualiser
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              Liste des réservations
            </CardTitle>
            <CardDescription>
              Consultez et gérez toutes les réservations de vos clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="all">Toutes</TabsTrigger>
                <TabsTrigger value="pending">En attente</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmées</TabsTrigger>
                <TabsTrigger value="cancelled">Annulées</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                {isLoading ? (
                  <LoadingState />
                ) : (
                  <BookingsTable 
                    bookings={filteredBookings}
                    getServiceById={getServiceById}
                    isProcessing={isProcessing}
                    onConfirm={handleConfirmBooking}
                    onCancel={handleCancelBooking}
                    onDelete={openDeleteDialog}
                  />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <DeleteBookingDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        booking={selectedBooking}
        service={selectedBooking ? getServiceById(selectedBooking.serviceId) : undefined}
        isProcessing={isProcessing}
        onConfirmDelete={handleDeleteBooking}
      />
    </AppLayout>
  );
};

export default Reservations;
