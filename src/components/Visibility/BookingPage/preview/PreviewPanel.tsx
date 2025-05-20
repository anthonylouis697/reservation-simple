
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, ImageIcon } from 'lucide-react';
import { useBookingPage } from '../BookingPageContext';
import { Label } from '@/components/ui/label';

export function PreviewPanel() {
  const {
    businessName,
    welcomeMessage,
    primaryColor,
    secondaryColor,
    selectedTemplate,
    logo,
    buttonCorners,
    templates
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
                  <img src={logo} alt="Logo" className="max-h-full max-w-full rounded-full" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              
              <p className={`text-sm text-center ${template.style === 'premium' ? 'font-medium' : ''}`}>
                {welcomeMessage}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs">Sélectionnez un service</Label>
              <div className="border rounded p-2 text-sm cursor-pointer hover:bg-accent">
                Service exemple
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs">Sélectionnez une date</Label>
              <div className="border rounded p-2 text-sm text-center">
                [Calendrier]
              </div>
            </div>
            
            <div className="space-y-1">
              <Label className="text-xs">Sélectionnez un horaire</Label>
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
            
            <Button 
              className={`w-full text-xs h-8 mt-2 ${getButtonClasses()}`} 
              style={{ backgroundColor: primaryColor }}
            >
              Confirmer
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
