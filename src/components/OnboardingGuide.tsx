
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
import { Calendar, Settings, Users, Star, ArrowRight, CheckCircle } from 'lucide-react';

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
    title: "Définissez vos disponibilités",
    description: "Configurez vos heures de disponibilité pour que vos clients puissent réserver aux moments qui vous conviennent.",
    icon: Calendar,
    action: "Gérer mon calendrier",
    path: "/calendar"
  },
  {
    title: "Augmentez votre visibilité",
    description: "Connectez-vous à nos plateformes partenaires pour multiplier vos réservations.",
    icon: Star,
    action: "Booster ma visibilité",
    path: "/visibility-boost",
    premium: true
  },
  {
    title: "Prêt à recevoir vos premiers clients",
    description: "Votre agenda est configuré. Partagez votre lien de réservation avec vos clients et commencez à recevoir des réservations.",
    icon: Users,
    action: "Terminer",
  }
];

export function OnboardingGuide() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà vu l'onboarding
    const hasSeenOnboarding = localStorage.getItem('hasCompletedOnboarding');
    if (!hasSeenOnboarding) {
      // Uniquement afficher le guide lors du premier chargement de l'application
      setOpen(true);
      // Marquer comme vu immédiatement pour éviter qu'il réapparaisse lors des clics
      localStorage.setItem('hasCompletedOnboarding', 'true');
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
      setOpen(false);
    }
  };

  const handleSkip = () => {
    setOpen(false);
  };

  const currentStepInfo = steps[currentStep];
  const Icon = currentStepInfo.icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">{currentStepInfo.title}</DialogTitle>
          <DialogDescription className="text-center">
            {currentStepInfo.description}
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
            className={`${currentStepInfo.premium ? 'bg-gradient-to-r from-amber-500 to-orange-600' : ''} w-full sm:w-auto`}
          >
            {currentStepInfo.action} 
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
