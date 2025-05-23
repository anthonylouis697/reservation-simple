
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Mock data for services avec les nouvelles propriétés
const services = [
  { 
    id: "1", 
    name: "Consultation", 
    duration: 30, 
    price: 50, 
    bookings: 12,
    hasVariableOptions: false,
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=60&fit=crop"
  },
  { 
    id: "2", 
    name: "Traitement standard", 
    duration: 60, 
    price: 100, 
    bookings: 8,
    hasVariableOptions: false,
    imageUrl: undefined
  },
  { 
    id: "3", 
    name: "Thérapie intensive", 
    duration: 90, 
    price: 0, 
    bookings: 4,
    hasVariableOptions: true,
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=60&fit=crop"
  }
];

export const ServicesWidget = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Services populaires</span>
          <div className="bg-purple-100 p-2 rounded-full">
            <ScrollText className="h-5 w-5 text-purple-600" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {services.map((service, index) => (
            <div key={service.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {service.imageUrl && (
                    <img 
                      src={service.imageUrl} 
                      alt={service.name}
                      className="w-12 h-8 object-cover rounded"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium">{service.name}</p>
                      {service.hasVariableOptions && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0">
                          Options variables
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>{service.duration} min</span>
                      <span className="mx-1">•</span>
                      {service.hasVariableOptions ? (
                        <span>À partir de {service.price} €</span>
                      ) : (
                        <span>{service.price} €</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{service.bookings}</p>
                  <p className="text-xs text-muted-foreground">réservations</p>
                </div>
              </div>
              {index < services.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => navigate("/services")}
        >
          <Tag className="h-4 w-4 mr-2" />
          Gérer les services
        </Button>
      </CardFooter>
    </Card>
  );
};
