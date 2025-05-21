
import { useState } from 'react';
import { toast } from 'sonner';

interface StepNavigationProps {
  selectedService?: any;
  selectedDate?: Date | null | undefined;
  selectedTime?: string | null;
  clientName?: string;
  clientEmail?: string;
  currentStep?: number;
  setCurrentStep?: (step: number) => void;
  handleBooking?: () => void;
  steps?: any[];
}

export const useStepNavigation = ({
  selectedService = null,
  selectedDate = undefined,
  selectedTime = null,
  clientName = "",
  clientEmail = "",
  currentStep = 0,
  setCurrentStep = () => {},
  handleBooking = () => {},
  steps = []
}: StepNavigationProps) => {
  // Fonctions sécurisées avec des valeurs par défaut
  const safeSetCurrentStep = setCurrentStep || (() => {});
  const safeHandleBooking = handleBooking || (() => {});
  const safeSteps = Array.isArray(steps) ? steps : [];
  
  // Fonction pour passer à l'étape suivante
  const handleNextStep = () => {
    // Validation de l'étape actuelle
    if (currentStep === 0 && !selectedService) {
      toast.error("Veuillez sélectionner un service");
      return;
    }
    
    if (currentStep === 1 && !selectedDate) {
      toast.error("Veuillez sélectionner une date");
      return;
    }
    
    if (currentStep === 2 && !selectedTime) {
      toast.error("Veuillez sélectionner un horaire");
      return;
    }
    
    if (currentStep === 3 && (!clientName || !clientEmail)) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // Filtrer les étapes actives de manière sécurisée
    const activeSteps = safeSteps.filter(step => step && typeof step === 'object' && step.enabled);
    
    // Si nous sommes à la dernière étape, finaliser la réservation
    if (currentStep === activeSteps.length - 1) {
      safeHandleBooking();
      return;
    }
    
    safeSetCurrentStep(currentStep + 1);
  };

  // Fonction pour revenir à l'étape précédente
  const handlePrevStep = () => {
    if (currentStep > 0) {
      safeSetCurrentStep(currentStep - 1);
    }
  };

  // Obtenir le label pour l'étape actuelle
  const getStepLabel = (index: number) => {
    try {
      const safeSteps = Array.isArray(steps) ? steps : [];
      const activeSteps = safeSteps.filter(step => step && typeof step === 'object' && step.enabled);
      
      if (index >= 0 && index < activeSteps.length) {
        const currentStep = activeSteps[index];
        if (currentStep && typeof currentStep === 'object') {
          return currentStep.customLabel || currentStep.name || `Étape ${index + 1}`;
        }
      }
    } catch (error) {
      console.error("Erreur dans getStepLabel:", error);
    }
    
    return `Étape ${index + 1}`;
  };

  // Obtenir l'icône pour l'étape actuelle
  const getCurrentStepIcon = () => {
    try {
      const safeSteps = Array.isArray(steps) ? steps : [];
      const activeSteps = safeSteps.filter(step => step && typeof step === 'object' && step.enabled);
      
      if (currentStep >= 0 && currentStep < activeSteps.length) {
        const step = activeSteps[currentStep];
        if (step && typeof step === 'object' && step.icon) {
          const StepIcon = step.icon;
          return <StepIcon className="h-6 w-6" />;
        }
      }
    } catch (error) {
      console.error("Erreur dans getCurrentStepIcon:", error);
    }
    
    return null;
  };

  // Obtenir le nombre d'étapes actives
  const getActiveStepsLength = () => {
    try {
      const safeSteps = Array.isArray(steps) ? steps : [];
      return safeSteps.filter(step => step && typeof step === 'object' && step.enabled).length;
    } catch (error) {
      console.error("Erreur dans getActiveStepsLength:", error);
      return 4; // Valeur par défaut
    }
  };

  return {
    handleNextStep,
    handlePrevStep,
    getStepLabel,
    getCurrentStepIcon,
    getActiveStepsLength
  };
};
