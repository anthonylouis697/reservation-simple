
import { useState, useMemo } from "react";
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Tag, 
  Clock, 
  DollarSign, 
  MapPin, 
  Users,
  CalendarClock,
  Layers
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServiceForm } from "@/components/Services/ServiceForm";
import { ServiceDetails } from "@/components/Services/ServiceDetails";
import { CategoriesManagement } from "@/components/Services/CategoriesManagement";
import { Service, Category } from "@/types/service";

// Mock data for services
const initialServices: Service[] = [
  {
    id: "1",
    name: "Consultation standard",
    description: "Consultation initiale pour évaluer les besoins du client",
    duration: 30,
    price: 50,
    location: "Cabinet principal",
    capacity: 1,
    category: "Consultations",
    bufferTimeBefore: 5,
    bufferTimeAfter: 5,
    assignedEmployees: ["1", "2"],
    isRecurring: false,
    isActive: true,
  },
  {
    id: "2",
    name: "Traitement complet",
    description: "Session de traitement complète incluant diagnostic et soins",
    duration: 60,
    price: 100,
    location: "Cabinet principal",
    capacity: 1,
    category: "Traitements",
    bufferTimeBefore: 10,
    bufferTimeAfter: 10,
    assignedEmployees: ["1"],
    isRecurring: false,
    isActive: true,
  },
  {
    id: "3",
    name: "Atelier en groupe",
    description: "Atelier collectif pour apprendre des techniques spécifiques",
    duration: 90,
    price: 30,
    location: "Salle commune",
    capacity: 10,
    category: "Ateliers",
    bufferTimeBefore: 15,
    bufferTimeAfter: 15,
    assignedEmployees: ["2", "3"],
    isRecurring: true,
    recurringFrequency: "weekly",
    recurringExceptions: ["2025-06-15", "2025-07-20"],
    isActive: true,
  },
  {
    id: "4",
    name: "Thérapie intensive",
    description: "Session de thérapie approfondie pour cas complexes",
    duration: 120,
    price: 150,
    location: "Cabinet spécialisé",
    capacity: 1,
    category: "Thérapies",
    bufferTimeBefore: 10,
    bufferTimeAfter: 10,
    assignedEmployees: ["1"],
    isRecurring: false,
    isActive: true,
    variableDurationOptions: [
      { id: "opt1", name: "Standard", duration: 60, price: 100 },
      { id: "opt2", name: "Intensive", duration: 90, price: 150 },
      { id: "opt3", name: "Premium", duration: 120, price: 200 }
    ]
  },
  {
    id: "5",
    name: "Séance spéciale",
    description: "Séance pour traitement spécifique et personnalisé",
    duration: 45,
    price: 75,
    location: "Cabinet principal",
    capacity: 1,
    category: "Traitements",
    bufferTimeBefore: 5,
    bufferTimeAfter: 5,
    assignedEmployees: ["2"],
    isRecurring: false,
    isActive: false,
  }
];

// Mock data for categories
const initialCategories: Category[] = [
  {
    id: "cat1",
    name: "Consultations",
    description: "Services de consultation et d'évaluation initiale",
    isActive: true,
    color: "#8B5CF6", // Purple
  },
  {
    id: "cat2",
    name: "Traitements",
    description: "Services de traitement et de soins",
    isActive: true,
    color: "#10B981", // Green
  },
  {
    id: "cat3",
    name: "Thérapies",
    description: "Services thérapeutiques spécialisés",
    isActive: true,
    color: "#3B82F6", // Blue
  },
  {
    id: "cat4",
    name: "Ateliers",
    description: "Activités en groupe et ateliers collectifs",
    isActive: true,
    color: "#F59E0B", // Amber
  },
  {
    id: "cat5",
    name: "Massages",
    description: "Services de massage et relaxation",
    parentId: "cat2",
    isActive: true,
    color: "#06B6D4", // Cyan
  },
  {
    id: "cat6",
    name: "Soins du visage",
    description: "Traitements pour le visage",
    parentId: "cat2",
    isActive: false,
    color: "#EC4899", // Pink
  }
];

