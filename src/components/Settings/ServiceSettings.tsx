
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useBusiness } from "@/contexts/BusinessContext";

interface ServiceType {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string | null;
  is_active: boolean;
  business_id: string;
  created_at: string;
  updated_at: string;
  position: number;
  category_id: string | null;
}

const ServiceSettings = () => {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<ServiceType | null>(null);
  const { currentBusiness } = useBusiness();
  
  const [formData, setFormData] = useState({
    name: "",
    duration: 30,
    price: 0,
    description: "",
    is_active: true
  });

  // Charger les services de l'entreprise courante
  useEffect(() => {
    const fetchServices = async () => {
      if (!currentBusiness) {
        setServices([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('business_id', currentBusiness.id)
          .order('position');
        
        if (error) throw error;
        
        setServices(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des services:', error);
        toast.error('Impossible de charger vos services');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, [currentBusiness]);

  const handleEditService = (service: ServiceType) => {
    setCurrentService(service);
    setFormData({
      name: service.name,
      duration: service.duration,
      price: service.price as number,
      description: service.description || "",
      is_active: service.is_active
    });
    setIsDialogOpen(true);
  };

  const handleAddNewService = () => {
    setCurrentService(null);
    setFormData({
      name: "",
      duration: 30,
      price: 0,
      description: "",
      is_active: true
    });
    setIsDialogOpen(true);
  };

  const handleSaveService = async () => {
    if (!currentBusiness) {
      toast.error('Aucune entreprise sélectionnée');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      if (currentService) {
        // Mise à jour d'un service existant
        const { error } = await supabase
          .from('services')
          .update({
            name: formData.name,
            duration: formData.duration,
            price: formData.price,
            description: formData.description || null,
            is_active: formData.is_active
          })
          .eq('id', currentService.id);
        
        if (error) throw error;
        
        // Mettre à jour la liste des services en local
        setServices(prev => prev.map(service => 
          service.id === currentService.id 
            ? { ...service, ...formData } 
            : service
        ));
        
        toast.success('Service mis à jour avec succès');
      } else {
        // Création d'un nouveau service
        const { data, error } = await supabase
          .from('services')
          .insert({
            business_id: currentBusiness.id,
            name: formData.name,
            duration: formData.duration,
            price: formData.price,
            description: formData.description || null,
            is_active: formData.is_active,
            position: services.length // Ajout à la fin de la liste
          })
          .select()
          .single();
        
        if (error) throw error;
        
        // Ajouter le nouveau service à la liste locale
        setServices(prev => [...prev, data]);
        
        toast.success('Service ajouté avec succès');
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du service:', error);
      toast.error('Une erreur est survenue lors de l\'enregistrement du service');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Mettre à jour la liste des services en local
      setServices(prev => prev.filter(service => service.id !== id));
      
      toast.success('Service supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du service:', error);
      toast.error('Une erreur est survenue lors de la suppression du service');
    }
  };

  const handleToggleServiceStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      // Mettre à jour la liste des services en local
      setServices(prev => prev.map(service => 
        service.id === id 
          ? { ...service, is_active: !service.is_active } 
          : service
      ));
      
      toast.success(`Service ${!currentStatus ? 'activé' : 'désactivé'} avec succès`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du service:', error);
      toast.error('Une erreur est survenue lors de la mise à jour du service');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "duration" || name === "price" ? Number(value) : value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      is_active: checked
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Services</CardTitle>
              <CardDescription>
                Gérez les services que vos clients peuvent réserver.
              </CardDescription>
            </div>
            <Button onClick={handleAddNewService} disabled={!currentBusiness}>
              <Plus className="mr-2 h-4 w-4" /> Ajouter un service
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!currentBusiness ? (
            <div className="text-center text-muted-foreground py-6">
              Veuillez sélectionner ou créer une entreprise pour gérer vos services.
            </div>
          ) : services.length === 0 ? (
            <div className="text-center text-muted-foreground py-6">
              Aucun service disponible. Ajoutez votre premier service pour commencer.
            </div>
          ) : (
            <div className="space-y-4">
              {services.map(service => (
                <Card key={service.id} className={!service.is_active ? "opacity-60" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={service.is_active}
                          onCheckedChange={() => handleToggleServiceStatus(service.id, service.is_active)}
                        />
                        <Button variant="ghost" size="icon" onClick={() => handleEditService(service)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm">{service.duration} minutes</span>
                      <span className="font-medium">{service.price} €</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentService ? "Modifier le service" : "Ajouter un service"}</DialogTitle>
            <DialogDescription>
              {currentService 
                ? "Modifiez les détails du service existant." 
                : "Ajoutez un nouveau service que vos clients pourront réserver."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom du service</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="ex: Consultation"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">Durée (minutes)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="5"
                  step="5"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Prix (€)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez ce service en quelques mots..."
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="is_active">Activer ce service</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isProcessing}>
              Annuler
            </Button>
            <Button onClick={handleSaveService} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {currentService ? "Enregistrement..." : "Ajout..."}
                </>
              ) : (
                currentService ? "Enregistrer" : "Ajouter"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceSettings;
