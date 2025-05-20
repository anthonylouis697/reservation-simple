
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
import { useBusiness } from "@/contexts/BusinessContext";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const businessFormSchema = z.object({
  businessName: z.string().min(1, {
    message: "Le nom de l'entreprise est requis.",
  }),
  businessType: z.string().min(1, {
    message: "Le type d'entreprise est requis.",
  }),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(1, {
    message: "Le pays est requis.",
  }),
  website: z.string().url({ message: "URL du site Web invalide" }).optional().or(z.literal("")),
  description: z.string().max(500).optional(),
  email: z.string().email({ message: "Format d'email invalide" }).optional().or(z.literal("")),
  phone: z.string().optional(),
});

type BusinessFormValues = z.infer<typeof businessFormSchema>;

const BusinessSettings = () => {
  const { currentBusiness, updateBusiness } = useBusiness();
  
  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      businessName: "",
      businessType: "beauty",
      address: "",
      city: "",
      postalCode: "",
      country: "France",
      website: "",
      description: "",
      email: "",
      phone: "",
    },
  });
  
  const { formState } = form;
  const { isSubmitting } = formState;

  // Mettre à jour le formulaire quand l'entreprise courante change
  useEffect(() => {
    if (currentBusiness) {
      form.reset({
        businessName: currentBusiness.name,
        businessType: "beauty", // À remplacer par une vraie colonne dans la BD
        address: currentBusiness.address || "",
        city: currentBusiness.city || "",
        postalCode: currentBusiness.postal_code || "",
        country: currentBusiness.country || "France",
        website: "", // À ajouter dans la BD
        description: currentBusiness.description || "",
        email: currentBusiness.email || "",
        phone: currentBusiness.phone || "",
      });
    }
  }, [currentBusiness, form]);

  async function onSubmit(values: BusinessFormValues) {
    if (!currentBusiness) {
      toast.error("Aucune entreprise sélectionnée");
      return;
    }
    
    try {
      const result = await updateBusiness(currentBusiness.id, {
        name: values.businessName,
        address: values.address || null,
        city: values.city || null,
        postal_code: values.postalCode || null,
        country: values.country,
        description: values.description || null,
        email: values.email || null,
        phone: values.phone || null,
      });
      
      if (result) {
        toast.success("Informations de l'entreprise mises à jour avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Une erreur est survenue lors de la mise à jour");
    }
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
        {!currentBusiness ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">
              Veuillez sélectionner ou créer une entreprise pour configurer ses informations.
            </p>
          </div>
        ) : (
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email professionnel</FormLabel>
                      <FormControl>
                        <Input placeholder="contact@votreentreprise.com" type="email" {...field} />
                      </FormControl>
                      <FormDescription>
                        Email de contact affiché sur votre page de réservation.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="01 23 45 67 89" {...field} />
                      </FormControl>
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

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  "Enregistrer les modifications"
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default BusinessSettings;
