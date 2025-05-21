
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { Service, Category } from '@/types/service';

interface ServiceSelectionProps {
  customTexts: {
    selectServiceLabel?: string;
  };
  activeCategories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
  filteredServices: Service[];
  selectedService: Service | null;
  setSelectedService: (service: Service) => void;
  getButtonStyle: () => { className: string; style: { backgroundColor: string; borderColor: string } };
  primaryColor: string;
}

const ServiceSelection = ({
  customTexts,
  activeCategories,
  selectedCategory,
  setSelectedCategory,
  filteredServices,
  selectedService,
  setSelectedService,
  getButtonStyle,
  primaryColor
}: ServiceSelectionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {customTexts.selectServiceLabel || "Sélectionnez un service"}
      </h2>
      
      {activeCategories.length > 0 && (
        <div className="space-y-2">
          <Label>Catégorie</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              size="sm"
              {...(!selectedCategory ? getButtonStyle() : {})}
            >
              Tous
            </Button>
            {activeCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                size="sm"
                {...(selectedCategory === category.id ? getButtonStyle() : {})}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-2">
        {filteredServices.map((service) => (
          <Card 
            key={service.id} 
            className={`cursor-pointer hover:shadow-md transition-all ${selectedService?.id === service.id ? 'ring-2' : ''}`}
            style={{ borderColor: selectedService?.id === service.id ? primaryColor : undefined }}
            onClick={() => setSelectedService(service)}
          >
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {service.duration} min
              </div>
              <div className="font-medium">{service.price} €</div>
            </CardFooter>
          </Card>
        ))}

        {filteredServices.length === 0 && (
          <div className="col-span-2 text-center p-6 border rounded-lg">
            <p>Aucun service disponible dans cette catégorie.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceSelection;
