
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Calendar, 
  Tag, 
  MessageSquare, 
  MapPin, 
  Mail, 
  Phone 
} from "lucide-react";
import { Client } from "@/pages/Clients";

interface ClientDetailsProps {
  client: Client;
  onEdit: () => void;
  onDelete: () => void;
}

export const ClientDetails = ({ client, onEdit, onDelete }: ClientDetailsProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Jamais";
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <Avatar className="h-16 w-16 mb-2 sm:mb-0 sm:mr-4">
            {client.avatar ? (
              <AvatarImage src={client.avatar} alt={client.name} />
            ) : null}
            <AvatarFallback className="text-lg">
              {client.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold">{client.name}</h3>
            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground">
              <div className="flex items-center justify-center sm:justify-start">
                <Mail className="h-4 w-4 mr-1" />
                <a href={`mailto:${client.email}`} className="hover:underline">
                  {client.email}
                </a>
              </div>
              <span className="hidden sm:block mx-2">•</span>
              <div className="flex items-center justify-center sm:justify-start">
                <Phone className="h-4 w-4 mr-1" />
                <a href={`tel:${client.phone}`} className="hover:underline">
                  {client.phone}
                </a>
              </div>
            </div>
            <div className="mt-2">
              <Badge variant={client.status === "active" ? "default" : "secondary"}>
                {client.status === "active" ? "Client actif" : "Client inactif"}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0 justify-center sm:justify-start">
          <Button onClick={onEdit}>Modifier</Button>
          <Button variant="destructive" onClick={onDelete}>
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informations du client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {client.address && (Object.values(client.address).some(v => v)) && (
              <div>
                <div className="flex items-center text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Adresse</span>
                </div>
                <p className="text-sm pl-6">
                  {[
                    client.address.street,
                    client.address.zipCode,
                    client.address.city,
                    client.address.country !== "France" ? client.address.country : ""
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            )}
            
            {client.notes && (
              <div>
                <div className="flex items-center text-muted-foreground mb-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Notes</span>
                </div>
                <p className="text-sm pl-6">{client.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Historique</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Dernière visite</span>
              </div>
              <span className="text-sm font-medium">
                {formatDate(client.lastVisit)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Total des rendez-vous</span>
              </div>
              <span className="text-sm font-medium">{client.totalAppointments}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Montant total dépensé</span>
              </div>
              <span className="text-sm font-medium">
                {client.totalSpent.toLocaleString("fr-FR")} €
              </span>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-end">
            <Button variant="outline" size="sm" disabled>
              Voir l'historique complet
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rendez-vous à venir</CardTitle>
          <CardDescription>
            Prochains rendez-vous planifiés pour ce client
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-10 w-10 mx-auto mb-2 opacity-25" />
            <p>Aucun rendez-vous à venir</p>
            <Button variant="outline" className="mt-4" disabled>
              Planifier un rendez-vous
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
