
import { 
  Clock, 
  DollarSign, 
  MapPin, 
  Users, 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Tag, 
  ToggleLeft, 
  ToggleRight, 
  CalendarClock,
  Calendar,
  X,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { Service, Category } from "@/types/service";

interface ServiceDetailsProps {
  service: Service;
  categories: Category[];
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onBack: () => void;
}

export const ServiceDetails = ({
  service,
  categories,
  onEdit,
  onDelete,
  onToggleStatus,
  onBack,
}: ServiceDetailsProps) => {
  const hasVariableDurationOptions = service.variableDurationOptions && service.variableDurationOptions.length > 0;
  
  const getRecurringFrequencyLabel = (frequency?: string) => {
    switch (frequency) {
      case 'daily': return 'Quotidien';
      case 'weekly': return 'Hebdomadaire';
      case 'monthly': return 'Mensuel';
      case 'yearly': return 'Annuel';
      default: return 'Non défini';
    }
  };

  // Find the category for this service
  const category = service.categoryId ? categories.find(c => c.id === service.categoryId) : undefined;
  
  // Get breadcrumb for category (all parent categories)
  const getCategoryBreadcrumb = () => {
    if (!category) return null;
    
    const breadcrumb: Category[] = [category];
    let currentCategory = category;
    
    // Walk up the category tree
    while (currentCategory.parentId) {
      const parentCategory = categories.find(c => c.id === currentCategory.parentId);
      if (parentCategory) {
        breadcrumb.unshift(parentCategory);
        currentCategory = parentCategory;
      } else {
        break;
      }
    }
    
    return breadcrumb;
  };
  
  const categoryBreadcrumb = getCategoryBreadcrumb();

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="p-0 h-auto mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux services
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{service.name}</h1>
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
            
            <div className="flex flex-wrap gap-2 mt-1">
              {categoryBreadcrumb && (
                <div className="flex items-center gap-1">
                  {categoryBreadcrumb.map((cat, index) => (
                    <div key={cat.id} className="flex items-center">
                      <Badge 
                        className="bg-opacity-20 hover:bg-opacity-30 border-none" 
                        style={{
                          backgroundColor: `${cat.color}22`,
                          color: cat.color
                        }}
                      >
                        {cat.name}
                      </Badge>
                      {index < categoryBreadcrumb.length - 1 && (
                        <span className="mx-1 text-muted-foreground">/</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">
                {service.category}
              </Badge>
            </div>
          </div>
          {!hasVariableDurationOptions && (
            <div className="text-3xl font-bold">{service.price} €</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Durée</h3>
                {!hasVariableDurationOptions ? (
                  <p>{service.duration} minutes</p>
                ) : (
                  <p>Variable (plusieurs options)</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Lieu</h3>
                <p>{service.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Capacité</h3>
                <p>{service.capacity === 0 ? "Illimitée" : `${service.capacity} personne(s)`}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {service.description || "Aucune description fournie."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Détails supplémentaires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Temps tampon avant</span>
              </div>
              <span className="font-medium">{service.bufferTimeBefore} min</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Temps tampon après</span>
              </div>
              <span className="font-medium">{service.bufferTimeAfter} min</span>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Employés assignés</span>
              </div>
              <span className="font-medium">{service.assignedEmployees.length}</span>
            </div>
            
            {category && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Catégorie</span>
                  </div>
                  <Badge
                    className="bg-opacity-20 border-none"
                    style={{
                      backgroundColor: `${category.color}22`,
                      color: category.color
                    }}
                  >
                    {category.name}
                  </Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Options de durée variable si applicable */}
      {hasVariableDurationOptions && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Options de durée et prix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {service.variableDurationOptions!.map(option => (
                <div key={option.id} className="border rounded-lg p-4 bg-secondary/10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{option.name}</h3>
                    <Badge variant="outline">{option.duration} min</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-lg font-semibold">{option.price} €</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Service récurrent si applicable */}
      {service.isRecurring && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Paramètres de récurrence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Fréquence</span>
              </div>
              <Badge variant="secondary">
                {getRecurringFrequencyLabel(service.recurringFrequency)}
              </Badge>
            </div>
            
            {service.recurringExceptions && service.recurringExceptions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Exceptions</h4>
                <div className="flex flex-wrap gap-2">
                  {service.recurringExceptions.map(date => (
                    <Badge key={date} variant="outline" className="flex items-center gap-1">
                      {format(new Date(date), "dd/MM/yyyy")}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={onToggleStatus}
          className="flex items-center"
        >
          {service.isActive ? (
            <>
              <ToggleLeft className="mr-2 h-4 w-4" />
              Désactiver
            </>
          ) : (
            <>
              <ToggleRight className="mr-2 h-4 w-4" />
              Activer
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={onEdit}
          className="flex items-center"
        >
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex items-center">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Supprimer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
