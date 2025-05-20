import React, { useState, useEffect, useRef } from "react";
import { NotificationTemplate, NotificationChannel, Service, AppointmentStatus } from "@/types/service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { v4 as uuidv4 } from "uuid";
import { Mail, MessageSquare, Clock, ChevronLeft } from "lucide-react";

interface NotificationTemplateEditorProps {
  template?: NotificationTemplate | null;
  services?: Service[];
  onSave: (template: NotificationTemplate) => void;
  onCancel: () => void;
}

const NotificationTemplateEditor: React.FC<NotificationTemplateEditorProps> = ({
  template,
  services = [],
  onSave,
  onCancel,
}) => {
  const isNewTemplate = !template;
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState<Partial<NotificationTemplate>>({
    name: template?.name || "",
    subject: template?.subject || "",
    body: template?.body || "",
    isActive: template?.isActive ?? true,
    recipientType: template?.recipientType || "client",
    notificationType: template?.notificationType || "appointment_created",
    triggerType: template?.triggerType || "immediate",
    scheduledTime: template?.scheduledTime || 24,
    scheduledTimeUnit: template?.scheduledTimeUnit || "hours",
    scheduledTimeRelative: template?.scheduledTimeRelative || "before",
    appointmentStatus: template?.appointmentStatus || ["approved"],
    services: template?.services || [],
    sendOnlyThis: template?.sendOnlyThis || false,
    channel: template?.channel || "email",
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // Ensure all required fields are filled
    if (!formData.name) {
      alert("Veuillez donner un nom au modèle");
      return;
    }

    if (formData.channel === "email" && !formData.subject) {
      alert("Veuillez définir un objet pour l'email");
      return;
    }

    if (!formData.body) {
      alert("Veuillez définir le contenu du message");
      return;
    }

    // Create the complete template
    const newTemplate: NotificationTemplate = {
      id: template?.id || uuidv4(),
      name: formData.name || "",
      subject: formData.subject || "",
      body: formData.body || "",
      isActive: formData.isActive ?? true,
      recipientType: formData.recipientType as "client" | "employee" | "admin",
      notificationType: formData.notificationType as NotificationTemplate["notificationType"],
      triggerType: formData.triggerType as "immediate" | "scheduled",
      scheduledTime: formData.scheduledTime || 24,
      scheduledTimeUnit: formData.scheduledTimeUnit as "minutes" | "hours" | "days" | undefined,
      scheduledTimeRelative: formData.scheduledTimeRelative as "before" | "after" | undefined,
      appointmentStatus: formData.appointmentStatus as AppointmentStatus[],
      services: formData.services || [],
      sendOnlyThis: formData.sendOnlyThis || false,
      channel: formData.channel as NotificationChannel,
      createdAt: template?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newTemplate);
  };

  const insertVariable = (variable: string) => {
    if (textareaRef.current) {
      const textArea = textareaRef.current;
      const start = textArea.selectionStart || 0;
      const end = textArea.selectionEnd || 0;
      const text = formData.body || "";
      const newText = text.substring(0, start) + variable + text.substring(end);
      
      setFormData((prev) => ({
        ...prev,
        body: newText,
      }));
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        textArea.focus();
        textArea.setSelectionRange(start + variable.length, start + variable.length);
      }, 10);
    }
  };

  const statusOptions: { value: AppointmentStatus; label: string }[] = [
    { value: "approved", label: "Approuvé" },
    { value: "pending", label: "En attente" },
    { value: "cancelled", label: "Annulé" },
    { value: "rejected", label: "Refusé" },
    { value: "rescheduled", label: "Reprogrammé" },
    { value: "completed", label: "Terminé" },
  ];

  const renderChannelIcon = () => {
    switch (formData.channel) {
      case "email":
        return <Mail className="h-5 w-5" />;
      case "sms":
        return <MessageSquare className="h-5 w-5" />;
      case "whatsapp":
        return <MessageSquare className="h-5 w-5 text-green-500" />;
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
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={onCancel} className="p-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-semibold">
          {isNewTemplate ? "Nouveau modèle" : "Modifier le modèle"}
        </h2>
      </div>
      
      <Card className="border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              {renderChannelIcon()}
            </div>
            <div>
              <CardTitle>{formData.name || "Nouveau modèle"}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                {getNotificationTypeName(formData.notificationType || "")}
                <span>•</span> 
                {formData.channel === "email" ? "Email" : formData.channel === "sms" ? "SMS" : "WhatsApp"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardContent className="border-b">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="content">Contenu</TabsTrigger>
              <TabsTrigger value="conditions">Conditions</TabsTrigger>
            </TabsList>
          </CardContent>
          
          <CardContent className="pt-6">
            <TabsContent value="general" className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du modèle</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Nom du modèle de notification"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="channel">Canal</Label>
                  <Select
                    value={formData.channel}
                    onValueChange={(value) => handleChange("channel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type de notification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="recipientType">Destinataire</Label>
                  <Select
                    value={formData.recipientType}
                    onValueChange={(value) => handleChange("recipientType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Destinataire" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Clients</SelectItem>
                      <SelectItem value="employee">Employés</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="notificationType">Type de notification</Label>
                  <Select
                    value={formData.notificationType}
                    onValueChange={(value) => handleChange("notificationType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type de notification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appointment_created">Création de rendez-vous</SelectItem>
                      <SelectItem value="appointment_updated">Modification de rendez-vous</SelectItem>
                      <SelectItem value="appointment_cancelled">Annulation de rendez-vous</SelectItem>
                      <SelectItem value="appointment_status_changed">Changement de statut</SelectItem>
                      <SelectItem value="appointment_reminder">Rappel de rendez-vous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="triggerType">Déclencheur</Label>
                  <Select
                    value={formData.triggerType}
                    onValueChange={(value) => handleChange("triggerType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Déclencheur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immédiat</SelectItem>
                      <SelectItem value="scheduled">Programmé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {formData.triggerType === "scheduled" && (
                <div className="grid grid-cols-3 gap-2 items-end">
                  <div>
                    <Label htmlFor="scheduledTime">Délai</Label>
                    <Input
                      id="scheduledTime"
                      type="number"
                      min="1"
                      value={formData.scheduledTime || 24}
                      onChange={(e) => handleChange("scheduledTime", parseInt(e.target.value, 10))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="scheduledTimeUnit">Unité</Label>
                    <Select
                      value={formData.scheduledTimeUnit || "hours"}
                      onValueChange={(value) => handleChange("scheduledTimeUnit", value)}
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
                  </div>
                  
                  <div>
                    <Label htmlFor="scheduledTimeRelative">Relatif à</Label>
                    <Select
                      value={formData.scheduledTimeRelative || "before"}
                      onValueChange={(value) => handleChange("scheduledTimeRelative", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Relatif à" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="before">Avant</SelectItem>
                        <SelectItem value="after">Après</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleChange("isActive", checked)}
                />
                <Label htmlFor="isActive">Activer ce modèle</Label>
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-4">
              {formData.channel === "email" && (
                <div>
                  <Label htmlFor="subject">Objet de l'email</Label>
                  <Input
                    id="subject"
                    value={formData.subject || ""}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    placeholder="Objet de l'email"
                  />
                </div>
              )}
              
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="body">Contenu du message</Label>
                  <div className="text-sm text-muted-foreground">
                    Variables disponibles
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => insertVariable("%customer_first_name%")}
                  >
                    %customer_first_name%
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => insertVariable("%customer_full_name%")}
                  >
                    %customer_full_name%
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => insertVariable("%service_name%")}
                  >
                    %service_name%
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => insertVariable("%appointment_date%")}
                  >
                    %appointment_date%
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => insertVariable("%appointment_time%")}
                  >
                    %appointment_time%
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => insertVariable("%employee_full_name%")}
                  >
                    %employee_full_name%
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => insertVariable("%location_address%")}
                  >
                    %location_address%
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => insertVariable("%price%")}
                  >
                    %price%
                  </Badge>
                </div>
                
                <Textarea
                  id="body"
                  value={formData.body || ""}
                  onChange={(e) => handleChange("body", e.target.value)}
                  placeholder="Contenu du message..."
                  className="min-h-[200px]"
                  ref={textareaRef}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="conditions" className="space-y-4">
              <div>
                <Label>Statut de rendez-vous</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {statusOptions.map((status) => (
                    <div key={status.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status.value}`}
                        checked={(formData.appointmentStatus || []).includes(status.value)}
                        onCheckedChange={(checked) => {
                          const currentStatuses = [...(formData.appointmentStatus || [])];
                          if (checked) {
                            if (!currentStatuses.includes(status.value)) {
                              handleChange("appointmentStatus", [...currentStatuses, status.value]);
                            }
                          } else {
                            handleChange(
                              "appointmentStatus",
                              currentStatuses.filter((s) => s !== status.value)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={`status-${status.value}`}>{status.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Services spécifiques</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`service-${service.id}`}
                        checked={(formData.services || []).includes(service.id)}
                        onCheckedChange={(checked) => {
                          const currentServices = [...(formData.services || [])];
                          if (checked) {
                            if (!currentServices.includes(service.id)) {
                              handleChange("services", [...currentServices, service.id]);
                            }
                          } else {
                            handleChange(
                              "services",
                              currentServices.filter((s) => s !== service.id)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={`service-${service.id}`}>{service.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="sendOnlyThis"
                  checked={formData.sendOnlyThis}
                  onCheckedChange={(checked) => handleChange("sendOnlyThis", checked)}
                />
                <Label htmlFor="sendOnlyThis">
                  Notification exclusive (n'enverra que ce modèle)
                </Label>
              </div>
            </TabsContent>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              {isNewTemplate ? "Créer le modèle" : "Enregistrer les modifications"}
            </Button>
          </CardFooter>
        </Tabs>
      </Card>
    </div>
  );
};

export default NotificationTemplateEditor;
