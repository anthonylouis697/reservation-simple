
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
  // Safe functions with default values
  const safeSetCurrentStep = setCurrentStep || (() => {});
  const safeHandleBooking = handleBooking || (() => {});
  
  // Handle null or undefined steps array
  const safeSteps = Array.isArray(steps) ? steps : [];
  
  // Function to proceed to next step
  const handleNextStep = () => {
    try {
      // Current step validation
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
      
      // Safely filter active steps
      const activeSteps = safeSteps.filter(step => 
        step && typeof step === 'object' && step.enabled === true
      );
      
      // If we're at the last step, finalize booking
      if (currentStep === activeSteps.length - 1) {
        safeHandleBooking();
        return;
      }
      
      safeSetCurrentStep(currentStep + 1);
    } catch (error) {
      console.error("Error in handleNextStep:", error);
      toast.error("Une erreur est survenue lors de la navigation");
    }
  };

  // Function to go back to previous step
  const handlePrevStep = () => {
    try {
      if (currentStep > 0) {
        safeSetCurrentStep(currentStep - 1);
      }
    } catch (error) {
      console.error("Error in handlePrevStep:", error);
      toast.error("Une erreur est survenue lors de la navigation");
    }
  };

  // Get label for the current step
  const getStepLabel = (index: number) => {
    try {
      // Safely handle steps array
      const safeSteps = Array.isArray(steps) ? steps : [];
      const activeSteps = safeSteps.filter(step => 
        step && typeof step === 'object' && step.enabled === true
      );
      
      if (index >= 0 && index < activeSteps.length) {
        const currentStep = activeSteps[index];
        if (currentStep && typeof currentStep === 'object') {
          return currentStep.customLabel || currentStep.name || `Étape ${index + 1}`;
        }
      }
    } catch (error) {
      console.error("Error in getStepLabel:", error);
    }
    
    return `Étape ${index + 1}`;
  };

  // Get icon for the current step
  const getCurrentStepIcon = () => {
    try {
      // Safely handle steps array
      const safeSteps = Array.isArray(steps) ? steps : [];
      const activeSteps = safeSteps.filter(step => 
        step && typeof step === 'object' && step.enabled === true
      );
      
      if (currentStep >= 0 && currentStep < activeSteps.length) {
        const step = activeSteps[currentStep];
        if (step && typeof step === 'object' && step.icon) {
          const StepIcon = step.icon;
          return <StepIcon className="h-6 w-6" />;
        }
      }
    } catch (error) {
      console.error("Error in getCurrentStepIcon:", error);
    }
    
    return null;
  };

  // Get the number of active steps
  const getActiveStepsLength = () => {
    try {
      // Safely handle steps array
      const safeSteps = Array.isArray(steps) ? steps : [];
      return safeSteps.filter(step => 
        step && typeof step === 'object' && step.enabled === true
      ).length;
    } catch (error) {
      console.error("Error in getActiveStepsLength:", error);
      return 4; // Default value
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
