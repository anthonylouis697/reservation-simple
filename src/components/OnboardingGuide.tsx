
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Calendar, Settings, Users, Star, ArrowRight, CheckCircle, Paintbrush } from 'lucide-react';
import { toast } from 'sonner';

const steps = [
  {
    title: "Bienvenue sur BookWise !",
    description: "Découvrez comment configurer rapidement votre agenda en ligne et commencer à recevoir des réservations.",
    icon: CheckCircle,
    action: "Commencer",
  },
  {
    title: "Configuration de votre profil",
    description: "Personnalisez votre profil professionnel pour vous présenter à vos clients.",
    icon: Settings,
    action: "Configurer mon profil",
    path: "/settings"
  },
  {
    title: "Définissez vos services",
    description: "Créez les services que vous proposez à vos clients pour qu'ils puissent les réserver.",
    icon: Users,
    action: "Créer mes services",
    path: "/services"
  },
  {
    title: "Définissez vos disponibilités",
    description: "Configurez vos heures de disponibilité pour que vos clients puissent réserver aux moments qui vous conviennent.",
    icon: Calendar,
    action: "Gérer mon calendrier",
    path: "/calendar"
  },
  {
    title: "Personnalisez votre page de réservation",
    description: "Adaptez l'apparence de votre page de réservation à votre image de marque.",
    icon: Paintbrush,
    action: "Personnaliser ma page",
    path: "/visibility/booking-page"
  },
  {
    title: "Prêt à recevoir vos premiers clients",
    description: "Votre agenda est configuré. Partagez votre lien de réservation avec vos clients et commencez à recevoir des réservations.",
    icon: Star,
    action: "Terminer",
    nextAction: "Voir mon tableau de bord",
    nextPath: "/dashboard"
  }
];

export function OnboardingGuide() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà vu l'onboarding
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    if (!hasCompletedOnboarding) {
      setOpen(true);
    } else {
      setOnboardingComplete(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      
      // Si l'étape actuelle a un chemin spécifié, naviguer vers cette page
      if (steps[currentStep].path) {
        navigate(steps[currentStep].path);
        setOpen(false); // Fermer le guide pour permettre à l'utilisateur d'interagir avec la page
      }
    } else {
      // Fin de l'onboarding
      completeOnboarding();
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setOnboardingComplete(true);
    setOpen(false);
    
    // Afficher un message de félicitations
    toast.success("Configuration terminée ! Vous êtes maintenant prêt à recevoir des réservations.");
    
    // Rediriger vers le tableau de bord
    if (steps[currentStep].nextPath) {
      navigate(steps[currentStep].nextPath);
    }
  };

  const reopenOnboarding = () => {
    setCurrentStep(0);
    setOpen(true);
  };

  const handleSkip = () => {
    // Marquer l'onboarding comme terminé mais suggérer de le reprendre plus tard
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setOnboardingComplete(true);
    setOpen(false);
    toast.info("Vous pouvez reprendre le guide à tout moment depuis votre profil.", {
      duration: 5000,
      action: {
        label: "Reprendre",
        onClick: reopenOnboarding
      }
    });
  };

  const currentStepInfo = steps[currentStep];
  const Icon = currentStepInfo?.icon || CheckCircle;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-center text-xl">{currentStepInfo?.title}</DialogTitle>
            <DialogDescription className="text-center">
              {currentStepInfo?.description}
            </DialogDescription>
          </DialogHeader>

          {/* Indicateur de progression */}
          <div className="flex justify-center space-x-1 mt-4">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`h-1 rounded-full ${
                  index === currentStep ? 'bg-primary w-6' : 'bg-gray-200 w-2'
                }`}
              />
            ))}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4">
            {currentStep === 0 ? (
              <Button variant="ghost" onClick={handleSkip} className="sm:order-1 w-full sm:w-auto">
                Ignorer
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => setCurrentStep(currentStep - 1)} className="sm:order-1 w-full sm:w-auto">
                Retour
              </Button>
            )}
            
            <Button 
              onClick={handleNext} 
              className="w-full sm:w-auto"
            >
              {currentStepInfo?.action || "Suivant"} 
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bouton pour réouvrir le guide d'onboarding */}
      {onboardingComplete && !open && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={reopenOnboarding} 
          className="hidden md:flex items-center gap-1 absolute bottom-4 right-4"
        >
          <CheckCircle className="h-4 w-4" />
          Reprendre le guide
        </Button>
      )}
    </>
  );
}
