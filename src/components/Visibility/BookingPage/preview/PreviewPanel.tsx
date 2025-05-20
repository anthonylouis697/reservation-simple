
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, ImageIcon } from 'lucide-react';
import { useBookingPage } from '../BookingPageContext';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { BookingStep } from '../types';
import { useMemo } from 'react';

export function PreviewPanel() {
  const {
    businessName,
    welcomeMessage,
    primaryColor,
    secondaryColor,
    selectedTemplate,
    logo,
    buttonCorners,
    templates,
    steps,
    bookingButtonText,
    layoutType,
    customTexts
  } = useBookingPage();

  // Récupérer le template sélectionné
  const template = templates.find(t => t.id === selectedTemplate) || templates[0];
  
  // Générer les classes CSS pour le style des boutons
  const getButtonClasses = () => {
    switch (buttonCorners) {
      case 'squared': return 'rounded-none';
      case 'pill': return 'rounded-full';
      default: return 'rounded-md'; // 'rounded'
    }
  };

  // Générer le style du template
  const getTemplateStyles = () => {
    const styles: React.CSSProperties = {
      backgroundColor: template.colors.background,
      color: template.colors.text,
    };
    
    if (template.style === 'minimal') {
      styles.boxShadow = 'none';
    } else if (template.style === 'premium') {
      styles.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
      styles.borderWidth = '0';
    }
    
    return styles;
  };

  // Only get enabled steps
  const enabledSteps = useMemo(() => steps.filter(step => step.enabled), [steps]);
  
  // Generate step UI based on the step type
  const renderStepPreview = (step: BookingStep, isActive: boolean = false) => {
    // Create instance of the icon component
    const IconComponent = step.icon;
    
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

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" />
          Aperçu
        </CardTitle>
        <CardDescription>
          Visualisez votre page de réservation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          className="border rounded-lg overflow-hidden"
          style={getTemplateStyles()}
        >
          <div 
            className={`h-12 flex items-center justify-center text-white font-medium ${
              template.style === 'minimal' ? 'border-b' : ''
            }`}
            style={{ backgroundColor: primaryColor }}
          >
            {businessName}
          </div>
          
          <div className={`p-4 space-y-4 ${template.style === 'premium' ? 'px-6 py-5' : ''}`}>
            <div className="flex flex-col items-center justify-center">
              <div className={`w-16 h-16 ${template.style === 'premium' ? 'rounded-xl' : 'rounded-full'} border flex items-center justify-center bg-white mb-2`}>
                {logo ? (
                  <img src={logo} alt="Logo" className="max-h-full max-w-full object-contain" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              
              <p className={`text-sm text-center ${template.style === 'premium' ? 'font-medium' : ''}`}>
                {welcomeMessage}
              </p>
            </div>
            
            {/* Different layout types */}
            {layoutType === 'stepped' ? (
              <>
                {/* Progress Steps for stepped layout */}
                {enabledSteps.length > 0 && (
                  <div className="flex justify-between items-center mb-4 text-xs">
                    {enabledSteps.map((step, index) => (
                      <div key={step.id} className="flex flex-col items-center">
                        <div 
                          className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${index === 0 ? "bg-primary text-white" : "border"}`}
                        >
                          {index === 0 ? "1" : index + 1}
                        </div>
                        <span className="text-[10px]">{step.name}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Active Step (showing first enabled step) */}
                {enabledSteps.length > 0 && renderStepPreview(enabledSteps[0], true)}
              </>
            ) : (
              /* All-in-one layout: Show all steps */
              <div className="space-y-6 py-2">
                {enabledSteps.map((step) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={step.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-accent rounded-full w-4 h-4 flex items-center justify-center">
                          {step.icon && <StepIcon size={12} />}
                        </div>
                        <span className="text-sm font-medium">{step.name}</span>
                      </div>
                      {renderStepPreview(step, true)}
                    </div>
                  );
                })}
              </div>
            )}
            
            <Button 
              className={`w-full text-xs h-8 mt-4 ${getButtonClasses()}`} 
              style={{ backgroundColor: primaryColor }}
            >
              {bookingButtonText || "Confirmer"}
            </Button>
          </div>
        </div>
        
        <p className="text-xs text-center text-muted-foreground mt-4">
          Aperçu simplifié. L'apparence réelle peut varier.
        </p>
        
        <div className="flex justify-center mt-4">
          <Button variant="outline" size="sm" className="text-xs">
            Voir en plein écran
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

