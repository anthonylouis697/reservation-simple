
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

// Mock data for services
const services = [
  { 
    id: "1", 
    name: "Consultation", 
    duration: 30, 
    price: 50, 
    bookings: 12 
  },
  { 
    id: "2", 
    name: "Traitement standard", 
    duration: 60, 
    price: 100, 
    bookings: 8 
  },
  { 
    id: "3", 
    name: "Traitement premium", 
    duration: 90, 
    price: 150, 
    bookings: 4 
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
                <div>
                  <p className="font-medium">{service.name}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{service.duration} min</span>
                    <span className="mx-1">•</span>
                    <span>{service.price} €</span>
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
