
import { FC } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { BookingStep, BookingCustomTexts } from '../../types';
import { useBookingPage } from '../../BookingPageContext';

interface StepPreviewProps {
  step: BookingStep;
  isActive?: boolean;
}

export const StepPreview: FC<StepPreviewProps> = ({ step, isActive = false }) => {
  const { primaryColor, buttonCorners, customTexts } = useBookingPage();
  
  // Generate the classes CSS for the style of buttons
  const getButtonClasses = () => {
    switch (buttonCorners) {
      case 'squared': return 'rounded-none';
      case 'pill': return 'rounded-full';
      default: return 'rounded-md'; // 'rounded'
    }
  };
  
  switch (step.id) {
    case 'service':
      return (
        <div className="space-y-2">
          <Label className="text-xs">{step.customLabel || customTexts.selectServiceLabel}</Label>
          <div 
            className={cn(
              "border rounded p-2 text-sm cursor-pointer",
              isActive ? "bg-accent" : "hover:bg-accent/50"
            )}
          >
            Service exemple
          </div>
        </div>
      );
    case 'date':
      return (
        <div className="space-y-2">
          <Label className="text-xs">{step.customLabel || customTexts.selectDateLabel}</Label>
          <div className="border rounded p-2 text-sm text-center">
            [Calendrier]
          </div>
          <div className="space-y-1">
            <Label className="text-xs">{customTexts.selectTimeLabel}</Label>
            <div className="flex flex-wrap gap-1 text-xs">
              <div 
                className={`py-1 px-2 ${getButtonClasses()} text-white cursor-pointer`}
                style={{ backgroundColor: primaryColor }}
              >
                10:00
              </div>
              <div className={`py-1 px-2 border ${getButtonClasses()} cursor-pointer`}>
                11:00
              </div>
              <div className={`py-1 px-2 border ${getButtonClasses()} cursor-pointer`}>
                14:00
              </div>
            </div>
          </div>
        </div>
      );
    case 'client':
      return (
        <div className="space-y-2">
          <Label className="text-xs">{step.customLabel || customTexts.clientInfoLabel}</Label>
          <div className="space-y-1">
            <div className="h-6 bg-gray-100 rounded mb-1"></div>
            <div className="h-6 bg-gray-100 rounded"></div>
          </div>
        </div>
      );
    case 'payment':
      return (
        <div className="space-y-2">
          <Label className="text-xs">{step.customLabel || customTexts.paymentMethodLabel}</Label>
          <div className="flex gap-2">
            <div className="h-10 w-14 bg-gray-100 rounded flex items-center justify-center text-xs">VISA</div>
            <div className="h-10 w-14 bg-gray-100 rounded flex items-center justify-center text-xs">MC</div>
          </div>
        </div>
      );
    default:
      return null;
  }
};
