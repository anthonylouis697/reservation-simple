
import { useState } from 'react';
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Helmet } from "react-helmet";
import { ArrowLeft, CalendarDays, Plus, Users, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Types pour les événements
interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  capacity: number;
  duration: number;
  price: number;
  status: 'active' | 'draft' | 'archived';
}

// Données d'exemple
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Atelier bien-être',
    description: 'Un atelier pour découvrir les techniques de relaxation',
    date: new Date(2025, 5, 15, 14, 0),
    capacity: 10,
    duration: 120,
    price: 45,
    status: 'active'
  },
  {
    id: '2',
    title: 'Cours collectif',
    description: 'Cours collectif de remise en forme',
    date: new Date(2025, 5, 22, 10, 0),
    capacity: 15,
    duration: 60,
    price: 25,
    status: 'active'
  },
  {
    id: '3',
    title: 'Conférence santé',
    description: 'Conférence sur les bienfaits d\'une alimentation équilibrée',
    date: new Date(2025, 5, 30, 18, 0),
    capacity: 30,
    duration: 90,
    price: 15,
    status: 'draft'
  }
];

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Filtrage des événements en fonction de l'onglet actif
  const filteredEvents = events.filter(event => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return event.status === 'active';
    if (activeTab === 'draft') return event.status === 'draft';
    if (activeTab === 'archived') return event.status === 'archived';
    return true;
  });

  // Fonction pour ajouter un événement
  const handleAddEvent = () => {
    // Dans une vraie app, cela enregistrerait les données dans la base de données
    toast.success("Événement créé avec succès");
    setShowAddEventDialog(false);
  };
  
  return (
    <AppLayout>
      <Helmet>
        <title>Événements - Reservatoo</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/calendar')}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Événements</h1>
              <p className="text-muted-foreground">Gérez vos événements et ateliers collectifs</p>
            </div>
          </div>
          
          <Button onClick={() => setShowAddEventDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel événement
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="active">Actifs</TabsTrigger>
            <TabsTrigger value="draft">Brouillons</TabsTrigger>
            <TabsTrigger value="archived">Archivés</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <CalendarDays className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">Aucun événement</h3>
                <p className="text-muted-foreground mt-2 mb-4">
                  Vous n'avez pas encore créé d'événement dans cette catégorie.
                </p>
                <Button onClick={() => setShowAddEventDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer un événement
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(event.date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{event.duration} minutes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{event.capacity} places</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between">
                      <div className="text-lg font-bold">
                        {event.price}€
                      </div>
                      <div>
                        {event.status === 'active' && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Actif
                          </span>
                        )}
                        {event.status === 'draft' && (
                          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                            Brouillon
                          </span>
                        )}
                        {event.status === 'archived' && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                            Archivé
                          </span>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Dialog for adding new events */}
        <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Créer un nouvel événement</DialogTitle>
              <DialogDescription>
                Ajoutez les détails de votre événement ou atelier collectif.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titre</Label>
                <Input id="title" placeholder="Titre de l'événement" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Description de l'événement" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Calendar mode="single" />
                </div>
                
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="time">Heure</Label>
                    <Input id="time" placeholder="14:00" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Durée (minutes)</Label>
                    <Input id="duration" type="number" defaultValue="60" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="capacity">Capacité</Label>
                  <Input id="capacity" type="number" defaultValue="10" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="price">Prix (€)</Label>
                  <Input id="price" type="number" defaultValue="0" />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Statut</Label>
                <Select defaultValue="active">
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddEventDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddEvent}>Créer l'événement</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
