
import { FC } from 'react';
import { BookingStep } from '../../types';
import { StepPreview } from './StepPreview';

interface SteppedLayoutPreviewProps {
  enabledSteps: BookingStep[];
}

export const SteppedLayoutPreview: FC<SteppedLayoutPreviewProps> = ({ enabledSteps }) => {
  if (enabledSteps.length === 0) return null;

  return (
    <>
      {/* Progress Steps for stepped layout */}
      <div className="flex justify-between items-center mb-4 text-xs">
        {enabledSteps.map((step, index) => {
          // Vérifier si icon existe avant de l'utiliser
          return (
            <div key={step.id} className="flex flex-col items-center">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${index === 0 ? "bg-primary text-white" : "border"}`}
              >
                {index === 0 ? "1" : index + 1}
              </div>
              <span className="text-[10px]">{step.name}</span>
            </div>
          );
        })}
      </div>
      
      {/* Active Step (showing first enabled step) */}
      <StepPreview step={enabledSteps[0]} isActive={true} />
    </>
  );
};
