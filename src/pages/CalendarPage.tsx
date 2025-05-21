import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, ChevronDown, X, Check, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AppLayout } from '@/components/AppLayout';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from "@/components/ui/calendar";
import CalendarView, { Appointment } from '@/components/Calendar/CalendarView';
import { Helmet } from 'react-helmet';

// Mock Data
const mockAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Consultation initiale',
    clientName: 'Marie Dupont',
    time: { start: '09:00', end: '10:00' },
    date: new Date(),
    serviceName: 'Consultation initiale',
    status: 'confirmed'
  },
  {
    id: '2',
    title: 'Suivi mensuel',
    clientName: 'Jean Martin',
    time: { start: '11:30', end: '12:30' },
    date: new Date(),
    serviceName: 'Consultation de suivi',
    status: 'pending'
  },
  {
    id: '3',
    title: 'Séance de coaching',
    clientName: 'Sophie Lambert',
    time: { start: '14:00', end: '15:00' },
    date: new Date(),
    serviceName: 'Coaching personnalisé',
    status: 'confirmed'
  },
  {
    id: '4',
    title: 'Consultation bien-être',
    clientName: 'Pierre Legrand',
    time: { start: '09:30', end: '10:30' },
    date: new Date(Date.now() + 86400000), // demain
    serviceName: 'Consultation bien-être',
    status: 'confirmed'
  }
];

