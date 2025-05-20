
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from "@/components/AppLayout";
import { OnboardingGuide } from "@/components/OnboardingGuide";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, Users, Settings, ArrowRight, Paintbrush, Star } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();
  
  // Réinitialiser le statut d'onboarding pour les nouveaux comptes
  useEffect(() => {
    // Cette vérification serait normalement basée sur l'état de l'utilisateur
    const isNewAccount = !localStorage.getItem('hasSetupAccount');
    
    if (isNewAccount) {
      // Réinitialiser le guide d'onboarding pour les nouveaux comptes
      localStorage.removeItem('hasCompletedOnboarding');
      localStorage.setItem('hasSetupAccount', 'true');
    }
  }, []);

  const setupCards = [
    {
      title: "Profil professionnel",
      description: "Configurez vos informations professionnelles et vos coordonnées.",
      icon: Settings,
      path: "/settings",
      completed: false
    },
    {
      title: "Services",
      description: "Créez les services que vous proposez à vos clients.",
      icon: Users,
      path: "/services",
      completed: false
    },
    {
      title: "Disponibilités",
      description: "Définissez vos horaires de disponibilité.",
      icon: Calendar,
      path: "/calendar",
      completed: false
    },
    {
      title: "Page de réservation",
      description: "Personnalisez l'apparence de votre page de réservation.",
      icon: Paintbrush,
      path: "/visibility/booking-page",
      completed: false
    },
    {
      title: "Visibilité en ligne",
      description: "Partagez votre page de réservation en ligne.",
      icon: Star,
      path: "/visibility",
      completed: false
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-8">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Bienvenue sur BookWise !</h1>
          <p className="text-muted-foreground mb-6 max-w-xl">
            Nous sommes ravis de vous accueillir. Commençons à configurer votre compte pour que vous puissiez rapidement recevoir vos premières réservations.
          </p>
          <Button onClick={() => navigate("/dashboard")} className="gap-1">
            Aller au tableau de bord <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <h2 className="text-xl font-semibold mb-4">Configurez votre expérience</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {setupCards.map((card, index) => (
            <Card key={index} className={`hover:shadow-md transition-all ${card.completed ? 'border-green-300 bg-green-50' : ''}`}>
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  onClick={() => navigate(card.path)} 
                  className="w-full"
                  variant={card.completed ? "outline" : "default"}
                >
                  {card.completed ? "Modifier" : "Configurer"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Guide d'onboarding toujours disponible */}
        <OnboardingGuide />
      </div>
    </AppLayout>
  );
};

export default Welcome;
