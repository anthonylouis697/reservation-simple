
import { useState } from "react";
import AccountLayout from "@/components/Account/AccountLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { CheckCircle, XCircle, UserPlus, Mail, Trash2, ShieldCheck, ShieldX } from "lucide-react";

// Type for team members
type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  status: "active" | "pending" | "inactive";
  avatarUrl?: string;
};

// Validation schema for inviting new members
const inviteFormSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  role: z.enum(["admin", "member"], {
    required_error: "Veuillez sélectionner un rôle",
  }),
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

export default function TeamPage() {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  
  // Mock team members data - in a real app this would come from API
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Thomas Martin",
      email: "thomas@example.com",
      role: "owner",
      status: "active",
      avatarUrl: "https://i.pravatar.cc/100?img=32"
    },
    {
      id: "2",
      name: "Marie Durand",
      email: "marie@example.com",
      role: "admin",
      status: "active",
      avatarUrl: "https://i.pravatar.cc/100?img=25"
    },
    {
      id: "3",
      name: "Jean Dupont",
      email: "jean@example.com",
      role: "member",
      status: "active",
      avatarUrl: "https://i.pravatar.cc/100?img=12"
    },
    {
      id: "4",
      name: "Sophie Bernard",
      email: "sophie@example.com",
      role: "member",
      status: "pending",
    }
  ]);
  
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });
  
  // Handle invite submission
  const onSubmit = (values: InviteFormValues) => {
    // In a real app, this would call an API to send invitations
    const newMember: TeamMember = {
      id: `${teamMembers.length + 1}`,
      name: values.email.split('@')[0],
      email: values.email,
      role: values.role,
      status: "pending"
    };
    
    setTeamMembers([...teamMembers, newMember]);
    setIsInviteDialogOpen(false);
    form.reset();
    
    toast({
      title: "Invitation envoyée",
      description: `Un email d'invitation a été envoyé à ${values.email}`,
    });
  };
  
  // Handle member removal
  const removeMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
    toast({
      title: "Membre retiré",
      description: "Le membre a été retiré de votre équipe",
    });
  };
  
  // Handle role change
  const changeRole = (memberId: string, newRole: "admin" | "member") => {
    setTeamMembers(
      teamMembers.map(member => 
        member.id === memberId ? { ...member, role: newRole } : member
      )
    );
    toast({
      title: "Rôle mis à jour",
      description: "Le rôle du membre a été mis à jour",
    });
  };
  
  return (
    <AccountLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Gestion de l'équipe</CardTitle>
              <CardDescription>
                Invitez et gérez les membres de votre équipe qui auront accès à votre compte.
              </CardDescription>
            </div>
            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Inviter un membre
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Inviter un nouveau membre</DialogTitle>
                  <DialogDescription>
                    Envoyez une invitation par email pour ajouter quelqu'un à votre équipe.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rôle</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez un rôle" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="admin">
                                <div className="flex items-center">
                                  <ShieldCheck className="h-4 w-4 mr-2 text-amber-500" />
                                  <span>Admin - Accès complet</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="member">
                                <div className="flex items-center">
                                  <ShieldX className="h-4 w-4 mr-2 text-blue-500" />
                                  <span>Membre - Accès limité</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>Annuler</Button>
                      <Button type="submit">Envoyer l'invitation</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Membre</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          {member.avatarUrl ? (
                            <AvatarImage src={member.avatarUrl} />
                          ) : (
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {member.role === "owner" ? (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">Propriétaire</Badge>
                      ) : member.role === "admin" ? (
                        <Select
                          defaultValue={member.role}
                          onValueChange={(value: "admin" | "member") => changeRole(member.id, value)}
                          disabled={member.status === "pending"}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">
                              <div className="flex items-center">
                                <ShieldCheck className="h-4 w-4 mr-2 text-amber-500" />
                                <span>Admin</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="member">
                              <div className="flex items-center">
                                <ShieldX className="h-4 w-4 mr-2 text-blue-500" />
                                <span>Membre</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Select
                          defaultValue={member.role}
                          onValueChange={(value: "admin" | "member") => changeRole(member.id, value)}
                          disabled={member.status === "pending"}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">
                              <div className="flex items-center">
                                <ShieldCheck className="h-4 w-4 mr-2 text-amber-500" />
                                <span>Admin</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="member">
                              <div className="flex items-center">
                                <ShieldX className="h-4 w-4 mr-2 text-blue-500" />
                                <span>Membre</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>
                      {member.status === "active" ? (
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
                          <span>Actif</span>
                        </div>
                      ) : member.status === "pending" ? (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-amber-500 mr-1.5" />
                          <span>En attente</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <XCircle className="h-4 w-4 text-red-500 mr-1.5" />
                          <span>Inactif</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        {member.status === "pending" && (
                          <Button variant="ghost" size="sm" onClick={() => {
                            const email = navigator.clipboard.writeText(`${window.location.origin}/invitation?code=ABC123`);
                            toast({
                              title: "Lien d'invitation copié",
                              description: "Le lien a été copié dans votre presse-papiers",
                            });
                          }}>
                            Copier le lien
                          </Button>
                        )}
                        {member.role !== "owner" && (
                          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => removeMember(member.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Retirer</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Votre plan actuel vous permet d'avoir jusqu'à 5 membres d'équipe. 
              <Button variant="link" className="p-0 h-auto text-sm" onClick={() => window.location.href = '/account/billing'}>
                Mettre à niveau
              </Button>
            </p>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Rôles et permissions</CardTitle>
            <CardDescription>
              Comprendre les différents niveaux d'accès et permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-2 rounded-md">
                  <ShieldCheck className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">Propriétaire</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Accès complet à toutes les fonctionnalités, paramètres de facturation et gestion des membres de l'équipe.
                    Seule personne à pouvoir supprimer le compte.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-amber-100 p-2 rounded-md">
                  <ShieldCheck className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium">Administrateur</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Peut gérer les rendez-vous, les clients, les services et les membres de l'équipe. 
                    Ne peut pas modifier les paramètres de facturation ou supprimer le compte.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-2 rounded-md">
                  <ShieldX className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Membre</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Peut gérer uniquement ses propres rendez-vous et voir les clients. 
                    Ne peut pas modifier les paramètres du compte ou ajouter d'autres membres.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AccountLayout>
  );
}
