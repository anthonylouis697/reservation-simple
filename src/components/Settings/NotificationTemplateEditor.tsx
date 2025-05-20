
import React, { useState } from "react";
import { NotificationTemplate, Service, AppointmentStatus, NotificationChannel } from "@/types/service";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Info, Mail, MessageSquare, Plus, Trash } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface NotificationTemplateEditorProps {
  template?: NotificationTemplate;
  services?: Service[];
  onSave: (template: NotificationTemplate) => void;
  onCancel: () => void;
}

const defaultTemplate: NotificationTemplate = {
  id: crypto.randomUUID(),
  name: "Nouvelle notification",
  subject: "%service_name% - Confirmation de rendez-vous",
  body: "Bonjour %customer_first_name%,\n\nVotre rendez-vous pour %service_name% a été confirmé pour le %appointment_date% à %appointment_time%.\n\nÀ bientôt,\nL'équipe",
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
};

const formSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  subject: z.string().min(1, { message: "L'objet est requis" }),
  body: z.string().min(1, { message: "Le corps du message est requis" }),
  isActive: z.boolean(),
  recipientType: z.enum(["client", "employee", "admin"]),
  notificationType: z.enum([
    "appointment_created", 
    "appointment_updated", 
    "appointment_cancelled", 
    "appointment_status_changed", 
    "appointment_reminder"
  ]),
  triggerType: z.enum(["immediate", "scheduled"]),
  scheduledTime: z.number().optional(),
  scheduledTimeUnit: z.enum(["minutes", "hours", "days"]).optional(),
  scheduledTimeRelative: z.enum(["before", "after"]).optional(),
  appointmentStatus: z.array(z.string()),
  services: z.array(z.string()),
  sendOnlyThis: z.boolean(),
});

const availablePlaceholders = [
  { name: "%customer_first_name%", description: "Prénom du client" },
  { name: "%customer_last_name%", description: "Nom du client" },
  { name: "%customer_full_name%", description: "Nom complet du client" },
  { name: "%customer_phone%", description: "Numéro de téléphone du client" },
  { name: "%customer_email%", description: "Email du client" },
  { name: "%service_name%", description: "Nom du service" },
  { name: "%service_price%", description: "Prix du service" },
  { name: "%service_duration%", description: "Durée du service" },
  { name: "%appointment_date%", description: "Date du rendez-vous" },
  { name: "%appointment_time%", description: "Heure du rendez-vous" },
  { name: "%appointment_status%", description: "Statut du rendez-vous" },
  { name: "%employee_name%", description: "Nom de l'employé" },
  { name: "%company_name%", description: "Nom de l'entreprise" },
  { name: "%location_name%", description: "Nom du lieu" },
  { name: "%location_address%", description: "Adresse du lieu" },
  { name: "%zoom_link%", description: "Lien de la réunion Zoom" },
];

