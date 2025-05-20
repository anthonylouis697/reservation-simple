
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { FullScreenPreview } from '../FullScreenPreview';

interface PreviewFooterProps {
  bookingButtonText: string;
  primaryColor: string;
  buttonCorners: 'squared' | 'rounded' | 'pill';
  showFullscreenButton?: boolean;
}

export const PreviewFooter: FC<PreviewFooterProps> = ({ 
  bookingButtonText, 
  primaryColor, 
  buttonCorners,
  showFullscreenButton = true
}) => {
  // Generate the classes CSS for the style of buttons
  const getButtonClasses = () => {
    switch (buttonCorners) {
      case 'squared': return 'rounded-none';
      case 'pill': return 'rounded-full';
      default: return 'rounded-md'; // 'rounded'
    }
  };

  return (
    <>
      <Button 
        className={`w-full text-xs h-8 mt-4 ${getButtonClasses()}`} 
        style={{ backgroundColor: primaryColor }}
      >
        {bookingButtonText || "Confirmer"}
      </Button>
      
      <p className="text-xs text-center text-muted-foreground mt-4">
        Aperçu simplifié. L'apparence réelle peut varier.
      </p>
      
      {showFullscreenButton && (
        <div className="flex justify-center mt-4">
          <FullScreenPreview />
        </div>
      )}
    </>
  );
};
