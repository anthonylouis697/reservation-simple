
import { useCallback, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { HexColorPicker } from 'react-colorful';
import { Check, Upload } from 'lucide-react';
import { useBookingPage } from '../BookingPageContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function CustomizeTab() {
  const { 
    selectedTemplate, 
    setSelectedTemplate,
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    buttonCorners,
    setButtonCorners,
    logo,
    setLogo,
    templates
  } = useBookingPage();
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tempColor, setTempColor] = useState(primaryColor);
  
  // Function to handle template selection with visual feedback
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    
    if (template) {
      setPrimaryColor(template.colors.primary);
      setSecondaryColor(template.colors.secondary);
      toast.success(`Template "${template.name}" sélectionné`);
    }
  };
  
  // Update temp color when primary color changes
  useEffect(() => {
    setTempColor(primaryColor);
  }, [primaryColor]);
  
  // Upload logo handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez choisir une image valide');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setLogo(reader.result as string);
      toast.success('Logo téléchargé avec succès');
    };
    reader.readAsDataURL(file);
  };
  
  // Reset logo handler
  const handleResetLogo = () => {
    setLogo(null);
    toast.success('Logo réinitialisé');
  };
  
  return (
    <div className="space-y-6">
      {/* Section sélection du template */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Label className="text-base">Choisissez un modèle</Label>
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
      
      {/* Couleur principale et coins des boutons */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className="text-base">Couleur principale</Label>
              <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full h-10 border-2 flex justify-between"
                    style={{ borderColor: primaryColor, color: primaryColor }}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-5 h-5 rounded" 
                        style={{ backgroundColor: primaryColor }}
                      />
                      <span>{primaryColor}</span>
                    </div>
                    <span>Modifier</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3">
                  <HexColorPicker 
                    color={tempColor} 
                    onChange={setTempColor}
                  />
                  <div className="flex gap-2 mt-2">
                    <Input 
                      value={tempColor} 
                      onChange={(e) => setTempColor(e.target.value)}
                      className="h-8"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        setPrimaryColor(tempColor);
                        setShowColorPicker(false);
                        toast.success("Couleur principale mise à jour");
                      }}
                      className="h-8"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-4">
              <Label className="text-base">Style des boutons</Label>
              <RadioGroup 
                value={buttonCorners} 
                onValueChange={(value) => {
                  setButtonCorners(value as 'squared' | 'rounded' | 'pill');
                  toast.success(`Style de bouton "${value}" appliqué`);
                }}
                className="flex gap-2"
              >
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div className={cn(
                    "border-2 w-full h-10 rounded-none flex items-center justify-center",
                    buttonCorners === 'squared' ? "border-primary" : "border-gray-200"
                  )}>
                    <RadioGroupItem 
                      value="squared" 
                      id="squared" 
                      className="sr-only" 
                    />
                    {buttonCorners === 'squared' && <Check className="h-4 w-4 text-primary" />}
                  </div>
                  <Label htmlFor="squared" className="text-xs">Carré</Label>
                </div>
                
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div className={cn(
                    "border-2 w-full h-10 rounded-md flex items-center justify-center",
                    buttonCorners === 'rounded' ? "border-primary" : "border-gray-200"
                  )}>
                    <RadioGroupItem 
                      value="rounded" 
                      id="rounded" 
                      className="sr-only" 
                    />
                    {buttonCorners === 'rounded' && <Check className="h-4 w-4 text-primary" />}
                  </div>
                  <Label htmlFor="rounded" className="text-xs">Arrondi</Label>
                </div>
                
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div className={cn(
                    "border-2 w-full h-10 rounded-full flex items-center justify-center",
                    buttonCorners === 'pill' ? "border-primary" : "border-gray-200"
                  )}>
                    <RadioGroupItem 
                      value="pill" 
                      id="pill" 
                      className="sr-only" 
                    />
                    {buttonCorners === 'pill' && <Check className="h-4 w-4 text-primary" />}
                  </div>
                  <Label htmlFor="pill" className="text-xs">Pill</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Section logo */}
      <Card>
        <CardContent className="pt-6">
          <Label className="text-base mb-4 block">Logo de votre entreprise</Label>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div 
              className="w-24 h-24 rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/50"
            >
              {logo ? (
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            
            <div className="space-y-2 flex-1">
              <Label 
                htmlFor="logo-upload" 
                className="block w-full cursor-pointer text-center py-2 px-4 border-2 border-dashed rounded-md hover:bg-muted/50 transition-colors"
              >
                <span className="flex items-center justify-center gap-2">
                  <Upload className="h-4 w-4" />
                  {logo ? "Changer le logo" : "Télécharger un logo"}
                </span>
                <Input 
                  id="logo-upload" 
                  type="file" 
                  className="sr-only" 
                  onChange={handleLogoUpload}
                  accept="image/*"
                />
              </Label>
              
              {logo && (
                <Button 
                  variant="outline"
                  onClick={handleResetLogo}
                  className="w-full"
                >
                  Supprimer le logo
                </Button>
              )}
              
              <p className="text-xs text-muted-foreground text-center">
                Format recommandé : PNG ou JPG, dimensions carrées, max 1MB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
