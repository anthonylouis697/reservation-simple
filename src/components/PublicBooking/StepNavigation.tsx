
import { BookingStep } from '@/components/Visibility/BookingPage/types';
import { CalendarCheck, CalendarDays, Clock, User } from 'lucide-react';
import React from 'react';

interface StepNavigationProps {
  steps: BookingStep[];
  currentStep: number;
  primaryColor: string;
}

const StepNavigation = ({
  steps = [],
  currentStep = 0,
  primaryColor
}: StepNavigationProps) => {
  // Get the correct icon for the current step
  const getIconForStep = (step: BookingStep) => {
    if (!step || !step.type) return null;
    
    const type = step.type.toLowerCase();
    if (type.includes('service')) return <CalendarCheck size={20} />;
    if (type.includes('date')) return <CalendarDays size={20} />;
    if (type.includes('time')) return <Clock size={20} />;
    if (type.includes('client')) return <User size={20} />;
    
    return null;
  };
  
  // Get label for current step
  const getCurrentStepLabel = () => {
    if (currentStep >= steps.length || !steps[currentStep]) {
      return "Étape";
    }
    
    const step = steps[currentStep];
    return step.customLabel || step.name || `Étape ${currentStep + 1}`;
  };
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        {steps[currentStep] && (
          <>
            <div style={{ color: primaryColor }}>
              {getIconForStep(steps[currentStep])}
            </div>
            <span className="font-medium">{getCurrentStepLabel()}</span>
          </>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex space-x-1">
          {steps.map((_, index) => (
            <div 
              key={index}
              className="h-1 w-6 rounded"
              style={{ 
                backgroundColor: index <= currentStep ? primaryColor : '#e5e7eb',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepNavigation;