const CalendarPage = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [filters, setFilters] = useState({
    status: [] as ('confirmed' | 'pending' | 'cancelled')[],
    search: '',
  });
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false);

  const handleAddAppointment = () => {
    setShowNewAppointmentDialog(true);
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDialog(true);
  };

  const handleCancelAppointment = (id: string) => {
    // Dans une vraie app, cela appellerait l'API
    setAppointments(
      appointments.map(app => 
        app.id === id ? { ...app, status: 'cancelled' as const } : app
      )
    );
    setShowAppointmentDialog(false);
    toast.success('Le rendez-vous a été annulé');
  };

  const handleConfirmAppointment = (id: string) => {
    // Dans une vraie app, cela appellerait l'API
    setAppointments(
      appointments.map(app => 
        app.id === id ? { ...app, status: 'confirmed' as const } : app
      )
    );
    setShowAppointmentDialog(false);
    toast.success('Le rendez-vous a été confirmé');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      search: e.target.value
    });
  };

  const toggleStatusFilter = (status: 'confirmed' | 'pending' | 'cancelled') => {
    setFilters(prev => {
      if (prev.status.includes(status)) {
        return {
          ...prev,
          status: prev.status.filter(s => s !== status)
        };
      } else {
        return {
          ...prev,
          status: [...prev.status, status]
        };
      }
    });
  };

  // Filtrage des rendez-vous
  const filteredAppointments = appointments.filter(app => {
    // Filtrage par statut
    if (filters.status.length > 0 && !filters.status.includes(app.status)) {
      return false;
    }
    
    // Filtrage par recherche
    if (filters.search && !app.clientName.toLowerCase().includes(filters.search.toLowerCase()) && 
        !app.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <AppLayout>
      <Helmet>
        <title>Calendrier - Reservatoo</title>
      </Helmet>

      <div className="flex flex-col h-full space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="relative">
            <Input
              placeholder="Rechercher un client ou un service..."
              value={filters.search}
              onChange={handleSearchChange}
              className="md:w-64"
            />
            {filters.search && (
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setFilters({ ...filters, search: '' })}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" /> 
                  Filtres
                  {filters.status.length > 0 && (
                    <Badge variant="secondary" className="ml-2 rounded-full">
                      {filters.status.length}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="space-y-2">
                  <h4 className="font-medium">Status</h4>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.status.includes('confirmed')}
                        onChange={() => toggleStatusFilter('confirmed')}
                        className="rounded text-primary"
                      />
                      <span className="text-sm">Confirmés</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.status.includes('pending')}
                        onChange={() => toggleStatusFilter('pending')}
                        className="rounded text-primary"
                      />
                      <span className="text-sm">En attente</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.status.includes('cancelled')}
                        onChange={() => toggleStatusFilter('cancelled')}
                        className="rounded text-primary"
                      />
                      <span className="text-sm">Annulés</span>
                    </label>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilters({ status: [], search: '' })}
                    className="text-sm"
                  >
                    Réinitialiser
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => document.body.click()} // Close popover
                    className="text-sm"
                  >
                    Appliquer
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button onClick={handleAddAppointment}>
              + Nouveau rendez-vous
            </Button>
          </div>
        </div>

        <div className="flex-grow">
          <CalendarView 
            appointments={filteredAppointments}
            onAddAppointment={handleAddAppointment}
            onViewAppointment={handleViewAppointment}
            defaultView="week"
            standalone={true}
          />
        </div>

        {/* Dialogues pour visualiser et créer des rendez-vous */}
        <Dialog open={showAppointmentDialog} onOpenChange={setShowAppointmentDialog}>
          {selectedAppointment && (
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{selectedAppointment.title}</DialogTitle>
                <DialogDescription>
                  Détails du rendez-vous
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date et heure</p>
                    <p className="text-sm text-muted-foreground">
                      {format(selectedAppointment.date, "EEEE d MMMM yyyy", { locale: fr })} • {selectedAppointment.time.start} - {selectedAppointment.time.end}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium">Client</p>
                  <div className="p-3 border rounded-md">
                    <p className="font-medium">{selectedAppointment.clientName}</p>
                    <p className="text-sm text-muted-foreground">client@example.com</p>
                    <p className="text-sm text-muted-foreground">+33 6 12 34 56 78</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium">Service</p>
                  <div className="p-3 border rounded-md">
                    <p className="font-medium">{selectedAppointment.serviceName}</p>
                    <p className="text-sm text-muted-foreground">60 minutes • 75€</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium">Statut</p>
                  <div className="p-2 border rounded-md flex items-center justify-between">
                    <div
                      className={`
                        px-3 py-1 rounded-full text-sm
                        ${selectedAppointment.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : ''}
                        ${selectedAppointment.status === 'pending' ? 'bg-amber-100 text-amber-800' : ''}
                        ${selectedAppointment.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                      `}
                    >
                      {selectedAppointment.status === 'confirmed' && 'Confirmé'}
                      {selectedAppointment.status === 'pending' && 'En attente'}
                      {selectedAppointment.status === 'cancelled' && 'Annulé'}
                    </div>
                    
                    {selectedAppointment.status === 'pending' && (
                      <Button 
                        onClick={() => handleConfirmAppointment(selectedAppointment.id)}
                        variant="outline" 
                        size="sm"
                      >
                        <Check className="h-4 w-4 mr-1" /> Confirmer
                      </Button>
                    )}
                    
                    {selectedAppointment.status !== 'cancelled' && (
                      <Button 
                        onClick={() => handleCancelAppointment(selectedAppointment.id)}
                        variant="outline" 
                        size="sm" 
                        className="text-destructive"
                      >
                        <X className="h-4 w-4 mr-1" /> Annuler
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowAppointmentDialog(false)}>
                  Fermer
                </Button>
                <Button>
                  Modifier
                </Button>
              </div>
            </DialogContent>
          )}
        </Dialog>
        
        <Dialog open={showNewAppointmentDialog} onOpenChange={setShowNewAppointmentDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nouveau rendez-vous</DialogTitle>
              <DialogDescription>
                Créez un nouveau rendez-vous pour un client
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Input id="client" placeholder="Nom du client" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="service">Service</Label>
                <Input id="service" placeholder="Service réservé" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "dd MMMM yyyy", { locale: fr }) : <span>Choisir une date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Heure</Label>
                  <Input id="time" placeholder="09:00" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" placeholder="Notes additionnelles" />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowNewAppointmentDialog(false)}>
                Annuler
              </Button>
              <Button onClick={() => {
                toast.success("Rendez-vous créé avec succès");
                setShowNewAppointmentDialog(false);
              }}>
                Créer le rendez-vous
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default CalendarPage;
