
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const businessFormSchema = z.object({
  businessName: z.string().min(1, {
    message: "Le nom de l'entreprise est requis.",
  }),
  businessType: z.string().min(1, {
    message: "Le type d'entreprise est requis.",
  }),
  address: z.string().min(1, {
    message: "L'adresse est requise.",
  }),
  city: z.string().min(1, {
    message: "La ville est requise.",
  }),
  postalCode: z.string().min(1, {
    message: "Le code postal est requis.",
  }),
  country: z.string().min(1, {
    message: "Le pays est requis.",
  }),
  website: z.string().url({ message: "URL du site Web invalide" }).optional().or(z.literal("")),
  description: z.string().max(500).optional(),
});

const BusinessSettings = () => {
  const form = useForm<z.infer<typeof businessFormSchema>>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      businessName: "BookWise Salon",
      businessType: "beauty",
      address: "123 Rue de Paris",
      city: "Paris",
      postalCode: "75001",
      country: "France",
      website: "https://bookwise-salon.com",
      description: "Salon de beauté proposant divers services.",
    },
  });

  function onSubmit(values: z.infer<typeof businessFormSchema>) {
    console.log(values);
    toast.success("Informations de l'entreprise mises à jour avec succès");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations de l'entreprise</CardTitle>
        <CardDescription>
          Configurez les détails de votre entreprise qui apparaîtront sur votre page de réservation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'entreprise</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de votre entreprise" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d'entreprise</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type d'entreprise" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beauty">Salon de beauté</SelectItem>
                        <SelectItem value="health">Santé et bien-être</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="education">Éducation</SelectItem>
                        <SelectItem value="consultancy">Conseil</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input placeholder="Adresse" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input placeholder="Ville" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code postal</FormLabel>
                    <FormControl>
                      <Input placeholder="Code postal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un pays" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Belgique">Belgique</SelectItem>
                        <SelectItem value="Suisse">Suisse</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Luxembourg">Luxembourg</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Web</FormLabel>
                    <FormControl>
                      <Input placeholder="https://votre-site.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optionnel. Votre site Web sera affiché sur votre page de réservation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description de l'entreprise</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez brièvement votre entreprise et vos services..."
                      className="min-h-32 resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Cette description sera affichée sur votre page de réservation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Enregistrer les modifications</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BusinessSettings;
