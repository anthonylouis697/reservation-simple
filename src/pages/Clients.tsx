
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClientForm } from "@/components/Clients/ClientForm";
import { ClientDetails } from "@/components/Clients/ClientDetails";
import { toast } from "@/hooks/use-toast";
import { Search, MoreVertical, Plus, UserPlus } from "lucide-react";

// Types pour les clients
export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalAppointments: number;
  lastVisit: string | null;
  totalSpent: number;
  status: "active" | "inactive";
  notes?: string;
  avatar?: string;
  address?: {
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  };
};

// Données de démo pour les clients
const mockClients: Client[] = [
  {
    id: "1",
    name: "Sophie Martin",
    email: "sophie.martin@example.com",
    phone: "06 12 34 56 78",
    totalAppointments: 8,
    lastVisit: "2023-05-12",
    totalSpent: 450,
    status: "active",
    notes: "Préfère les rendez-vous en matinée",
    avatar: "",
  },
  {
    id: "2",
    name: "Thomas Bernard",
    email: "thomas.bernard@example.com",
    phone: "07 23 45 67 89",
    totalAppointments: 3,
    lastVisit: "2023-04-28",
    totalSpent: 180,
    status: "active",
    avatar: "",
  },
  {
    id: "3",
    name: "Julie Dubois",
    email: "julie.dubois@example.com",
    phone: "06 34 56 78 90",
    totalAppointments: 12,
    lastVisit: "2023-05-18",
    totalSpent: 720,
    status: "active",
    notes: "Allergique à certains produits",
    avatar: "",
  },
  {
    id: "4",
    name: "Nicolas Petit",
    email: "nicolas.petit@example.com",
    phone: "07 45 67 89 01",
    totalAppointments: 1,
    lastVisit: "2023-02-15",
    totalSpent: 60,
    status: "inactive",
    avatar: "",
  },
  {
    id: "5",
    name: "Camille Robert",
    email: "camille.robert@example.com",
    phone: "06 56 78 90 12",
    totalAppointments: 5,
    lastVisit: "2023-05-05",
    totalSpent: 320,
    status: "active",
    avatar: "",
  },
];

const Clients = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isViewClientOpen, setIsViewClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Filtrer les clients en fonction de la recherche
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery)
  );

  const handleAddClient = (client: Omit<Client, "id">) => {
    // Dans une véritable application, vous enverriez ces données à votre API
    const newClient = {
      ...client,
      id: `${clients.length + 1}`,
      totalAppointments: 0,
      lastVisit: null,
      totalSpent: 0,
      status: "active" as const,
    };
    
    setClients([...clients, newClient]);
    setIsAddClientOpen(false);
    toast({
      title: "Client ajouté",
      description: `${client.name} a été ajouté à votre base de clients.`,
    });
  };

  const handleEditClient = (client: Client) => {
    // Dans une véritable application, vous enverriez ces modifications à votre API
    const updatedClients = clients.map((c) =>
      c.id === client.id ? client : c
    );
    
    setClients(updatedClients);
    setIsViewClientOpen(false);
    setSelectedClient(null);
    setIsEditMode(false);
    toast({
      title: "Client modifié",
      description: `Les informations de ${client.name} ont été mises à jour.`,
    });
  };

  const handleDeleteClient = (clientId: string) => {
    // Dans une véritable application, vous enverriez cette demande à votre API
    const updatedClients = clients.filter((c) => c.id !== clientId);
    
    setClients(updatedClients);
    setIsViewClientOpen(false);
    setSelectedClient(null);
    toast({
      title: "Client supprimé",
      description: "Le client a été supprimé de votre base de données.",
      variant: "destructive",
    });
  };

  const viewClient = (client: Client) => {
    setSelectedClient(client);
    setIsViewClientOpen(true);
    setIsEditMode(false);
  };

  const editClient = (client: Client) => {
    setSelectedClient(client);
    setIsEditMode(true);
    setIsViewClientOpen(true);
  };

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Gérez votre base de clients et consultez leur historique
          </p>
        </div>
        <Button className="mt-4 sm:mt-0" onClick={() => setIsAddClientOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Ajouter un client
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Base de clients</CardTitle>
          <CardDescription>
            {filteredClients.length} clients enregistrés
          </CardDescription>
          <div className="flex w-full items-center space-x-2 pt-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="hidden md:table-cell">Rendez-vous</TableHead>
                  <TableHead className="hidden md:table-cell">Dernière visite</TableHead>
                  <TableHead className="hidden md:table-cell text-right">
                    Total dépensé
                  </TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center">
                        <UserPlus className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">
                          Aucun client trouvé. Commencez par en ajouter un.
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4" 
                          onClick={() => setIsAddClientOpen(true)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Ajouter un client
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell onClick={() => viewClient(client)} className="cursor-pointer">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            {client.avatar ? (
                              <AvatarImage src={client.avatar} alt={client.name} />
                            ) : null}
                            <AvatarFallback>
                              {client.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{client.name}</div>
                            <div className={`text-xs ${
                              client.status === "active" 
                                ? "text-green-600" 
                                : "text-muted-foreground"
                            }`}>
                              {client.status === "active" ? "Actif" : "Inactif"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{client.email}</div>
                          <div className="text-xs text-muted-foreground">{client.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {client.totalAppointments}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {client.lastVisit 
                          ? new Date(client.lastVisit).toLocaleDateString("fr-FR") 
                          : "-"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-right">
                        {client.totalSpent.toLocaleString("fr-FR")} €
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => viewClient(client)}>
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => editClient(client)}>
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteClient(client.id)}
                            >
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire d'ajout de client */}
      <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter un client</DialogTitle>
          </DialogHeader>
          <ClientForm onSubmit={handleAddClient} onCancel={() => setIsAddClientOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Détails ou modification d'un client */}
      {selectedClient && (
        <Dialog open={isViewClientOpen} onOpenChange={setIsViewClientOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Modifier le client" : "Détails du client"}
              </DialogTitle>
            </DialogHeader>
            {isEditMode ? (
              <ClientForm
                initialData={selectedClient}
                onSubmit={handleEditClient}
                onCancel={() => {
                  setIsEditMode(false);
                  setIsViewClientOpen(false);
                }}
              />
            ) : (
              <ClientDetails 
                client={selectedClient} 
                onEdit={() => setIsEditMode(true)} 
                onDelete={() => handleDeleteClient(selectedClient.id)} 
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </AppLayout>
  );
};

export default Clients;
