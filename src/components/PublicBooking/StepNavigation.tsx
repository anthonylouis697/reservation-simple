
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface StepNavigationProps {
  currentStep: number;
  handlePrevStep: () => void;
  handleNextStep: () => void;
  isBooking: boolean;
  getButtonStyle?: () => { 
    className?: string; 
    style?: { backgroundColor?: string; borderColor?: string } 
  };
  getCurrentStepIcon?: () => ReactNode;
  getStepLabel?: (index: number) => string;
  bookingButtonText?: string;
  activeStepsLength?: number;
}

const StepNavigation = ({
  currentStep = 0,
  handlePrevStep,
  handleNextStep,
  isBooking = false,
  getButtonStyle,
  getCurrentStepIcon,
  getStepLabel,
  bookingButtonText = "Réserver",
  activeStepsLength = 4
}: StepNavigationProps) => {
  // Ensure all handler functions have fallbacks
  const safeHandlePrevStep = handlePrevStep || (() => {});
  const safeHandleNextStep = handleNextStep || (() => {});
  const safeGetButtonStyle = getButtonStyle || (() => ({ className: "", style: { backgroundColor: "", borderColor: "" } }));
  const safeGetCurrentStepIcon = getCurrentStepIcon || (() => null);
  const safeGetStepLabel = getStepLabel || ((index: number) => `Étape ${index + 1}`);
  
  // Get button styles safely
  const buttonStyle = safeGetButtonStyle();
  const buttonClassName = buttonStyle?.className || "";
  const buttonStyleObj = buttonStyle?.style || { backgroundColor: "", borderColor: "" };
  
  // Get current step icon and label safely
  const currentStepIcon = safeGetCurrentStepIcon();
  const stepLabel = safeGetStepLabel(currentStep);
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
      <div className="flex items-center gap-2">
        {currentStepIcon}
        <span className="font-medium">{stepLabel}</span>
      </div>
      
      <div className="flex gap-2">
        {currentStep > 0 && (
          <Button
            variant="outline"
            onClick={safeHandlePrevStep}
            disabled={isBooking}
          >
            Précédent
          </Button>
        )}
        
        <Button 
          onClick={safeHandleNextStep}
          disabled={isBooking}
          className={buttonClassName}
          style={buttonStyleObj}
        >
          {isBooking ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Traitement...
            </>
          ) : currentStep === activeStepsLength - 1 ? (
            bookingButtonText
          ) : (
            "Suivant"
          )}
        </Button>
      </div>
    </div>
  );
};

export default StepNavigation;
