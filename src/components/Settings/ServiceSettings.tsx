
import { useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
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

interface ServiceType {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
  isActive: boolean;
}

const ServiceSettings = () => {
  const [services, setServices] = useState<ServiceType[]>([
    {
      id: "1",
      name: "Consultation",
      duration: 30,
      price: 50,
      description: "Consultation initiale pour évaluer vos besoins.",
      isActive: true,
    },
    {
      id: "2",
      name: "Traitement standard",
      duration: 60,
      price: 100,
      description: "Traitement complet standard.",
      isActive: true,
    },
    {
      id: "3",
      name: "Traitement premium",
      duration: 90,
      price: 150,
      description: "Traitement premium avec options supplémentaires.",
      isActive: false,
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<ServiceType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    duration: 30,
    price: 0,
    description: "",
    isActive: true
  });

  const handleEditService = (service: ServiceType) => {
    setCurrentService(service);
    setFormData({
      name: service.name,
      duration: service.duration,
      price: service.price,
      description: service.description,
      isActive: service.isActive
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
      isActive: true
    });
    setIsDialogOpen(true);
  };

  const handleSaveService = () => {
    if (currentService) {
      // Edit existing service
      setServices(prev => 
        prev.map(service => 
          service.id === currentService.id 
            ? {...service, ...formData} 
            : service
        )
      );
      toast.success("Service mis à jour avec succès");
    } else {
      // Add new service
      const newService = {
        id: Math.random().toString(36).substring(7),
        ...formData
      };
      setServices(prev => [...prev, newService]);
      toast.success("Nouveau service ajouté");
    }
    setIsDialogOpen(false);
  };

  const handleDeleteService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
    toast.success("Service supprimé");
  };

  const handleToggleServiceStatus = (id: string) => {
    setServices(prev => 
      prev.map(service => 
        service.id === id 
          ? {...service, isActive: !service.isActive} 
          : service
      )
    );
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
      isActive: checked
    }));
  };

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
            <Button onClick={handleAddNewService}>
              <Plus className="mr-2 h-4 w-4" /> Ajouter un service
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                Aucun service disponible. Ajoutez votre premier service pour commencer.
              </p>
            ) : (
              services.map(service => (
                <Card key={service.id} className={!service.isActive ? "opacity-60" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={service.isActive}
                          onCheckedChange={() => handleToggleServiceStatus(service.id)}
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
              ))
            )}
          </div>
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
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isActive">Activer ce service</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveService}>{currentService ? "Enregistrer" : "Ajouter"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceSettings;
