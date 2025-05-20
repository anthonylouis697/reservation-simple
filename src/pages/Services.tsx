import { useState, useMemo, useEffect } from "react";
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
  Layers,
  ArrowLeft,
  Pencil,
  Loader2
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
import { useNavigate, useLocation } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useBusiness } from "@/contexts/BusinessContext";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=300&fit=crop",
    order: 0
  },
  {
    id: "cat2",
    name: "Traitements",
    description: "Services de traitement et de soins",
    isActive: true,
    color: "#10B981", // Green
    imageUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop",
    order: 1
  },
  {
    id: "cat3",
    name: "Thérapies",
    description: "Services thérapeutiques spécialisés",
    isActive: true,
    color: "#3B82F6", // Blue
    imageUrl: "/placeholder.svg",
    order: 2
  },
  {
    id: "cat4",
    name: "Ateliers",
    description: "Activités en groupe et ateliers collectifs",
    isActive: true,
    color: "#F59E0B", // Amber
    order: 3
  },
  {
    id: "cat5",
    name: "Massages",
    description: "Services de massage et relaxation",
    parentId: "cat2",
    isActive: true,
    color: "#06B6D4", // Cyan
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=300&fit=crop",
    order: 0
  },
  {
    id: "cat6",
    name: "Soins du visage",
    description: "Traitements pour le visage",
    parentId: "cat2",
    isActive: false,
    color: "#EC4899", // Pink
    order: 1
  }
];

// Composant pour l'onglet Ressources
const ResourcesTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Ressources</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvelle ressource
        </Button>
      </div>
      <div className="bg-muted/40 border rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Pencil className="h-8 w-8 text-primary/70" />
        </div>
        <h3 className="text-xl font-medium mb-2">Module en cours de développement</h3>
        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
          Le module de gestion des ressources sera bientôt disponible. Il vous permettra de gérer le matériel, 
          les salles et autres ressources nécessaires à vos services.
        </p>
        <Button variant="outline">Être notifié quand c'est prêt</Button>
      </div>
    </div>
  );
};

// Composant pour l'onglet Offres (Services)
const OffersTab = ({ 
  services, 
  searchTerm, 
  setSearchTerm, 
  categories, 
  handleViewService,
  getCategoryNameById,
  getCategoryColorById,
}) => {
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCategoryNameById(service.categoryId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une offre..."
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
          <h3 className="text-lg font-semibold">Aucune offre trouvée</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            Aucune offre ne correspond à votre recherche.
          </p>
          <Button variant="outline" onClick={() => setSearchTerm("")}>
            Afficher toutes les offres
          </Button>
        </div>
      )}
    </>
  );
};