export const NotificationTemplateEditor: React.FC<NotificationTemplateEditorProps> = ({
  template,
  services = [],
  onSave,
  onCancel,
}) => {
  const [editorMode, setEditorMode] = useState<"visual" | "html">("visual");
  const [selectedChannel, setSelectedChannel] = useState<NotificationChannel>(template?.channel || "email");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: template
      ? {
          name: template.name,
          subject: template.subject,
          body: template.body,
          isActive: template.isActive,
          recipientType: template.recipientType,
          notificationType: template.notificationType,
          triggerType: template.triggerType,
          scheduledTime: template.scheduledTime,
          scheduledTimeUnit: template.scheduledTimeUnit,
          scheduledTimeRelative: template.scheduledTimeRelative,
          appointmentStatus: template.appointmentStatus as string[],
          services: template.services || [],
          sendOnlyThis: template.sendOnlyThis,
        }
      : {
          name: defaultTemplate.name,
          subject: defaultTemplate.subject,
          body: defaultTemplate.body,
          isActive: defaultTemplate.isActive,
          recipientType: defaultTemplate.recipientType,
          notificationType: defaultTemplate.notificationType,
          triggerType: defaultTemplate.triggerType,
          appointmentStatus: defaultTemplate.appointmentStatus as string[],
          services: [],
          sendOnlyThis: defaultTemplate.sendOnlyThis,
        },
  });

  const triggerType = form.watch("triggerType");
  const recipientType = form.watch("recipientType");

  const insertPlaceholder = (placeholder: string) => {
    const bodyField = form.getValues("body");
    const cursorPosition = document.getElementById("message-body")?.selectionStart || bodyField.length;
    const updatedBody = bodyField.substring(0, cursorPosition) + placeholder + bodyField.substring(cursorPosition);
    form.setValue("body", updatedBody);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const updatedTemplate: NotificationTemplate = {
      id: template?.id || crypto.randomUUID(),
      ...values,
      channel: selectedChannel,
      createdAt: template?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    onSave(updatedTemplate);
    toast.success("Modèle de notification enregistré");
  };

  const statusOptions: { label: string; value: AppointmentStatus }[] = [
    { label: "Approuvé", value: "approved" },
    { label: "En attente", value: "pending" },
    { label: "Annulé", value: "cancelled" },
    { label: "Rejeté", value: "rejected" },
    { label: "Reprogrammé", value: "rescheduled" },
    { label: "Terminé", value: "completed" },
  ];

  return (
    <div className="notification-template-editor space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onCancel} className="flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold">
          {template ? "Modifier une notification" : "Créer une notification"}
        </h2>
        <div className="w-[100px]"></div> {/* Spacer */}
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_300px]">
            <div className="space-y-6">
              {/* Base Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations générales</CardTitle>
                  <CardDescription>
                    Configurez les informations de base de cette notification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de la notification</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: Confirmation de rendez-vous" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-md border p-4">
                        <div>
                          <FormLabel className="text-base">Notification active</FormLabel>
                          <FormDescription>Activez ou désactivez cette notification</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Channel Selector */}
              <Card>
                <CardHeader>
                  <CardTitle>Canal de notification</CardTitle>
                  <CardDescription>
                    Choisissez le canal par lequel la notification sera envoyée
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={selectedChannel} onValueChange={(v) => setSelectedChannel(v as NotificationChannel)} className="w-full">
                    <TabsList className="grid grid-cols-3">
                      <TabsTrigger value="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </TabsTrigger>
                      <TabsTrigger value="sms" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        SMS
                      </TabsTrigger>
                      <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        WhatsApp
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Recipients and Triggers */}
              <Card>
                <CardHeader>
                  <CardTitle>Destinataires et déclencheurs</CardTitle>
                  <CardDescription>
                    Définissez quand et à qui envoyer cette notification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="recipientType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destinataires</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col md:flex-row gap-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="client" />
                              </FormControl>
                              <FormLabel className="font-normal">Clients</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="employee" />
                              </FormControl>
                              <FormLabel className="font-normal">Employés</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="admin" />
                              </FormControl>
                              <FormLabel className="font-normal">Administrateur</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notificationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de notification</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="appointment_created">Rendez-vous créé</SelectItem>
                              <SelectItem value="appointment_updated">Rendez-vous modifié</SelectItem>
                              <SelectItem value="appointment_cancelled">Rendez-vous annulé</SelectItem>
                              <SelectItem value="appointment_status_changed">Statut de rendez-vous modifié</SelectItem>
                              <SelectItem value="appointment_reminder">Rappel de rendez-vous</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="triggerType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Déclencheur</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col md:flex-row gap-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="immediate" />
                              </FormControl>
                              <FormLabel className="font-normal">Immédiat</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="scheduled" />
                              </FormControl>
                              <FormLabel className="font-normal">Programmé</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {triggerType === "scheduled" && (
                    <div className="grid grid-cols-3 gap-4 p-4 border rounded-md bg-accent/10">
                      <FormField
                        control={form.control}
                        name="scheduledTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Temps</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="1"
                                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="scheduledTimeUnit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unité</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Unité" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="minutes">Minutes</SelectItem>
                                  <SelectItem value="hours">Heures</SelectItem>
                                  <SelectItem value="days">Jours</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="scheduledTimeRelative"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Relatif" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="before">Avant</SelectItem>
                                  <SelectItem value="after">Après</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Message Content */}
              <Card>
                <CardHeader className="space-y-1">
                  <div className="flex justify-between items-center">
                    <CardTitle>Contenu de la notification</CardTitle>
                    {selectedChannel === "email" && (
                      <div className="flex items-center space-x-2">
                        <Label>Mode:</Label>
                        <div className="flex rounded-md overflow-hidden border">
                          <Button
                            type="button"
                            variant={editorMode === "visual" ? "default" : "ghost"}
                            size="sm"
                            className="rounded-none"
                            onClick={() => setEditorMode("visual")}
                          >
                            Visuel
                          </Button>
                          <Button
                            type="button"
                            variant={editorMode === "html" ? "default" : "ghost"}
                            size="sm"
                            className="rounded-none"
                            onClick={() => setEditorMode("html")}
                          >
                            HTML
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <CardDescription>
                    Personnalisez le contenu qui sera envoyé
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedChannel === "email" && (
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Objet du message</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Objet du message" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="body"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Corps du message</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Textarea
                              id="message-body"
                              {...field}
                              className={cn(
                                "min-h-[200px] font-mono",
                                editorMode === "html" ? "font-mono text-xs" : ""
                              )}
                              placeholder={selectedChannel === "sms" ? "Votre message (court)" : "Corps du message"}
                            />
                          </FormControl>
                          {selectedChannel === "sms" && (
                            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                              {field.value?.length || 0} / 160 caractères
                            </div>
                          )}
                        </div>
                        <FormDescription>
                          Utilisez les placeholders pour personnaliser votre message
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Filtres</CardTitle>
                  <CardDescription>
                    Limitez cette notification à des services ou statuts spécifiques
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="appointmentStatus"
                    render={() => (
                      <FormItem>
                        <FormLabel>Statuts de rendez-vous</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {statusOptions.map((status) => (
                            <FormField
                              key={status.value}
                              control={form.control}
                              name="appointmentStatus"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={status.value}
                                    className="flex flex-row items-center space-x-1 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(status.value)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, status.value])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== status.value
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {status.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="services"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Services concernés</FormLabel>
                        <FormDescription>
                          Si aucun service n'est sélectionné, la notification s'applique à tous les services
                        </FormDescription>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {services.map((service) => (
                            <FormField
                              key={service.id}
                              control={form.control}
                              name="services"
                              render={({ field: serviceField }) => {
                                return (
                                  <FormItem
                                    key={service.id}
                                    className="flex items-center space-x-2 space-y-0 rounded-md border p-3"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={serviceField.value?.includes(service.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? serviceField.onChange([...serviceField.value, service.id])
                                            : serviceField.onChange(
                                                serviceField.value?.filter(
                                                  (value) => value !== service.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {service.name}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sendOnlyThis"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-md border p-4 mt-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Notification exclusive</FormLabel>
                          <FormDescription>
                            Si activé, seule cette notification sera envoyée (aucune notification par défaut)
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Placeholders Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-muted-foreground" />
                    Placeholders disponibles
                  </CardTitle>
                  <CardDescription>
                    Utilisez ces codes dans votre message pour ajouter des informations dynamiques
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-2">
                      {availablePlaceholders.map((placeholder) => (
                        <div
                          key={placeholder.name}
                          className="border rounded-md p-2 cursor-pointer hover:bg-accent/50"
                          onClick={() => insertPlaceholder(placeholder.name)}
                        >
                          <p className="font-mono text-sm">{placeholder.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {placeholder.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground">
                    Cliquez sur un placeholder pour l'insérer dans votre message
                  </p>
                </CardFooter>
              </Card>

              {/* Help Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Aide</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-2">
                  <p>
                    <strong>Notifications immédiates</strong>: Envoyées dès qu'un événement spécifique se produit.
                  </p>
                  <p>
                    <strong>Notifications programmées</strong>: Envoyées avant ou après le rendez-vous à un moment précis.
                  </p>
                  <p>
                    <strong>Mode HTML</strong>: Permet d'ajouter du formatage avancé pour les emails.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NotificationTemplateEditor;
