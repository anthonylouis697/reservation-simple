
import { useState } from "react";
import AccountLayout from "@/components/Account/AccountLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { CheckCircle, Download, CreditCard, Calendar, ArrowRight, Zap, AlertCircle } from "lucide-react";

// Types for billing plans and invoices
type BillingPlan = {
  id: string;
  name: string;
  price: number;
  interval: "mensuel" | "annuel";
  features: string[];
  isPopular?: boolean;
  isCurrent?: boolean;
};

type Invoice = {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  description: string;
};

export default function BillingPage() {
  const [isYearlyBilling, setIsYearlyBilling] = useState(false);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  
  // Mock current plan data
  const currentPlan = {
    name: "Premium",
    renewalDate: "15 juin 2025",
    price: 29.99,
    interval: "mensuel" as const,
    features: [
      "Jusqu'à 5 utilisateurs",
      "Réservations illimitées",
      "Rappels par SMS",
      "Paiements en ligne",
      "Support prioritaire"
    ],
    limits: {
      users: {
        used: 3,
        total: 5,
        percentage: 60
      },
      storage: {
        used: 2.5,
        total: 10,
        percentage: 25
      }
    }
  };

  // Mock billing plans - in a real app this would come from API
  const billingPlans: BillingPlan[] = [
    {
      id: "essential",
      name: "Essentiel",
      price: isYearlyBilling ? 9.99 * 10 : 9.99,
      interval: isYearlyBilling ? "annuel" : "mensuel",
      features: [
        "1 utilisateur uniquement",
        "Jusqu'à 100 réservations/mois",
        "Rappels par email",
        "Support par email"
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: isYearlyBilling ? 29.99 * 10 : 29.99,
      interval: isYearlyBilling ? "annuel" : "mensuel",
      features: [
        "Jusqu'à 5 utilisateurs",
        "Réservations illimitées",
        "Rappels par SMS",
        "Paiements en ligne",
        "Support prioritaire"
      ],
      isPopular: true,
      isCurrent: true,
    },
    {
      id: "business",
      name: "Business",
      price: isYearlyBilling ? 59.99 * 10 : 59.99,
      interval: isYearlyBilling ? "annuel" : "mensuel",
      features: [
        "Utilisateurs illimités",
        "Réservations illimitées",
        "API personnalisée",
        "Intégrations avancées",
        "Support dédié"
      ],
    }
  ];

  // Mock invoice data - in a real app this would come from API
  const invoices: Invoice[] = [
    {
      id: "INV-2023-005",
      date: "15 mai 2024",
      amount: 29.99,
      status: "paid",
      description: "Abonnement Premium - Mai 2024"
    },
    {
      id: "INV-2023-004",
      date: "15 avril 2024",
      amount: 29.99,
      status: "paid",
      description: "Abonnement Premium - Avril 2024"
    },
    {
      id: "INV-2023-003",
      date: "15 mars 2024",
      amount: 29.99,
      status: "paid",
      description: "Abonnement Premium - Mars 2024"
    }
  ];
  
  const handlePlanChange = (planId: string) => {
    setSelectedPlanId(planId);
    setIsUpgradeDialogOpen(true);
  };
  
  const confirmPlanChange = () => {
    const newPlan = billingPlans.find(plan => plan.id === selectedPlanId);
    if (newPlan) {
      toast({
        title: "Abonnement mis à jour",
        description: `Vous êtes maintenant sur le plan ${newPlan.name}`,
      });
    }
    
    setIsUpgradeDialogOpen(false);
  };
  
  const toggleBillingInterval = () => {
    setIsYearlyBilling(prev => !prev);
  };
  
  return (
    <AccountLayout>
      <div className="space-y-6">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Abonnement actuel</CardTitle>
            <CardDescription>
              Détails de votre abonnement actuel et prochaine facturation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center">
                  <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                  <Badge className="ml-2" variant="secondary">Actif</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Prochain renouvellement le {currentPlan.renewalDate}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <p className="text-2xl font-bold">{currentPlan.price} €<span className="text-sm font-normal text-muted-foreground">/{currentPlan.interval}</span></p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Utilisateurs</span>
                  <span>{currentPlan.limits.users.used}/{currentPlan.limits.users.total}</span>
                </div>
                <Progress value={currentPlan.limits.users.percentage} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Stockage</span>
                  <span>{currentPlan.limits.storage.used} Go/{currentPlan.limits.storage.total} Go</span>
                </div>
                <Progress value={currentPlan.limits.storage.percentage} className="h-2" />
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium">Fonctionnalités incluses :</h4>
              <ul className="mt-2 grid gap-y-1 gap-x-4 grid-cols-1 sm:grid-cols-2">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0">
            <Button 
              variant="outline" 
              onClick={() => toast({
                title: "Détails du paiement",
                description: "Page de gestion des moyens de paiement ouverte",
              })}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Gérer le paiement
            </Button>
            <Button
              variant="destructive" 
              onClick={() => toast({
                title: "Annulation d'abonnement",
                description: "Veuillez contacter notre support pour annuler",
              })}
            >
              Annuler l'abonnement
            </Button>
          </CardFooter>
        </Card>
        
        {/* Available Plans */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Comparer les plans</CardTitle>
                <CardDescription>
                  Choisissez le plan qui correspond le mieux à vos besoins
                </CardDescription>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                <span className={!isYearlyBilling ? "font-medium" : "text-muted-foreground"}>Mensuel</span>
                <Switch checked={isYearlyBilling} onCheckedChange={toggleBillingInterval} />
                <span className={isYearlyBilling ? "font-medium" : "text-muted-foreground"}>Annuel</span>
                {isYearlyBilling && (
                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 hover:bg-green-50">
                    Économisez 16%
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {billingPlans.map(plan => (
                <div 
                  key={plan.id} 
                  className={`border rounded-lg p-6 relative ${
                    plan.isCurrent ? 'border-primary shadow-sm' : ''
                  } ${
                    plan.isPopular && !plan.isCurrent ? 'border-amber-200' : ''
                  }`}
                >
                  {plan.isCurrent && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary hover:bg-primary text-white">
                        Plan actuel
                      </Badge>
                    </div>
                  )}
                  
                  {plan.isPopular && !plan.isCurrent && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
                        Populaire
                      </Badge>
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">{plan.price} €</span>
                      <span className="text-muted-foreground">/{plan.interval}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full"
                      variant={plan.isCurrent ? "outline" : plan.isPopular ? "default" : "outline"}
                      onClick={() => !plan.isCurrent && handlePlanChange(plan.id)}
                      disabled={plan.isCurrent}
                    >
                      {plan.isCurrent ? "Plan actuel" : "Passer à ce plan"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Pour un plan personnalisé ou des fonctionnalités spécifiques, contactez notre équipe commerciale.
            </p>
          </CardFooter>
        </Card>
        
        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Historique des paiements</CardTitle>
            <CardDescription>
              Consultez et téléchargez vos factures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Facture</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map(invoice => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{invoice.id}</div>
                        <div className="text-sm text-muted-foreground">{invoice.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.amount} €</TableCell>
                    <TableCell>
                      {invoice.status === "paid" ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Payée</Badge>
                      ) : invoice.status === "pending" ? (
                        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">En attente</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Échouée</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {/* Upgrade/Downgrade Confirmation Dialog */}
      <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer le changement de plan</DialogTitle>
            <DialogDescription>
              Votre plan sera changé immédiatement et votre facturation sera ajustée au prorata.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedPlanId && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{billingPlans.find(p => p.id === selectedPlanId)?.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {billingPlans.find(p => p.id === selectedPlanId)?.price} € / {billingPlans.find(p => p.id === selectedPlanId)?.interval}
                    </p>
                  </div>
                </div>
                <div>
                  {selectedPlanId === "business" ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700">Mise à niveau</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Réduction</Badge>
                  )}
                </div>
              </div>
            )}
            
            <div className="bg-muted p-3 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                En confirmant ce changement, vous acceptez les nouvelles conditions tarifaires qui prendront effet immédiatement.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpgradeDialogOpen(false)}>Annuler</Button>
            <Button onClick={confirmPlanChange}>Confirmer le changement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AccountLayout>
  );
}
