
import { useState } from 'react';
import { toast } from 'sonner';

interface StepNavigationProps {
  selectedService: any;
  selectedDate: Date | undefined;
  selectedTime: string | null;
  clientName: string;
  clientEmail: string;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  handleBooking: () => void;
  steps: any[];
}

export const useStepNavigation = ({
  selectedService,
  selectedDate,
  selectedTime,
  clientName,
  clientEmail,
  currentStep = 0,
  setCurrentStep,
  handleBooking,
  steps = []
}: StepNavigationProps) => {
  // Function for passing to the next step
  const handleNextStep = () => {
    // Validation of current step
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
    
    // If we're at the last step, finalize the booking
    const activeSteps = Array.isArray(steps) ? steps.filter(step => step?.enabled) : [];
    if (currentStep === activeSteps.length - 1) {
      handleBooking();
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };

  // Function to go back to previous step
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Get the label for the current step
  const getStepLabel = (index: number) => {
    const activeSteps = Array.isArray(steps) ? steps.filter(step => step?.enabled) : [];
    if (index >= 0 && index < activeSteps.length) {
      return activeSteps[index]?.customLabel || activeSteps[index]?.name || `Étape ${index + 1}`;
    }
    return `Étape ${index + 1}`;
  };

  // Get the icon for the current step
  const getCurrentStepIcon = () => {
    const activeSteps = Array.isArray(steps) ? steps.filter(step => step?.enabled) : [];
    if (currentStep >= 0 && currentStep < activeSteps.length && activeSteps[currentStep]?.icon) {
      const StepIcon = activeSteps[currentStep].icon;
      return <StepIcon className="h-6 w-6" />;
    }
    return null;
  };

  // Get the count of active steps
  const getActiveStepsLength = () => {
    return Array.isArray(steps) ? steps.filter(step => step?.enabled).length : 4; // Default to 4 steps
  };

  return {
    handleNextStep,
    handlePrevStep,
    getStepLabel,
    getCurrentStepIcon,
    getActiveStepsLength
  };
};
