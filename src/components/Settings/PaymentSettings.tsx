
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { CreditCard, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const paymentFormSchema = z.object({
  currency: z.string().min(1),
  requirePrepayment: z.boolean(),
  prepaymentPercentage: z.number().min(0).max(100).optional(),
  cancellationPolicy: z.string().min(1),
  cancellationDeadline: z.number().min(0),
  refundPolicy: z.string().min(1),
  taxRate: z.number().min(0),
  companyName: z.string().optional(),
  companyVatNumber: z.string().optional(),
  stripeConnected: z.boolean().default(false),
  paypalConnected: z.boolean().default(false),
});

const PaymentSettings = () => {
  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      currency: "EUR",
      requirePrepayment: false,
      prepaymentPercentage: 50,
      cancellationPolicy: "flexible",
      cancellationDeadline: 24,
      refundPolicy: "full",
      taxRate: 20,
      companyName: "BookWise SARL",
      companyVatNumber: "FR12345678901",
      stripeConnected: false,
      paypalConnected: false,
    },
  });

  const watchRequirePrepayment = form.watch("requirePrepayment");

  function onSubmit(values: z.infer<typeof paymentFormSchema>) {
    console.log(values);
    toast.success("Paramètres de paiement enregistrés");
  }

  const connectStripe = () => {
    form.setValue("stripeConnected", true);
    toast.success("Connecté à Stripe avec succès");
  };

  const disconnectStripe = () => {
    form.setValue("stripeConnected", false);
    toast.success("Déconnecté de Stripe");
  };

  const connectPayPal = () => {
    form.setValue("paypalConnected", true);
    toast.success("Connecté à PayPal avec succès");
  };

  const disconnectPayPal = () => {
    form.setValue("paypalConnected", false);
    toast.success("Déconnecté de PayPal");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Méthodes de paiement</CardTitle>
          <CardDescription>
            Configurez comment vos clients peuvent vous payer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="online">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="online">Paiements en ligne</TabsTrigger>
              <TabsTrigger value="offline">Paiements hors ligne</TabsTrigger>
            </TabsList>
            <TabsContent value="online">
              <div className="space-y-6">
                <Card>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">Stripe</CardTitle>
                      </div>
                      {form.watch("stripeConnected") ? (
                        <div className="text-xs font-medium text-emerald-500">Connecté</div>
                      ) : (
                        <div className="text-xs font-medium text-muted-foreground">Non connecté</div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <CardDescription>
                      Acceptez les paiements par carte de crédit via Stripe.
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    {form.watch("stripeConnected") ? (
                      <Button variant="outline" className="w-full" onClick={disconnectStripe}>
                        Déconnecter Stripe
                      </Button>
                    ) : (
                      <Button className="w-full" onClick={connectStripe}>
                        Connecter avec Stripe
                      </Button>
                    )}
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-5 w-5 text-primary"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 12V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7"></path>
                          <path d="M16 12h-5a2 2 0 0 0-2 2v4"></path>
                          <path d="M16 16h6"></path>
                          <path d="M19 19l3-3-3-3"></path>
                        </svg>
                        <CardTitle className="text-base">PayPal</CardTitle>
                      </div>
                      {form.watch("paypalConnected") ? (
                        <div className="text-xs font-medium text-emerald-500">Connecté</div>
                      ) : (
                        <div className="text-xs font-medium text-muted-foreground">Non connecté</div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <CardDescription>
                      Acceptez les paiements via PayPal.
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    {form.watch("paypalConnected") ? (
                      <Button variant="outline" className="w-full" onClick={disconnectPayPal}>
                        Déconnecter PayPal
                      </Button>
                    ) : (
                      <Button className="w-full" onClick={connectPayPal}>
                        Connecter avec PayPal
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="offline">
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="cash" defaultChecked />
                    <Label htmlFor="cash" className="font-medium">Paiement en espèces</Label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Les clients pourront payer en espèces lors de leur rendez-vous.
                  </p>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="card" defaultChecked />
                    <Label htmlFor="card" className="font-medium">Paiement par carte sur place</Label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Les clients pourront payer par carte de crédit/débit sur place.
                  </p>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="transfer" />
                    <Label htmlFor="transfer" className="font-medium">Virement bancaire</Label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Les clients pourront payer par virement bancaire.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Options de paiement</CardTitle>
              <CardDescription>
                Configurez les règles de paiement, d'annulation et de remboursement.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Devise</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une devise" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                        <SelectItem value="USD">Dollar US ($)</SelectItem>
                        <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                        <SelectItem value="CHF">Franc Suisse (CHF)</SelectItem>
                        <SelectItem value="CAD">Dollar Canadien (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requirePrepayment"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Prépaiement requis</FormLabel>
                      <FormDescription>
                        Exiger un paiement à l'avance pour confirmer la réservation.
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

              {watchRequirePrepayment && (
                <FormField
                  control={form.control}
                  name="prepaymentPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pourcentage de prépaiement</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          value={field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        Pourcentage du montant total que le client doit payer à l'avance.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="cancellationPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Politique d'annulation</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une politique" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="flexible">Flexible</SelectItem>
                        <SelectItem value="moderate">Modérée</SelectItem>
                        <SelectItem value="strict">Stricte</SelectItem>
                        <SelectItem value="custom">Personnalisée</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Définit les règles d'annulation pour vos clients.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cancellationDeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Délai d'annulation (heures)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      Temps minimum avant le rendez-vous pour permettre l'annulation gratuite.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="refundPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Politique de remboursement</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une politique" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full">Remboursement complet</SelectItem>
                        <SelectItem value="partial">Remboursement partiel</SelectItem>
                        <SelectItem value="credit">Crédit pour une future réservation</SelectItem>
                        <SelectItem value="none">Aucun remboursement</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Comment gérer les remboursements en cas d'annulation par le client.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations fiscales</CardTitle>
              <CardDescription>
                Configurez les paramètres fiscaux et de facturation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taux de TVA (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      Taux de TVA appliqué à vos services.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'entreprise</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nom juridique de votre entreprise" />
                      </FormControl>
                      <FormDescription>
                        Apparaîtra sur vos factures.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyVatNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de TVA</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="ex: FR12345678901" />
                      </FormControl>
                      <FormDescription>
                        Votre numéro de TVA intracommunautaire.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center p-4 border rounded-md bg-amber-50">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  Assurez-vous que vos paramètres fiscaux sont conformes à la législation de votre pays.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button type="submit">Enregistrer les modifications</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default PaymentSettings;
