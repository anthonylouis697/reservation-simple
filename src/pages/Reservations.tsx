
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { CalendarCheck, Check, Trash2 } from 'lucide-react';
import { Booking, getAllBookings, updateBookingStatus, deleteBooking } from '@/services/bookingService';
import { Service } from '@/types/service';
import { initialServices } from '@/mock/serviceData';

const Reservations = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Charger les réservations au chargement de la page
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const fetchedBookings = await getAllBookings();
        setBookings(fetchedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Erreur lors du chargement des réservations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filtrage des réservations selon l'onglet actif
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return booking.status === 'pending';
    if (activeTab === 'confirmed') return booking.status === 'confirmed';
    if (activeTab === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  // Trouver un service par son ID
  const getServiceById = (id: string): Service | undefined => {
    return services.find(service => service.id === id);
  };

  // Gérer la confirmation d'une réservation
  const handleConfirmBooking = async (booking: Booking) => {
    setIsProcessing(true);
    try {
      await updateBookingStatus(booking.id, 'confirmed');
      
      // Mettre à jour l'état local
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

  // Gérer l'annulation d'une réservation
  const handleCancelBooking = async (booking: Booking) => {
    setIsProcessing(true);
    try {
      await updateBookingStatus(booking.id, 'cancelled');
      
      // Mettre à jour l'état local
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

  // Ouvrir la boîte de dialogue de suppression
  const openDeleteDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDeleteDialog(true);
  };

  // Gérer la suppression d'une réservation
  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;
    
    setIsProcessing(true);
    try {
      const success = await deleteBooking(selectedBooking.id);
      
      if (success) {
        // Mettre à jour l'état local
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

  // Fonction pour obtenir le style de badge selon le statut
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Formatter le statut pour l'affichage
  const formatStatus = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'cancelled': return 'Annulée';
      default: return status;
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
                  <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p>Chargement des réservations...</p>
                    </div>
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div className="text-center py-12 border rounded-lg">
                    <p className="text-muted-foreground">Aucune réservation trouvée.</p>
                  </div>
                ) : (
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
                        {filteredBookings.map((booking) => {
                          const service = getServiceById(booking.serviceId);
                          const bookingDate = booking.date instanceof Date 
                            ? booking.date 
                            : new Date(booking.date);
                          
                          return (
                            <TableRow key={booking.id}>
                              <TableCell>
                                {format(bookingDate, 'dd/MM/yyyy', { locale: fr })}
                              </TableCell>
                              <TableCell>{booking.time}</TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{booking.client.name}</p>
                                  <p className="text-sm text-muted-foreground">{booking.client.email}</p>
                                </div>
                              </TableCell>
                              <TableCell>{service?.name || "Service inconnu"}</TableCell>
                              <TableCell>{service?.price || 0} €</TableCell>
                              <TableCell>
                                <Badge 
                                  variant="outline"
                                  className={getStatusBadgeStyle(booking.status)}
                                >
                                  {formatStatus(booking.status)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  {booking.status === 'pending' && (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleConfirmBooking(booking)}
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
                                      onClick={() => handleCancelBooking(booking)}
                                      disabled={isProcessing}
                                    >
                                      Annuler
                                    </Button>
                                  )}
                                  <Button 
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive/80"
                                    onClick={() => openDeleteDialog(booking)}
                                    disabled={isProcessing}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la réservation</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer définitivement cette réservation ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="py-4">
              <p>
                <strong>Client :</strong> {selectedBooking.client.name}
              </p>
              <p>
                <strong>Service :</strong> {getServiceById(selectedBooking.serviceId)?.name || "Service inconnu"}
              </p>
              <p>
                <strong>Date :</strong> {format(
                  selectedBooking.date instanceof Date 
                    ? selectedBooking.date 
                    : new Date(selectedBooking.date), 
                  'dd/MM/yyyy', 
                  { locale: fr }
                )}
              </p>
              <p>
                <strong>Heure :</strong> {selectedBooking.time}
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              disabled={isProcessing}
            >
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteBooking}
              disabled={isProcessing}
            >
              {isProcessing ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Reservations;
