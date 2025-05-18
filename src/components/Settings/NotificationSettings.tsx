
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

const notificationFormSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
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
  const form = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
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
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Configurer comment et quand vous et vos clients recevez des notifications.
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
                          Recevoir des emails concernant les nouveautés et conseils BookWise.
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

                {form.watch("smsNotifications") && (
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro de téléphone pour SMS</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="+33 6 12 34 56 78" />
                        </FormControl>
                        <FormDescription>
                          Numéro où seront envoyés les SMS de notification.
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
  );
};

export default NotificationSettings;