export default function Services() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [activeTab, setActiveTab] = useState("services");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [viewingService, setViewingService] = useState<Service | null>(null);
  const { toast } = useToast();

  // Calculate how many services are in each category
  const serviceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    services.forEach(service => {
      if (service.categoryId) {
        counts[service.categoryId] = (counts[service.categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [services]);

  // Get category name by id
  const getCategoryNameById = (categoryId?: string) => {
    if (!categoryId) return "";
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "";
  };

  // Get color of a category
  const getCategoryColorById = (categoryId?: string) => {
    if (!categoryId) return "";
    const category = categories.find(c => c.id === categoryId);
    return category?.color || "";
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCategoryNameById(service.categoryId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddService = () => {
    setEditingService(null);
    setIsFormOpen(true);
    setViewingService(null);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setIsFormOpen(true);
    setViewingService(null);
  };

  const handleViewService = (service: Service) => {
    setViewingService(service);
    setIsFormOpen(false);
  };

  const handleSubmit = (serviceData: Service) => {
    if (editingService) {
      // Update existing service
      setServices(services.map(s => 
        s.id === serviceData.id ? serviceData : s
      ));
      toast({
        title: "Service mis à jour",
        description: `Le service "${serviceData.name}" a été modifié avec succès.`
      });
    } else {
      // Add new service with generated ID
      const newService = {
        ...serviceData,
        id: Math.max(...services.map(s => parseInt(s.id, 10)), 0) + 1 + "",
      };
      setServices([...services, newService]);
      toast({
        title: "Service créé",
        description: `Le service "${serviceData.name}" a été ajouté avec succès.`
      });
    }
    setIsFormOpen(false);
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter(s => s.id !== serviceId));
    setViewingService(null);
    toast({
      title: "Service supprimé",
      description: "Le service a été supprimé avec succès."
    });
  };

  const handleToggleStatus = (serviceId: string) => {
    const updatedServices = services.map(s => 
      s.id === serviceId ? { ...s, isActive: !s.isActive } : s
    );
    setServices(updatedServices);
    
    // Update viewing service if it's the one being toggled
    if (viewingService && viewingService.id === serviceId) {
      setViewingService({ ...viewingService, isActive: !viewingService.isActive });
    }
    
    const service = services.find(s => s.id === serviceId);
    if (service) {
      const newStatus = !service.isActive;
      toast({
        title: newStatus ? "Service activé" : "Service désactivé",
        description: `Le service "${service.name}" est maintenant ${newStatus ? "actif" : "inactif"}.`
      });
    }
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingService(null);
  };

  const handleBackFromDetails = () => {
    setViewingService(null);
  };

  // Category management handlers
  const handleAddCategory = (category: Category) => {
    setCategories([...categories, category]);
    toast({
      title: "Catégorie créée",
      description: `La catégorie "${category.name}" a été ajoutée avec succès.`
    });
  };

  const handleUpdateCategory = (category: Category) => {
    setCategories(categories.map(c => c.id === category.id ? category : c));
    toast({
      title: "Catégorie mise à jour",
      description: `La catégorie "${category.name}" a été modifiée avec succès.`
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    // Get all descendant categories recursively
    const getDescendantIds = (catId: string): string[] => {
      const directChildren = categories.filter(c => c.parentId === catId).map(c => c.id);
      const allDescendants = [...directChildren];
      
      directChildren.forEach(childId => {
        allDescendants.push(...getDescendantIds(childId));
      });
      
      return allDescendants;
    };
    
    const descendantIds = getDescendantIds(categoryId);
    const allIdsToDelete = [categoryId, ...descendantIds];
    
    // Remove the category and all descendants
    setCategories(categories.filter(c => !allIdsToDelete.includes(c.id)));
    
    // Update services that were using these categories
    setServices(services.map(service => 
      allIdsToDelete.includes(service.categoryId || "") 
        ? { ...service, categoryId: undefined } 
        : service
    ));
    
    toast({
      title: "Catégorie supprimée",
      description: `La catégorie et ses sous-catégories ont été supprimées avec succès.`
    });
  };

  const handleToggleCategoryStatus = (categoryId: string) => {
    setCategories(categories.map(c => 
      c.id === categoryId ? { ...c, isActive: !c.isActive } : c
    ));
    
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      const newStatus = !category.isActive;
      toast({
        title: newStatus ? "Catégorie activée" : "Catégorie désactivée",
        description: `La catégorie "${category.name}" est maintenant ${newStatus ? "active" : "inactive"}.`
      });
    }
  };
  
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Gestion des services</h1>
          {activeTab === "services" && !isFormOpen && !viewingService && (
            <Button onClick={handleAddService}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouveau service
            </Button>
          )}
        </div>

        {!isFormOpen && !viewingService && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="categories">Catégories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="services">
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un service..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredServices.map((service) => {
                  const categoryColor = service.categoryId 
                    ? getCategoryColorById(service.categoryId) 
                    : "";
                  
                  return (
                    <Card 
                      key={service.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${!service.isActive ? 'opacity-60' : ''}`}
                      onClick={() => handleViewService(service)}
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h2 className="font-semibold text-lg">{service.name}</h2>
                              {!service.isActive && (
                                <Badge variant="outline" className="bg-gray-100 text-gray-500">
                                  Inactif
                                </Badge>
                              )}
                              {service.isRecurring && (
                                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                  Récurrent
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-1 flex-wrap">
                              {service.categoryId && (
                                <Badge 
                                  className="hover:bg-opacity-80 border-none" 
                                  style={{
                                    backgroundColor: `${categoryColor}22`,
                                    color: categoryColor
                                  }}
                                >
                                  {getCategoryNameById(service.categoryId)}
                                </Badge>
                              )}
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">
                                {service.category}
                              </Badge>
                            </div>
                          </div>
                          {!service.variableDurationOptions?.length && (
                            <div className="text-2xl font-semibold text-right">
                              {service.price} €
                            </div>
                          )}
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <div className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {service.description}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {!service.variableDurationOptions?.length ? (
                              <span>{service.duration} min</span>
                            ) : (
                              <span>Variable</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="truncate">{service.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            <span>Max: {service.capacity === 0 ? '∞' : service.capacity}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Tag className="h-3.5 w-3.5" />
                            <span>{service.assignedEmployees.length} employé(s)</span>
                          </div>
                          {service.variableDurationOptions?.length ? (
                            <div className="flex items-center gap-1 col-span-2">
                              <DollarSign className="h-3.5 w-3.5" />
                              <span>{service.variableDurationOptions.length} options de prix</span>
                            </div>
                          ) : null}
                          {service.isRecurring && (
                            <div className="flex items-center gap-1 col-span-2">
                              <CalendarClock className="h-3.5 w-3.5" />
                              <span>
                                {service.recurringFrequency === 'daily' && 'Quotidien'}
                                {service.recurringFrequency === 'weekly' && 'Hebdomadaire'}
                                {service.recurringFrequency === 'monthly' && 'Mensuel'}
                                {service.recurringFrequency === 'yearly' && 'Annuel'}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredServices.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-gray-100 p-3 mb-4">
                    <Tag className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">Aucun service trouvé</h3>
                  <p className="text-muted-foreground mt-1 mb-4">
                    Aucun service ne correspond à votre recherche.
                  </p>
                  <Button variant="outline" onClick={() => setSearchTerm("")}>
                    Afficher tous les services
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="categories">
              <CategoriesManagement 
                categories={categories}
                onAddCategory={handleAddCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
                onToggleStatus={handleToggleCategoryStatus}
                serviceCounts={serviceCounts}
              />
            </TabsContent>
          </Tabs>
        )}

        {isFormOpen && (
          <ServiceForm 
            initialData={editingService || undefined} 
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
          />
        )}

        {viewingService && (
          <ServiceDetails 
            service={viewingService}
            categories={categories}
            onEdit={() => handleEditService(viewingService)}
            onDelete={() => handleDeleteService(viewingService.id)}
            onToggleStatus={() => handleToggleStatus(viewingService.id)}
            onBack={handleBackFromDetails}
          />
        )}
      </div>
    </div>
  );
}
