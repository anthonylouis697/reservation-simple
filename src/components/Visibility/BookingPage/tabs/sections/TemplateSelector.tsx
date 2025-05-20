
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useBookingPage } from '../../BookingPageContext';

export function TemplateSelector() {
  const { 
    selectedTemplate, 
    setSelectedTemplate,
    setPrimaryColor,
    setSecondaryColor,
    templates
  } = useBookingPage();
  
  // Function to handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    
    if (template) {
      setPrimaryColor(template.colors.primary);
      setSecondaryColor(template.colors.secondary);
      toast.success(`Template "${template.name}" sélectionné`);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Label className="text-base font-medium">Modèle visuel</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div 
                key={template.id} 
                className={cn(
                  "border rounded-lg p-2 cursor-pointer transition-all hover:shadow-md",
                  template.id === selectedTemplate && "ring-2 ring-primary ring-offset-2",
                )}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div 
                  className="h-24 rounded-md flex items-center justify-center mb-2 relative overflow-hidden"
                  style={{ 
                    backgroundColor: template.colors.background,
                    color: template.colors.text
                  }}
                >
                  <div 
                    className="absolute top-0 left-0 right-0 h-8"
                    style={{ backgroundColor: template.colors.primary }}
                  />
                  <div className="z-10 text-sm font-medium">
                    {template.name}
                  </div>
                  
                  {template.id === selectedTemplate && (
                    <div className="absolute top-2 right-2 bg-white rounded-full w-5 h-5 flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                  )}
                </div>
                <div className="text-sm font-medium">{template.name}</div>
                <div className="text-xs text-muted-foreground">{template.description}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
