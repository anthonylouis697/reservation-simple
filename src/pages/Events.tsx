
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Filter, Plus, Tag, Users, Clock, DollarSign, Trash2, Edit, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AppLayout } from '@/components/AppLayout';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sample event data
const sampleEvents = [
  {
    id: '1',
    title: 'Atelier découverte',
    description: 'Présentation des techniques de base pour débutants.',
    date: '2025-05-25',
    startTime: '14:00',
    endTime: '16:00',
    capacity: {
      min: 5,
      max: 15,
      current: 8
    },
    price: 25,
    location: 'Salle principale',
    category: 'workshop',
    recurring: false
  },
  {
    id: '2',
    title: 'Cours collectif hebdomadaire',
    description: 'Session pour niveau intermédiaire et avancé.',
    date: '2025-05-22',
    startTime: '18:30',
    endTime: '20:00',
    capacity: {
      min: 3,
      max: 12,
      current: 10
    },
    price: 15,
    location: 'Salle 2',
    category: 'course',
    recurring: true
  },
  {
    id: '3',
    title: 'Séminaire spécialisé',
    description: 'Approfondissement des techniques avancées.',
    date: '2025-06-05',
    startTime: '09:00',
    endTime: '17:00',
    capacity: {
      min: 10,
      max: 30,
      current: 14
    },
    price: 99,
    location: 'Grande salle',
    category: 'seminar',
    recurring: false
  }
];

const Events = () => {
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isViewingEvent, setIsViewingEvent] = useState(false);
  const [events] = useState(sampleEvents);
  
  const handleCreateEvent = () => {
    // In a real app, would save the event
    toast.success("Événement créé avec succès");
    setIsCreatingEvent(false);
  };
  
  return (
    <AppLayout>
      <div className="flex flex-col space-y-6 pb-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Événements</h1>
            <p className="text-muted-foreground">
              Créez et gérez vos événements, ateliers et cours collectifs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtrer
            </Button>
            <Button onClick={() => setIsCreatingEvent(true)}>
              <Plus className="h-4 w-4 mr-2" /> Créer un événement
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">À venir</TabsTrigger>
            <TabsTrigger value="past">Passés</TabsTrigger>
            <TabsTrigger value="draft">Brouillons</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <Card key={event.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {new Date(event.date).toLocaleDateString('fr-FR')}
                        </CardDescription>
                      </div>
                      <Badge variant={event.recurring ? "outline" : "secondary"}>
                        {event.recurring ? "Récurrent" : "Unique"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{event.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>{event.capacity.current}/{event.capacity.max}</span>
                      </div>
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>{event.category === 'workshop' ? 'Atelier' : 
                              event.category === 'course' ? 'Cours' : 'Séminaire'}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>{event.price} €</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Button variant="outline" size="sm" onClick={() => {
                      setSelectedEvent(event);
                      setIsViewingEvent(true);
                    }}>
                      Détails
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="past" className="mt-4">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun événement passé à afficher</p>
            </div>
          </TabsContent>
          
          <TabsContent value="draft" className="mt-4">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun brouillon d'événement</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Create Event Dialog */}
      <Dialog open={isCreatingEvent} onOpenChange={setIsCreatingEvent}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Créer un nouvel événement</DialogTitle>
            <DialogDescription>
              Renseignez les détails de votre événement ou cours collectif
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre de l'événement</Label>
              <Input id="title" placeholder="Ex: Atelier découverte" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre événement en quelques mots..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select defaultValue="workshop">
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshop">Atelier</SelectItem>
                    <SelectItem value="course">Cours</SelectItem>
                    <SelectItem value="seminar">Séminaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">Heure de début</Label>
                <Input id="startTime" type="time" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="endTime">Heure de fin</Label>
                <Input id="endTime" type="time" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="maxCapacity">Capacité max</Label>
                <Input id="maxCapacity" type="number" min="1" defaultValue="10" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="price">Prix (€)</Label>
                <Input id="price" type="number" min="0" step="0.01" defaultValue="0" />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">Lieu</Label>
              <Input id="location" placeholder="Ex: Salle principale" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingEvent(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateEvent}>Créer l'événement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Event Details Dialog */}
      <Dialog open={isViewingEvent} onOpenChange={setIsViewingEvent}>
        {selectedEvent && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={selectedEvent.recurring ? "outline" : "secondary"}>
                  {selectedEvent.recurring ? "Récurrent" : "Unique"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(selectedEvent.date).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </DialogHeader>
            
            <div className="space-y-4">
              <p>{selectedEvent.description}</p>
              
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Horaires</p>
                  <p className="font-medium">{selectedEvent.startTime} - {selectedEvent.endTime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lieu</p>
                  <p className="font-medium">{selectedEvent.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Participants</p>
                  <p className="font-medium">
                    {selectedEvent.capacity.current}/{selectedEvent.capacity.max}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prix</p>
                  <p className="font-medium">{selectedEvent.price} €</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Participants inscrits</h3>
                {selectedEvent.capacity.current > 0 ? (
                  <div className="text-sm text-muted-foreground">
                    {selectedEvent.capacity.current} participants inscrits
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Aucun participant inscrit pour le moment
                  </div>
                )}
              </div>
              
              <div className="flex justify-between pt-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Participants
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </AppLayout>
  );
};

export default Events;
