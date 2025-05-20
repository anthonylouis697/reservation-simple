
import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Maximize2 } from 'lucide-react';
import { useBookingPage } from '../BookingPageContext';
import { PreviewTemplateHeader } from './components/PreviewTemplateHeader';
import { SteppedLayoutPreview } from './components/SteppedLayoutPreview';
import { AllInOneLayoutPreview } from './components/AllInOneLayoutPreview';
import { PreviewFooter } from './components/PreviewFooter';
import { getTemplateStyles } from './utils/templateStyles';
import { BookingTemplate } from '../types';

export function FullScreenPreview() {
  const {
    businessName,
    welcomeMessage,
    primaryColor,
    selectedTemplate,
    logo,
    buttonCorners,
    templates,
    steps,
    bookingButtonText,
    layoutType,
  } = useBookingPage();

  // Get the selected template
  const template = templates.find(t => t.id === selectedTemplate) || templates[0];
  
  // Only get enabled steps
  const enabledSteps = React.useMemo(() => steps.filter(step => step.enabled), [steps]);
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
          <Maximize2 className="h-3 w-3" />
          Voir en plein écran
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto p-0">
        <div 
          className="rounded-lg overflow-hidden"
          style={getTemplateStyles(template as BookingTemplate)}
        >
          <PreviewTemplateHeader 
            businessName={businessName}
            primaryColor={primaryColor}
            logo={logo}
            templateStyle={template.style}
            welcomeMessage={welcomeMessage}
          />
          
          <div className={`p-4 space-y-4 ${template.style === 'premium' ? 'px-6 py-5' : ''}`}>
            {/* Different layout types */}
            {layoutType === 'stepped' ? (
              <SteppedLayoutPreview enabledSteps={enabledSteps} />
            ) : (
              <AllInOneLayoutPreview enabledSteps={enabledSteps} />
            )}
            
            <PreviewFooter 
              bookingButtonText={bookingButtonText}
              primaryColor={primaryColor}
              buttonCorners={buttonCorners}
              showFullscreenButton={false}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
