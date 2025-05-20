
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Mail, MessageSquare } from "lucide-react";
import NotificationTemplates from "./NotificationTemplates";

const notificationFormSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  whatsAppNotifications: z.boolean(),
  bookingConfirmation: z.boolean(),
  bookingReminder: z.boolean(),
  reminderTime: z.string(),
  cancelledBooking: z.boolean(),
  changedBooking: z.boolean(),
  marketingEmails: z.boolean(),
  adminEmail: z.string().email({ message: "Email invalide" }).optional().or(z.literal("")),
  phoneNumber: z.string().optional(),
});

const NotificationSettings = () => {
  const [activeTab, setActiveTab] = useState("general");

  const form = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      whatsAppNotifications: false,
      bookingConfirmation: true,
      bookingReminder: true,
      reminderTime: "24",
      cancelledBooking: true,
      changedBooking: true,
      marketingEmails: false,
      adminEmail: "admin@bookwise.com",
      phoneNumber: "+33612345678",
    },
  });

  function onSubmit(values: z.infer<typeof notificationFormSchema>) {
    console.log(values);
    toast.success("Paramètres de notification enregistrés");
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
          <TabsTrigger value="providers">Fournisseurs</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configurez comment et quand vous et vos clients recevez des notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Canaux de notification</h3>
                    
                    <div className="grid gap-6">
                      <FormField
                        control={form.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-x-2 rounded-md border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Notifications par email</FormLabel>
                              <FormDescription>
                                Recevoir les notifications de réservation par email.
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

                      <FormField
                        control={form.control}
                        name="smsNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-x-2 rounded-md border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Notifications par SMS</FormLabel>
                              <FormDescription>
                                Recevoir les notifications de réservation par SMS.
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

                      <FormField
                        control={form.control}
                        name="whatsAppNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-x-2 rounded-md border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Notifications par WhatsApp</FormLabel>
                              <FormDescription>
                                Recevoir les notifications de réservation par WhatsApp.
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
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Types de notifications</h3>
                    
                    <div className="grid gap-6">
                      <FormField
                        control={form.control}
                        name="bookingConfirmation"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-x-2 rounded-md border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Confirmation de réservation</FormLabel>
                              <FormDescription>
                                Envoyer une notification quand une réservation est confirmée.
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

                      <FormField
                        control={form.control}
                        name="bookingReminder"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-x-2 rounded-md border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Rappel de rendez-vous</FormLabel>
                              <FormDescription>
                                Envoyer un rappel avant un rendez-vous prévu.
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

                      {form.watch("bookingReminder") && (
                        <FormField
                          control={form.control}
                          name="reminderTime"
                          render={({ field }) => (
                            <FormItem className="ml-6">
                              <FormLabel>Quand envoyer le rappel?</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez quand envoyer le rappel" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 heure avant</SelectItem>
                                  <SelectItem value="2">2 heures avant</SelectItem>
                                  <SelectItem value="24">24 heures avant</SelectItem>
                                  <SelectItem value="48">2 jours avant</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="cancelledBooking"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-x-2 rounded-md border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Réservation annulée</FormLabel>
                              <FormDescription>
                                Recevoir une notification quand une réservation est annulée.
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

                      <FormField
                        control={form.control}
                        name="changedBooking"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-x-2 rounded-md border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Réservation modifiée</FormLabel>
                              <FormDescription>
                                Recevoir une notification quand une réservation est modifiée.
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

                      <FormField
                        control={form.control}
                        name="marketingEmails"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-x-2 rounded-md border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Emails marketing</FormLabel>
                              <FormDescription>
                                Recevoir des emails concernant les nouveautés et conseils Reservatoo.
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
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Informations de contact</h3>
                    
                    <div className="grid gap-6">
                      <FormField
                        control={form.control}
                        name="adminEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email pour les notifications admin</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="admin@votreentreprise.com" />
                            </FormControl>
                            <FormDescription>
                              Email où seront envoyées les notifications administratives.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {(form.watch("smsNotifications") || form.watch("whatsAppNotifications")) && (
                        <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Numéro de téléphone pour notifications</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="+33 6 12 34 56 78" />
                              </FormControl>
                              <FormDescription>
                                Numéro où seront envoyés les SMS et messages WhatsApp.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>

                  <Button type="submit">Enregistrer les modifications</Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aperçu des notifications</CardTitle>
              <CardDescription>
                Aperçu des différents canaux de notification configurés
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground">{form.watch("emailNotifications") ? "Actif" : "Inactif"}</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {form.watch("emailNotifications") ? (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Confirmation de réservation</li>
                      {form.watch("bookingReminder") && <li>Rappel de rendez-vous</li>}
                      {form.watch("changedBooking") && <li>Modifications de rendez-vous</li>}
                      {form.watch("cancelledBooking") && <li>Annulations de rendez-vous</li>}
                    </ul>
                  ) : (
                    <p>Les notifications par email sont désactivées</p>
                  )}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">SMS</h3>
                    <p className="text-sm text-muted-foreground">{form.watch("smsNotifications") ? "Actif" : "Inactif"}</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {form.watch("smsNotifications") ? (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Confirmation de réservation</li>
                      {form.watch("bookingReminder") && <li>Rappel de rendez-vous</li>}
                      {form.watch("changedBooking") && <li>Modifications de rendez-vous</li>}
                      {form.watch("cancelledBooking") && <li>Annulations de rendez-vous</li>}
                    </ul>
                  ) : (
                    <p>Les notifications par SMS sont désactivées</p>
                  )}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">{form.watch("whatsAppNotifications") ? "Actif" : "Inactif"}</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {form.watch("whatsAppNotifications") ? (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Confirmation de réservation</li>
                      {form.watch("bookingReminder") && <li>Rappel de rendez-vous</li>}
                      {form.watch("changedBooking") && <li>Modifications de rendez-vous</li>}
                      {form.watch("cancelledBooking") && <li>Annulations de rendez-vous</li>}
                    </ul>
                  ) : (
                    <p>Les notifications par WhatsApp sont désactivées</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <NotificationTemplates />
        </TabsContent>

        <TabsContent value="providers" className="mt-6">
          <div className="grid gap-6 grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Configuration des fournisseurs</CardTitle>
                <CardDescription>
                  Configurez les services tiers pour l'envoi de notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-md p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Email SMTP</h3>
                        <p className="text-sm text-muted-foreground">Configuration du serveur d'envoi d'emails</p>
                      </div>
                    </div>
                    <Button variant="outline">Configurer</Button>
                  </div>
                </div>

                <div className="border rounded-md p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">SMS (Twilio)</h3>
                        <p className="text-sm text-muted-foreground">Configuration de l'envoi de SMS</p>
                      </div>
                    </div>
                    <Button variant="outline">Configurer</Button>
                  </div>
                </div>

                <div className="border rounded-md p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">WhatsApp Business API</h3>
                        <p className="text-sm text-muted-foreground">Configuration de l'envoi de messages WhatsApp</p>
                      </div>
                    </div>
                    <Button variant="outline">Configurer</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationSettings;
