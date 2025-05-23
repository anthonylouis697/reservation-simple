import React, { useState } from "react";
import { NotificationTemplate, NotificationChannel, Service } from "@/types/service";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, PlusCircle, Search, Settings, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label"; // Added Label import
import NotificationTemplateEditor from "./NotificationTemplateEditor";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Sample data for demonstration
const sampleTemplates: NotificationTemplate[] = [
  {
    id: "1",
    name: "Confirmation de réservation",
    subject: "%service_name% - Confirmation de votre rendez-vous",
    body: "Bonjour %customer_first_name%,\n\nVotre rendez-vous pour %service_name% a été confirmé pour le %appointment_date% à %appointment_time%.\n\nNous avons hâte de vous accueillir.\n\nCordialement,\nL'équipe",
    isActive: true,
    recipientType: "client",
    notificationType: "appointment_created",
    triggerType: "immediate",
    appointmentStatus: ["approved"],
    services: [],
    sendOnlyThis: false,
    channel: "email",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Rappel de rendez-vous (24h avant)",
    subject: "Rappel: votre rendez-vous demain",
    body: "Bonjour %customer_first_name%,\n\nNous vous rappelons votre rendez-vous pour %service_name% demain à %appointment_time%.\n\nCordialement,\nL'équipe",
    isActive: true,
    recipientType: "client",
    notificationType: "appointment_reminder",
    triggerType: "scheduled",
    scheduledTime: 24,
    scheduledTimeUnit: "hours",
    scheduledTimeRelative: "before",
    appointmentStatus: ["approved"],
    services: [],
    sendOnlyThis: false,
    channel: "email",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Notification SMS de confirmation",
    subject: "",
    body: "Votre RDV pour %service_name% est confirmé le %appointment_date% à %appointment_time%. Pour annuler ou modifier: +33123456789",
    isActive: true,
    recipientType: "client",
    notificationType: "appointment_created",
    triggerType: "immediate",
    appointmentStatus: ["approved"],
    services: [],
    sendOnlyThis: false,
    channel: "sms",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Notification de rendez-vous annulé",
    subject: "Votre rendez-vous a été annulé",
    body: "Bonjour %customer_first_name%,\n\nVotre rendez-vous pour %service_name% prévu le %appointment_date% à %appointment_time% a été annulé.\n\nCordialement,\nL'équipe",
    isActive: true,
    recipientType: "client",
    notificationType: "appointment_cancelled",
    triggerType: "immediate",
    appointmentStatus: ["cancelled"],
    services: [],
    sendOnlyThis: false,
    channel: "email",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Sample services for demonstration
const sampleServices: Service[] = [
  {
    id: "1",
    name: "Consultation",
    description: "Consultation initiale",
    duration: 30,
    price: 50,
    capacity: 1,
    bufferTimeBefore: 5,
    bufferTimeAfter: 5,
    isActive: true,
  },
  {
    id: "2",
    name: "Traitement",
    description: "Traitement complet",
    duration: 60,
    price: 100,
    capacity: 1,
    bufferTimeBefore: 10,
    bufferTimeAfter: 10,
    isActive: true,
  },
];

interface NotificationTemplatesProps {
  initialTemplates?: NotificationTemplate[];
  services?: Service[];
  onSave?: (templates: NotificationTemplate[]) => void;
}

export const NotificationTemplates: React.FC<NotificationTemplatesProps> = ({
  initialTemplates = sampleTemplates,
  services = sampleServices,
  onSave,
}) => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>(initialTemplates);
  const [activeTab, setActiveTab] = useState<NotificationChannel>("email");
  const [recipientFilter, setRecipientFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const filteredTemplates = templates.filter((template) => {
    // Filter by channel
    const channelMatch = template.channel === activeTab;
    
    // Filter by recipient
    const recipientMatch = recipientFilter === "all" || template.recipientType === recipientFilter;
    
    // Filter by search term
    const searchMatch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       template.body.toLowerCase().includes(searchTerm.toLowerCase());
    
    return channelMatch && recipientMatch && searchMatch;
  });

  const handleSaveTemplate = (template: NotificationTemplate) => {
    let updatedTemplates: NotificationTemplate[];
    
    if (templates.some(t => t.id === template.id)) {
      // Update existing template
      updatedTemplates = templates.map(t => 
        t.id === template.id ? template : t
      );
    } else {
      // Add new template
      updatedTemplates = [...templates, template];
    }
    
    setTemplates(updatedTemplates);
    if (onSave) onSave(updatedTemplates);
    setEditingTemplate(null);
    setIsCreating(false);
    toast.success("Le modèle de notification a été enregistré avec succès");
  };

  const handleDeleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(updatedTemplates);
    if (onSave) onSave(updatedTemplates);
    toast.success("Le modèle de notification a été supprimé");
  };

  const handleToggleActive = (templateId: string) => {
    const updatedTemplates = templates.map(template => {
      if (template.id === templateId) {
        return {
          ...template,
          isActive: !template.isActive,
          updatedAt: new Date().toISOString(),
        };
      }
      return template;
    });
    
    setTemplates(updatedTemplates);
    if (onSave) onSave(updatedTemplates);
    toast.success("Le statut de la notification a été mis à jour");
  };

  const renderChannelIcon = (channel: NotificationChannel) => {
    switch (channel) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <MessageSquare className="h-4 w-4" />;
      case "whatsapp":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
    }
  };

  const getNotificationTypeName = (type: string) => {
    switch (type) {
      case "appointment_created":
        return "Création de rendez-vous";
      case "appointment_updated":
        return "Modification de rendez-vous";
      case "appointment_cancelled":
        return "Annulation de rendez-vous";
      case "appointment_status_changed":
        return "Changement de statut";
      case "appointment_reminder":
        return "Rappel de rendez-vous";
      default:
        return type;
    }
  };

  const getRecipientTypeName = (type: string) => {
    switch (type) {
      case "client":
        return "Clients";
      case "employee":
        return "Employés";
      case "admin":
        return "Admin";
      default:
        return type;
    }
  };

  if (editingTemplate || isCreating) {
    return (
      <NotificationTemplateEditor
        template={isCreating ? undefined : editingTemplate}
        services={services}
        onSave={handleSaveTemplate}
        onCancel={() => {
          setEditingTemplate(null);
          setIsCreating(false);
        }}
      />
    );
  }

  return (
    <div className="notification-templates space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Modèles de notification</h1>
        <Button onClick={() => setIsCreating(true)} className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Nouveau modèle
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as NotificationChannel)}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
            <Badge variant="secondary" className="ml-1">
              {templates.filter(t => t.channel === "email").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            SMS
            <Badge variant="secondary" className="ml-1">
              {templates.filter(t => t.channel === "sms").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            WhatsApp
            <Badge variant="secondary" className="ml-1">
              {templates.filter(t => t.channel === "whatsapp").length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {["email", "sms", "whatsapp"].map((channel) => (
          <TabsContent key={channel} value={channel} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Modèles {channel === "email" ? "d'emails" : channel === "sms" ? "SMS" : "WhatsApp"}</CardTitle>
                <CardDescription>
                  Gérez vos modèles de notification {channel === "email" ? "par email" : channel === "sms" ? "par SMS" : "WhatsApp"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Rechercher un modèle..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={recipientFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRecipientFilter("all")}
                    >
                      Tous
                    </Button>
                    <Button
                      variant={recipientFilter === "client" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRecipientFilter("client")}
                    >
                      Clients
                    </Button>
                    <Button
                      variant={recipientFilter === "employee" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRecipientFilter("employee")}
                    >
                      Employés
                    </Button>
                    <Button
                      variant={recipientFilter === "admin" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRecipientFilter("admin")}
                    >
                      Admin
                    </Button>
                  </div>
                </div>

                <Separator />

                {filteredTemplates.length > 0 ? (
                  <div className="grid gap-4">
                    {filteredTemplates.map((template) => (
                      <div 
                        key={template.id} 
                        className={cn(
                          "border rounded-md overflow-hidden transition-all",
                          !template.isActive && "opacity-60"
                        )}
                      >
                        <div className="flex justify-between items-center p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              {renderChannelIcon(template.channel)}
                            </div>
                            <div>
                              <h3 className="font-medium">{template.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {getNotificationTypeName(template.notificationType)} • {getRecipientTypeName(template.recipientType)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {template.triggerType === "scheduled" && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                                Programmé
                              </Badge>
                            )}
                            {template.sendOnlyThis && (
                              <Badge variant="outline" className="bg-amber-50 text-amber-600 hover:bg-amber-100">
                                Notification exclusive
                              </Badge>
                            )}
                            {template.services && template.services.length > 0 && (
                              <Badge variant="outline" className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100">
                                Services spécifiques
                              </Badge>
                            )}
                            <Switch 
                              checked={template.isActive} 
                              onCheckedChange={() => handleToggleActive(template.id)} 
                            />
                            <Button size="sm" variant="outline" onClick={() => setEditingTemplate(template)}>
                              <Settings className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                                  <AlertCircle className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Cette action supprimera définitivement le modèle de notification "{template.name}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteTemplate(template.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                        <div className="bg-accent/20 px-4 py-3 border-t">
                          {template.channel === "email" ? (
                            <>
                              <p className="text-sm font-medium">Objet: {template.subject}</p>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {template.body.substring(0, 150)}{template.body.length > 150 ? "..." : ""}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {template.body.substring(0, 150)}{template.body.length > 150 ? "..." : ""}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center bg-accent/20 rounded-md">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      {renderChannelIcon(activeTab)}
                    </div>
                    <h3 className="font-medium text-lg">Aucun modèle trouvé</h3>
                    <p className="text-muted-foreground mt-1">
                      Aucun modèle ne correspond à votre recherche
                    </p>
                    <Button 
                      onClick={() => setIsCreating(true)} 
                      variant="default" 
                      className="mt-4"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Créer un modèle
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {activeTab === "email" && (
              <Card>
                <CardHeader>
                  <CardTitle>Configuration SMTP</CardTitle>
                  <CardDescription>
                    Configurez vos paramètres d'envoi d'email
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="smtp_host">Serveur SMTP</Label>
                      <Input id="smtp_host" placeholder="smtp.votredomaine.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp_port">Port</Label>
                      <Input id="smtp_port" placeholder="587" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp_user">Utilisateur</Label>
                      <Input id="smtp_user" placeholder="utilisateur@votredomaine.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp_pass">Mot de passe</Label>
                      <Input id="smtp_pass" type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="from_email">Email d'expédition</Label>
                      <Input id="from_email" placeholder="contact@votreentreprise.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="from_name">Nom d'expédition</Label>
                      <Input id="from_name" placeholder="Votre Entreprise" />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button>Enregistrer la configuration</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "sms" && (
              <Card>
                <CardHeader>
                  <CardTitle>Configuration SMS</CardTitle>
                  <CardDescription>
                    Configurez votre service d'envoi de SMS
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="sms_provider">Fournisseur SMS</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="twilio">Twilio</option>
                        <option value="vonage">Vonage (Nexmo)</option>
                        <option value="plivo">Plivo</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sms_api_key">Clé API</Label>
                      <Input id="sms_api_key" placeholder="Votre clé API" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sms_api_secret">Secret API</Label>
                      <Input id="sms_api_secret" placeholder="Votre secret API" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sms_from">Numéro d'expéditeur</Label>
                      <Input id="sms_from" placeholder="+33123456789" />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button>Enregistrer la configuration</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "whatsapp" && (
              <Card>
                <CardHeader>
                  <CardTitle>Configuration WhatsApp</CardTitle>
                  <CardDescription>
                    Configurez votre service d'envoi de messages WhatsApp
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="wa_provider">Fournisseur WhatsApp</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="twilio">Twilio</option>
                        <option value="meta">Meta WhatsApp Business API</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wa_api_key">Clé API</Label>
                      <Input id="wa_api_key" placeholder="Votre clé API" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wa_api_secret">Secret API</Label>
                      <Input id="wa_api_secret" placeholder="Votre secret API" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wa_phone_id">ID du téléphone / numéro</Label>
                      <Input id="wa_phone_id" placeholder="ID ou numéro WhatsApp" />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button>Enregistrer la configuration</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default NotificationTemplates;
