
import { FC } from 'react';
import { BookingStep } from '../../types';
import { StepPreview } from './StepPreview';

interface AllInOneLayoutPreviewProps {
  enabledSteps: BookingStep[];
}

export const AllInOneLayoutPreview: FC<AllInOneLayoutPreviewProps> = ({ enabledSteps }) => {
  if (enabledSteps.length === 0) return null;

  return (
    <div className="space-y-6 py-2">
      {enabledSteps.map((step) => {
        // Vérifier si StepIcon existe avant de l'utiliser
        const StepIcon = step.icon;
        return (
          <div key={step.id} className="border-b pb-4 last:border-b-0 last:pb-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-accent rounded-full w-4 h-4 flex items-center justify-center">
                {StepIcon && <StepIcon size={12} />}
              </div>
              <span className="text-sm font-medium">{step.name}</span>
            </div>
            <StepPreview step={step} isActive={true} />
          </div>
        );
      })}
    </div>
  );
};
