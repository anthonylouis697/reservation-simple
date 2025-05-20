
import { Helmet } from "react-helmet";
import { AppLayout } from "@/components/AppLayout";
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { Globe, Pencil, DollarSign, Star } from "lucide-react";

// Schéma pour le formulaire du site web
const websiteFormSchema = z.object({
  pages: z.number().min(1).max(20),
  design: z.enum(["simple", "standard", "premium"]),
  logo: z.boolean().default(false),
  seo: z.boolean().default(false),
  contentCreation: z.boolean().default(false),
  maintenance: z.boolean().default(false),
  hosting: z.boolean().default(true),
});

type WebsiteFormValues = z.infer<typeof websiteFormSchema>;

export default function AdditionalServices() {
  const [activeTab, setActiveTab] = useState("website");
  const [totalPrice, setTotalPrice] = useState(499);
  
  // Form pour le calculateur de site web
  const form = useForm<WebsiteFormValues>({
    resolver: zodResolver(websiteFormSchema),
    defaultValues: {
      pages: 5,
      design: "standard",
      logo: false,
      seo: false,
      contentCreation: false,
      maintenance: false,
      hosting: true,
    },
  });

  // Observer les changements du formulaire pour recalculer le prix
  useEffect(() => {
    const subscription = form.watch((value) => {
      calculateWebsitePrice(value as WebsiteFormValues);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Calculer le prix du site web
  const calculateWebsitePrice = (values: WebsiteFormValues) => {
    let price = 499; // Prix de base
    
    // Prix selon le nombre de pages
    price += (values.pages - 5) * 50; // 50€ par page supplémentaire au-delà de 5
    
    // Prix selon le design
    if (values.design === "standard") price += 200;
    if (values.design === "premium") price += 500;
    
    // Options supplémentaires
    if (values.logo) price += 150;
    if (values.seo) price += 300;
    if (values.contentCreation) price += values.pages * 80;
    if (values.maintenance) price += 150;
    if (values.hosting) price += 100;
    
    setTotalPrice(price);
  };

  // Gérer la soumission du formulaire
  const onSubmit = (values: WebsiteFormValues) => {
    toast({
      title: "Demande envoyée",
      description: "Notre équipe vous contactera sous peu pour discuter de votre projet.",
    });
    console.log("Form values:", values);
  };

  const services = [
    {
      id: "google-business",
      title: "Création Fiche Google My Business",
      description: "Une fiche Google My Business optimisée est essentielle pour être visible localement. Notre service inclut la création complète de votre fiche, l'optimisation des informations, l'ajout de photos, et la configuration initiale.",
      price: "299€",
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      features: [
        "Création de fiche vérifiée",
        "Optimisation des mots-clés",
        "Ajout de photos professionnelles",
        "Configuration des horaires et services",
        "Validation et publication"
      ],
      cta: "Commander"
    },
    {
      id: "local-boost",
      title: "Boost Local Google",
      description: "Améliorez votre visibilité locale avec notre service d'optimisation continue. Nous gérons vos avis, optimisons votre présence dans les recherches locales et améliorons votre référencement de proximité.",
      price: "199€/mois",
      icon: <Star className="h-8 w-8 text-green-500" />,
      features: [
        "Gestion des avis clients",
        "Optimisation SEO locale",
        "Publication de posts réguliers",
        "Suivi de positionnement",
        "Rapport mensuel de performance"
      ],
      cta: "S'abonner"
    },
    {
      id: "google-repair",
      title: "Réparation Fiche Google",
      description: "Vous rencontrez des problèmes avec votre fiche Google existante? Notre service de réparation corrige les erreurs, résout les problèmes d'accès et optimise votre fiche pour de meilleures performances.",
      price: "149€",
      icon: <Globe className="h-8 w-8 text-orange-500" />,
      features: [
        "Audit complet de votre fiche",
        "Correction des informations erronées",
        "Résolution des problèmes d'accès",
        "Optimisation des éléments existants",
        "Recommandations d'amélioration"
      ],
      cta: "Réparer ma fiche"
    }
  ];

  return (
    <AppLayout>
      <Helmet>
        <title>Services additionnels - Reservatoo</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Services additionnels</h1>
          <p className="text-muted-foreground mt-1">
            Renforcez votre présence en ligne avec nos services professionnels
          </p>
        </div>

        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="services">Services Google</TabsTrigger>
            <TabsTrigger value="website">Création de site web</TabsTrigger>
          </TabsList>
          
          <TabsContent value="services" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="border-2 hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="mb-2">{service.icon}</div>
                      <div className="text-xl font-bold text-primary">{service.price}</div>
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5 text-green-500"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">{service.cta}</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="website" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Pencil className="h-6 w-6 text-rose-500" />
                      <CardTitle>Calculateur de site web</CardTitle>
                    </div>
                    <CardDescription>
                      Configurez votre site web sur mesure et obtenez un devis instantané
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="pages"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre de pages</FormLabel>
                              <div className="space-y-2">
                                <Slider 
                                  min={1}
                                  max={20}
                                  step={1}
                                  defaultValue={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>1 page</span>
                                  <span>{field.value} pages</span>
                                  <span>20 pages</span>
                                </div>
                              </div>
                              <FormDescription>
                                Sélectionnez le nombre de pages dont vous avez besoin.
                              </FormDescription>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="design"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Niveau de design</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez un niveau de design" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="simple">Simple (Basic)</SelectItem>
                                  <SelectItem value="standard">Standard (Recommandé)</SelectItem>
                                  <SelectItem value="premium">Premium (Haute qualité)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Le niveau de design détermine la complexité et l'unicité de votre site.
                              </FormDescription>
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="logo"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                  <FormLabel>Création de logo</FormLabel>
                                  <FormDescription>
                                    Design professionnel de votre logo
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
                            name="seo"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                  <FormLabel>Optimisation SEO</FormLabel>
                                  <FormDescription>
                                    Référencement Google amélioré
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
                            name="contentCreation"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                  <FormLabel>Création de contenu</FormLabel>
                                  <FormDescription>
                                    Textes rédigés par nos experts
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
                            name="maintenance"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                  <FormLabel>Maintenance annuelle</FormLabel>
                                  <FormDescription>
                                    Mises à jour et support technique
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
                            name="hosting"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                  <FormLabel>Hébergement (1 an)</FormLabel>
                                  <FormDescription>
                                    Inclut nom de domaine et certificat SSL
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

                        <Button type="submit" className="w-full">
                          Demander un devis détaillé
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="border-2 border-primary sticky top-6">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Votre devis</span>
                      <DollarSign className="h-5 w-5 text-green-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Site web ({form.watch("pages")} pages)</span>
                        <span>{form.watch("pages") <= 5 ? "499€" : `${499 + (form.watch("pages") - 5) * 50}€`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Design {
                          form.watch("design") === "simple" ? "Simple" : 
                          form.watch("design") === "standard" ? "Standard" : "Premium"
                        }</span>
                        <span>{
                          form.watch("design") === "simple" ? "0€" : 
                          form.watch("design") === "standard" ? "200€" : "500€"
                        }</span>
                      </div>
                      
                      {form.watch("logo") && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Création de logo</span>
                          <span>150€</span>
                        </div>
                      )}
                      
                      {form.watch("seo") && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Optimisation SEO</span>
                          <span>300€</span>
                        </div>
                      )}
                      
                      {form.watch("contentCreation") && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Création de contenu</span>
                          <span>{form.watch("pages") * 80}€</span>
                        </div>
                      )}
                      
                      {form.watch("maintenance") && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Maintenance annuelle</span>
                          <span>150€</span>
                        </div>
                      )}
                      
                      {form.watch("hosting") && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Hébergement (1 an)</span>
                          <span>100€</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-xl text-primary">{totalPrice}€</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Prix HT. TVA applicable selon votre pays.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Télécharger le devis (PDF)
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
