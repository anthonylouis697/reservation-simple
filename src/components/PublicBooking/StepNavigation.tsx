
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface StepNavigationProps {
  currentStep: number;
  handlePrevStep: () => void;
  handleNextStep: () => void;
  isBooking: boolean;
  getButtonStyle: () => { 
    className: string; 
    style: { backgroundColor: string; borderColor: string } 
  };
  getCurrentStepIcon: () => ReactNode;
  getStepLabel: (index: number) => string;
  bookingButtonText: string;
  activeStepsLength: number;
}

const StepNavigation = ({
  currentStep,
  handlePrevStep,
  handleNextStep,
  isBooking,
  getButtonStyle,
  getCurrentStepIcon,
  getStepLabel,
  bookingButtonText,
  activeStepsLength
}: StepNavigationProps) => {
  // Utiliser des valeurs par défaut pour éviter les erreurs
  const buttonStyle = getButtonStyle ? getButtonStyle() : { className: "", style: { backgroundColor: "", borderColor: "" } };
  const currentStepIcon = getCurrentStepIcon ? getCurrentStepIcon() : null;
  const stepLabel = getStepLabel ? getStepLabel(currentStep) : `Étape ${currentStep + 1}`;
  const safeActiveStepsLength = activeStepsLength || 4; // Valeur par défaut
  
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
            onClick={handlePrevStep}
            disabled={isBooking}
          >
            Précédent
          </Button>
        )}
        
        <Button 
          onClick={handleNextStep}
          disabled={isBooking}
          className={buttonStyle?.className || ""}
          style={buttonStyle?.style || {}}
        >
          {isBooking ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Traitement...
            </>
          ) : currentStep === safeActiveStepsLength - 1 ? (
            bookingButtonText || "Réserver"
          ) : (
            "Suivant"
          )}
        </Button>
      </div>
    </div>
  );
};

export default StepNavigation;