export default function Services() {
  const navigate = useNavigate();
  const location = useLocation();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState("offers");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [viewingService, setViewingService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { currentBusiness } = useBusiness();

  // Determine active tab from URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    } else {
      setActiveTab("offers");
    }
  }, [location.search]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/services?tab=${value}`);
  };

  // Charger les services et catégories depuis Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!currentBusiness) {
        setServices([]);
        setCategories([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // Charger les catégories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('service_categories')
          .select('*')
          .eq('business_id', currentBusiness.id)
          .order('position');

        if (categoriesError) throw categoriesError;

        // Convertir les données Supabase en format de l'application
        const formattedCategories = categoriesData.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.description || '',
          isActive: true, // Default value since is_active doesn't exist in the database
          order: cat.position,
          parentId: undefined, // Default value since parent_id doesn't exist in the database
          color: '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0'), // Generate random color
          imageUrl: undefined
        }));

        setCategories(formattedCategories);

        // Charger les services
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .eq('business_id', currentBusiness.id)
          .order('position');

        if (servicesError) throw servicesError;

        // Convertir les données Supabase en format de l'application
        const formattedServices = servicesData.map(svc => ({
          id: svc.id,
          name: svc.name,
          description: svc.description || '',
          duration: svc.duration || 60, // Make sure to include required Service properties
          price: svc.price || 0, // Make sure to include required Service properties
          isActive: svc.is_active,
          categoryId: svc.category_id,
          category: categoriesData.find(c => c.id === svc.category_id)?.name || 'Sans catégorie',
          location: 'Cabinet principal', // Default value
          capacity: 1, // Default value
          bufferTimeBefore: 5, // Default value
          bufferTimeAfter: 5, // Default value
          assignedEmployees: [], // Default value
          isRecurring: false // Default value
        }));

        setServices(formattedServices);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos données"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentBusiness]);

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

  const handleSubmit = async (serviceData: Service) => {
    if (!currentBusiness) {
      toast({
        title: "Erreur",
        description: "Aucune entreprise sélectionnée"
      });
      return;
    }

    try {
      if (editingService) {
        // Mise à jour d'un service existant
        const { error } = await supabase
          .from('services')
          .update({
            name: serviceData.name,
            description: serviceData.description || null,
            duration: serviceData.duration,
            price: serviceData.price,
            is_active: serviceData.isActive,
            category_id: serviceData.categoryId || null
          })
          .eq('id', serviceData.id);

        if (error) throw error;

        // Mettre à jour la liste des services en local
        setServices(prev => prev.map(s => 
          s.id === serviceData.id ? serviceData : s
        ));

        toast({
          title: "Service mis à jour",
          description: `Le service "${serviceData.name}" a été modifié avec succès.`
        });
      } else {
        // Création d'un nouveau service
        const { data, error } = await supabase
          .from('services')
          .insert({
            business_id: currentBusiness.id,
            name: serviceData.name,
            description: serviceData.description || null,
            duration: serviceData.duration,
            price: serviceData.price,
            is_active: serviceData.isActive,
            category_id: serviceData.categoryId || null,
            position: services.length // Ajout à la fin de la liste
          })
          .select()
          .single();

        if (error) throw error;

        // Ajouter le nouveau service à la liste locale
        const newService = {
          ...serviceData,
          id: data.id
        };
        
        setServices(prev => [...prev, newService]);

        toast({
          title: "Service créé",
          description: `Le service "${serviceData.name}" a été ajouté avec succès.`
        });
      }

      setIsFormOpen(false);
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement du service:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du service"
      });
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      // Mettre à jour la liste des services en local
      setServices(prev => prev.filter(s => s.id !== serviceId));
      setViewingService(null);

      toast({
        title: "Service supprimé",
        description: "Le service a été supprimé avec succès."
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du service:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du service"
      });
    }
  };

  const handleToggleStatus = async (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !service.isActive })
        .eq('id', serviceId);

      if (error) throw error;

      // Mettre à jour la liste des services en local
      setServices(prev => prev.map(s => 
        s.id === serviceId ? { ...s, isActive: !s.isActive } : s
      ));

      // Mettre à jour le service en cours de visualisation
      if (viewingService && viewingService.id === serviceId) {
        setViewingService({ ...viewingService, isActive: !viewingService.isActive });
      }

      const newStatus = !service.isActive;
      toast({
        title: newStatus ? "Service activé" : "Service désactivé",
        description: `Le service "${service.name}" est maintenant ${newStatus ? "actif" : "inactif"}.`
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du service:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du service"
      });
    }
  };

  // Category management handlers
  const handleAddCategory = async (category: Category) => {
    if (!currentBusiness) {
      toast({
        title: "Erreur",
        description: "Aucune entreprise sélectionnée"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('service_categories')
        .insert({
          business_id: currentBusiness.id,
          name: category.name,
          description: category.description || null,
          position: category.order || categories.length
        })
        .select()
        .single();

      if (error) throw error;

      // Ajouter la nouvelle catégorie à la liste locale
      const newCategory = {
        ...category,
        id: data.id
      };
      
      setCategories(prev => [...prev, newCategory]);

      toast({
        title: "Catégorie créée",
        description: `La catégorie "${category.name}" a été ajoutée avec succès.`
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la catégorie:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de la catégorie"
      });
    }
  };

  const handleUpdateCategory = async (category: Category) => {
    try {
      const { error } = await supabase
        .from('service_categories')
        .update({
          name: category.name,
          description: category.description || null,
          position: category.order || 0
        })
        .eq('id', category.id);

      if (error) throw error;

      // Mettre à jour la liste des catégories en local
      setCategories(prev => prev.map(c => c.id === category.id ? category : c));

      toast({
        title: "Catégorie mise à jour",
        description: `La catégorie "${category.name}" a été modifiée avec succès.`
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la catégorie"
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      // Vérifier si la catégorie a des services associés
      const hasServices = services.some(s => s.categoryId === categoryId);
      if (hasServices) {
        if (!window.confirm('Cette catégorie contient des services. La suppression va dissocier ces services de leur catégorie. Continuer ?')) {
          return;
        }
        
        // Mettre à jour les services associés
        const { error: updateError } = await supabase
          .from('services')
          .update({ category_id: null })
          .eq('category_id', categoryId);
          
        if (updateError) throw updateError;
        
        // Mettre à jour les services localement
        setServices(prev => prev.map(service => 
          service.categoryId === categoryId 
            ? { ...service, categoryId: undefined, category: 'Sans catégorie' } 
            : service
        ));
      }

      // Vérifier si la catégorie a des enfants
      const childCategories = categories.filter(c => c.parentId === categoryId);
      if (childCategories.length > 0) {
        if (!window.confirm('Cette catégorie a des sous-catégories. La suppression va également supprimer ces sous-catégories. Continuer ?')) {
          return;
        }
        
        // Supprimer les enfants
        for (const childCat of childCategories) {
          await handleDeleteCategory(childCat.id);
        }
      }
      
      // Supprimer la catégorie
      const { error } = await supabase
        .from('service_categories')
        .delete()
        .eq('id', categoryId);
        
      if (error) throw error;
      
      // Mettre à jour la liste des catégories en local
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      
      toast({
        title: "Catégorie supprimée",
        description: "La catégorie a été supprimée avec succès."
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la catégorie"
      });
    }
  };

  const handleToggleCategoryStatus = async (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    
    try {
      // Since is_active doesn't exist in the database, we can't update it
      // Instead, we'll just update the UI state
      
      // Mettre à jour la liste des catégories en local only
      setCategories(prev => prev.map(c => 
        c.id === categoryId ? { ...c, isActive: !c.isActive } : c
      ));
      
      const newStatus = !category.isActive;
      toast({
        title: newStatus ? "Catégorie activée" : "Catégorie désactivée",
        description: `La catégorie "${category.name}" est maintenant ${newStatus ? "active" : "inactive"}.`
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la catégorie"
      });
    }
  };

  const handleReorderCategories = async (updatedCategories: Category[]) => {
    try {
      // Mettre à jour la position des catégories en base de données
      for (let i = 0; i < updatedCategories.length; i++) {
        const category = updatedCategories[i];
        
        const { error } = await supabase
          .from('service_categories')
          .update({ position: i })
          .eq('id', category.id);
          
        if (error) throw error;
      }
      
      // Mettre à jour la liste des catégories en local
      setCategories(updatedCategories);
      
      toast({
        title: "Catégories réordonnées",
        description: "L'ordre des catégories a été mis à jour avec succès."
      });
    } catch (error) {
      console.error('Erreur lors de la réorganisation des catégories:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réorganisation des catégories"
      });
    }
  };
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex flex-col space-y-6">
          <div>
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={() => navigate("/dashboard")} className="cursor-pointer">
                    Tableau de bord
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Offres</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate("/dashboard")}
                  className="md:hidden"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Gestion des offres</h1>
              </div>
              {activeTab === "offers" && !isFormOpen && !viewingService && (
                <Button onClick={handleAddService}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nouvelle offre
                </Button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Chargement des données...</span>
            </div>
          ) : !currentBusiness ? (
            <div className="bg-muted/40 border rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="h-8 w-8 text-primary/70" />
              </div>
              <h3 className="text-xl font-medium mb-2">Aucune entreprise sélectionnée</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Veuillez sélectionner ou créer une entreprise pour gérer vos offres et services.
              </p>
              <Button variant="default" onClick={() => navigate("/settings")}>
                Gérer mes entreprises
              </Button>
            </div>
          ) : (!isFormOpen && !viewingService) ? (
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-4">
                <TabsTrigger value="offers">Offres</TabsTrigger>
                <TabsTrigger value="categories">Catégories</TabsTrigger>
                <TabsTrigger value="resources">Ressources</TabsTrigger>
              </TabsList>
              
              <TabsContent value="offers">
                <OffersTab
                  services={services}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  categories={categories}
                  handleViewService={handleViewService}
                  getCategoryNameById={getCategoryNameById}
                  getCategoryColorById={getCategoryColorById}
                />
              </TabsContent>
              
              <TabsContent value="categories">
                <CategoriesManagement 
                  categories={categories}
                  onAddCategory={handleAddCategory}
                  onUpdateCategory={handleUpdateCategory}
                  onDeleteCategory={handleDeleteCategory}
                  onToggleStatus={handleToggleCategoryStatus}
                  onReorderCategories={handleReorderCategories}
                  serviceCounts={serviceCounts}
                />
              </TabsContent>
              
              <TabsContent value="resources">
                <ResourcesTab />
              </TabsContent>
            </Tabs>
          ) : null}

          {isFormOpen && (
            <ServiceForm 
              initialData={editingService || undefined} 
              categories={categories}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingService(null);
              }}
            />
          )}

          {viewingService && (
            <ServiceDetails 
              service={viewingService}
              categories={categories}
              onEdit={() => handleEditService(viewingService)}
              onDelete={() => handleDeleteService(viewingService.id)}
              onToggleStatus={() => handleToggleStatus(viewingService.id)}
              onBack={() => setViewingService(null)}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
