
import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { Search, MoreVertical, Plus, UserPlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useBusiness } from "@/contexts/BusinessContext";

// Types pour les clients
export type Client = {
  id: string;
  name?: string; // Dérivé de first_name + last_name
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  totalAppointments?: number;
  lastVisit?: string | null;
  totalSpent?: number;
  status?: "active" | "inactive";
  notes?: string;
  avatar?: string;
  address?: {
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  };
};

// Type for database client data
type DbClient = {
  id: string;
  business_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const Clients = () => {
  const { currentBusiness } = useBusiness();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isViewClientOpen, setIsViewClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (currentBusiness) {
      fetchClients();
    }
  }, [currentBusiness]);

  const fetchClients = async () => {
    if (!currentBusiness) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('business_id', currentBusiness.id);
        
      if (error) {
        throw error;
      }
      
      // Transform database clients to our Client type
      const formattedClients: Client[] = (data as DbClient[]).map(client => ({
        id: client.id,
        first_name: client.first_name,
        last_name: client.last_name,
        name: `${client.first_name} ${client.last_name}`,
        email: client.email || '',
        phone: client.phone || '',
        notes: client.notes || '',
        totalAppointments: 0, // Default value
        status: "active" as const, // Explicitly type as "active"
        totalSpent: 0, // Default value
        lastVisit: null,
      }));
      
      setClients(formattedClients);
    } catch (error: any) {
      console.error("Erreur lors du chargement des clients:", error);
      toast.error(`Échec du chargement des clients: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les clients en fonction de la recherche
  const filteredClients = clients.filter(
    (client) =>
      client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone?.includes(searchQuery)
  );

  const handleAddClient = async (client: Omit<Client, "id">) => {
    if (!currentBusiness) {
      toast.error("Aucune entreprise sélectionnée");
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          first_name: client.first_name,
          last_name: client.last_name,
          email: client.email,
          phone: client.phone,
          notes: client.notes,
          business_id: currentBusiness.id
        })
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        const newClient: Client = {
          id: data[0].id,
          first_name: data[0].first_name,
          last_name: data[0].last_name,
          name: `${data[0].first_name} ${data[0].last_name}`,
          email: data[0].email || '',
          phone: data[0].phone || '',
          notes: data[0].notes || '',
          totalAppointments: 0,
          status: "active" as const,
          totalSpent: 0
        };
        
        setClients([...clients, newClient]);
        setIsAddClientOpen(false);
        toast.success(`${newClient.name} a été ajouté à votre base de clients.`);
      }
    } catch (error: any) {
      console.error("Erreur lors de l'ajout du client:", error);
      toast.error(`Échec de l'ajout du client: ${error.message}`);
    }
  };

  const handleEditClient = async (client: Client) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          first_name: client.first_name,
          last_name: client.last_name,
          email: client.email,
          phone: client.phone,
          notes: client.notes
        })
        .eq('id', client.id);
      
      if (error) throw error;
      
      const updatedClients = clients.map((c) =>
        c.id === client.id ? {...client, name: `${client.first_name} ${client.last_name}`} : c
      );
      
      setClients(updatedClients);
      setIsViewClientOpen(false);
      setSelectedClient(null);
      setIsEditMode(false);
      toast.success(`Les informations de ${client.first_name} ${client.last_name} ont été mises à jour.`);
    } catch (error: any) {
      console.error("Erreur lors de la modification du client:", error);
      toast.error(`Échec de la modification du client: ${error.message}`);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);
      
      if (error) throw error;
      
      const updatedClients = clients.filter((c) => c.id !== clientId);
      setClients(updatedClients);
      setIsViewClientOpen(false);
      setSelectedClient(null);
      toast.success("Le client a été supprimé de votre base de données.");
    } catch (error: any) {
      console.error("Erreur lors de la suppression du client:", error);
      toast.error(`Échec de la suppression du client: ${error.message}`);
    }
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
            {loading ? "Chargement..." : `${filteredClients.length} clients enregistrés`}
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
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Chargement des clients...</span>
            </div>
          ) : (
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
                                {client.first_name?.[0]}{client.last_name?.[0]}
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
                          {client.totalAppointments || 0}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {client.lastVisit 
                            ? new Date(client.lastVisit).toLocaleDateString("fr-FR") 
                            : "-"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-right">
                          {(client.totalSpent || 0).toLocaleString("fr-FR")} €
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
          )}
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
