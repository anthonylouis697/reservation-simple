
import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useBookingPage } from '../BookingPageContext';
import { PreviewHeader } from './components/PreviewHeader';
import { PreviewTemplateHeader } from './components/PreviewTemplateHeader';
import { SteppedLayoutPreview } from './components/SteppedLayoutPreview';
import { AllInOneLayoutPreview } from './components/AllInOneLayoutPreview';
import { PreviewFooter } from './components/PreviewFooter';
import { getTemplateStyles } from './utils/templateStyles';

export function PreviewPanel() {
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
  const enabledSteps = useMemo(() => steps.filter(step => step.enabled), [steps]);
  
  return (
    <Card className="sticky top-4">
      <PreviewHeader />
      
      <CardContent>
        <div 
          className="border rounded-lg overflow-hidden"
          style={getTemplateStyles(template)}
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
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
