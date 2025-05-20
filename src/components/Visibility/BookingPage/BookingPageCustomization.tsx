import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { 
  Paintbrush, 
  Layout, 
  Type, 
  Image as ImageIcon, 
  Calendar as CalendarIcon,
  Users, 
  Clock, 
  CreditCard,
  Move, 
  CheckSquare, 
  AlertCircle,
  Check,
  Copy,
  Download,
  FileText,
  Mail,
  Printer,
  Share2,
  Settings,
  Smartphone
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

// Types pour les modèles et les étapes
type BookingTemplate = {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  style: 'standard' | 'minimal' | 'premium';
};

type BookingStep = {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
};

// Composant pour un élément triable dans la liste des étapes
const SortableStep = ({ step, onChange }: { 
  step: BookingStep;
  onChange: (id: string, enabled: boolean) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="flex items-center justify-between p-3 bg-white border rounded-md mb-2"
    >
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="cursor-move" {...attributes} {...listeners}>
          <Move className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10">
            {step.icon}
          </div>
          <span className="font-medium">{step.name}</span>
        </div>
      </div>
      <Switch 
        checked={step.enabled} 
        onCheckedChange={(checked) => onChange(step.id, checked)} 
      />
    </div>
  );
};

export function BookingPageCustomization() {
  // États pour la personnalisation
  const [selectedTab, setSelectedTab] = useState('customize');
  const [selectedTemplate, setSelectedTemplate] = useState('premium');
  const [primaryColor, setPrimaryColor] = useState('#9b87f5');
  const [secondaryColor, setSecondaryColor] = useState('#f3f4f6');
  const [businessName, setBusinessName] = useState('Mon Entreprise');
  const [welcomeMessage, setWelcomeMessage] = useState('Bienvenue sur ma page de réservation');
  const [confirmationMessage, setConfirmationMessage] = useState('Votre rendez-vous a bien été confirmé !');
  const [logo, setLogo] = useState<string | null>(null);
  const [bookingButtonText, setBookingButtonText] = useState('Confirmer la réservation');
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [buttonCorners, setButtonCorners] = useState('rounded');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // États pour l'ordre des étapes
  const [steps, setSteps] = useState<BookingStep[]>([
    { id: 'service', name: 'Choix du service', icon: <CheckSquare className="h-4 w-4" />, enabled: true },
    { id: 'date', name: 'Sélection de la date', icon: <CalendarIcon className="h-4 w-4" />, enabled: true },
    { id: 'time', name: 'Choix de l\'horaire', icon: <Clock className="h-4 w-4" />, enabled: true },
    { id: 'info', name: 'Informations client', icon: <Users className="h-4 w-4" />, enabled: true },
    { id: 'payment', name: 'Paiement (optionnel)', icon: <CreditCard className="h-4 w-4" />, enabled: false },
  ]);
  
  // Modèles disponibles
  const templates: BookingTemplate[] = [
    {
      id: 'standard',
      name: 'Standard',
      description: 'Design professionnel avec des couleurs équilibrées',
      preview: 'standard-preview',
      colors: {
        primary: '#9b87f5',
        secondary: '#f3f4f6',
        background: '#ffffff',
        text: '#1f2937',
      },
      style: 'standard',
    },
    {
      id: 'minimal',
      name: 'Minimaliste',
      description: 'Design épuré avec beaucoup d\'espace blanc',
      preview: 'minimal-preview',
      colors: {
        primary: '#0ea5e9',
        secondary: '#f9fafb',
        background: '#ffffff',
        text: '#111827',
      },
      style: 'minimal',
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Design élégant avec des détails raffinés',
      preview: 'premium-preview',
      colors: {
        primary: '#8b5cf6',
        secondary: '#f3f4f6',
        background: '#ffffff',
        text: '#1f2937',
      },
      style: 'premium',
    },
  ];
  
  // Capteurs pour le système de drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Fonction pour gérer le drag and drop
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setSteps((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  
  // Fonction pour changer l'état d'activation d'une étape
  const handleStepChange = (id: string, enabled: boolean) => {
    setSteps(steps.map(step => step.id === id ? { ...step, enabled } : step));
  };
  
  // Fonction pour gérer le changement de logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Fonction pour sauvegarder les changements
  const handleSave = () => {
    toast.success("Configuration sauvegardée avec succès");
  };
  
  // Sélectionner un template prédéfini
  const selectTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setPrimaryColor(template.colors.primary);
      setSecondaryColor(template.colors.secondary);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Paintbrush className="h-5 w-5 text-primary" />
          Personnalisation de la page
        </CardTitle>
        <CardDescription>
          Créez une expérience de réservation unique adaptée à votre image de marque
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="customize">Personnaliser</TabsTrigger>
            <TabsTrigger value="steps">Étapes & Textes</TabsTrigger>
            <TabsTrigger value="share">Partager</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customize" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                {/* Sélection de modèle */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Layout className="h-4 w-4" />
                      Modèle de page
                    </CardTitle>
                    <CardDescription>
                      Choisissez un modèle qui correspond à votre style
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          onClick={() => selectTemplate(template.id)}
                          className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                            selectedTemplate === template.id
                              ? "ring-2 ring-primary"
                              : "hover:border-primary/50"
                          }`}
                        >
                          <div 
                            className="h-24 w-full"
                            style={{ backgroundColor: template.colors.primary }}
                          >
                            <div className="h-full w-full flex items-center justify-center text-white font-medium">
                              {template.style === 'standard' && 'Standard'}
                              {template.style === 'minimal' && 'Minimal'}
                              {template.style === 'premium' && 'Premium'}
                            </div>
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium">{template.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              {template.description}
                            </p>
                            {selectedTemplate === template.id && (
                              <Badge variant="outline" className="mt-2 bg-primary/10 text-primary">
                                Sélectionné
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Couleurs et style */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Paintbrush className="h-4 w-4" />
                      Couleurs et style
                    </CardTitle>
                    <CardDescription>
                      Personnalisez l'apparence visuelle de votre page
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Couleur principale</Label>
                      <div className="flex gap-3 items-center">
                        <Input 
                          type="color" 
                          id="primary-color" 
                          value={primaryColor} 
                          onChange={(e) => setPrimaryColor(e.target.value)} 
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input 
                          type="text" 
                          value={primaryColor} 
                          onChange={(e) => setPrimaryColor(e.target.value)} 
                          className="w-32"
                        />
                        <div 
                          className="h-8 w-8 rounded-full border"
                          style={{ backgroundColor: primaryColor }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="secondary-color">Couleur secondaire</Label>
                      <div className="flex gap-3 items-center">
                        <Input 
                          type="color" 
                          id="secondary-color" 
                          value={secondaryColor} 
                          onChange={(e) => setSecondaryColor(e.target.value)} 
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input 
                          type="text" 
                          value={secondaryColor} 
                          onChange={(e) => setSecondaryColor(e.target.value)} 
                          className="w-32"
                        />
                        <div 
                          className="h-8 w-8 rounded-full border"
                          style={{ backgroundColor: secondaryColor }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="button-style">Style des boutons</Label>
                      <RadioGroup 
                        defaultValue={buttonCorners} 
                        onValueChange={setButtonCorners}
                        className="flex space-x-2 pt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="squared" id="squared" />
                          <Label htmlFor="squared">Carrés</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="rounded" id="rounded" />
                          <Label htmlFor="rounded">Arrondis</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pill" id="pill" />
                          <Label htmlFor="pill">Pilule</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="logo">Logo</Label>
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 h-16 w-16 border rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
                          {logo ? (
                            <img src={logo} alt="Logo aperçu" className="max-h-full max-w-full" />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" asChild>
                            <label htmlFor="logo-upload" className="cursor-pointer">
                              Choisir une image
                              <input
                                id="logo-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="hidden"
                              />
                            </label>
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            Format recommandé: PNG ou JPEG. 1MB maximum.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Aperçu */}
              <div>
                <Card className="sticky top-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Type className="h-4 w-4" /> 
                      Aperçu en direct
                    </CardTitle>
                    <CardDescription>
                      Visualisez votre page de réservation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                      {/* En-tête de la prévisualisation */}
                      <div 
                        className="py-4 px-4 flex items-center justify-between"
                        style={{ backgroundColor: primaryColor, color: '#fff' }}
                      >
                        <div className="flex items-center gap-2">
                          {logo && (
                            <div className="h-8 w-8 rounded-full bg-white p-1">
                              <img src={logo} alt="Logo" className="h-full w-full object-contain" />
                            </div>
                          )}
                          <span className="font-bold">{businessName}</span>
                        </div>
                      </div>

                      {/* Corps de la prévisualisation */}
                      <div className="p-4 space-y-4" style={{ backgroundColor: '#fff' }}>
                        <h3 className="text-center font-medium text-lg mb-4">{welcomeMessage}</h3>
                        
                        {/* Étapes actives dans l'ordre défini par l'utilisateur */}
                        {steps.filter(step => step.enabled).map((step) => (
                          <div key={step.id} className="mb-6">
                            {step.id === 'service' && (
                              <div className="space-y-2">
                                <Label className="font-medium flex items-center gap-2">
                                  {step.icon}
                                  Sélectionnez un service
                                </Label>
                                <div className={`p-3 border ${selectedTemplate === 'premium' ? 'border-primary/20' : ''} rounded shadow-sm bg-white cursor-pointer`}>
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <h4 className="font-medium">Consultation standard</h4>
                                      <div className="text-sm text-muted-foreground">30 min - 50€</div>
                                    </div>
                                    <Check className="h-5 w-5" style={{ color: primaryColor }} />
                                  </div>
                                </div>
                                <div className="p-3 border rounded shadow-sm hover:border-primary/20 cursor-pointer">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <h4 className="font-medium">Consultation approfondie</h4>
                                      <div className="text-sm text-muted-foreground">60 min - 90€</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {step.id === 'date' && (
                              <div className="space-y-2">
                                <Label className="font-medium flex items-center gap-2">
                                  {step.icon}
                                  Sélectionnez une date
                                </Label>
                                <div className="border rounded-md overflow-hidden">
                                  <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    className="p-0"
                                    classNames={{
                                      day_selected: `bg-[${primaryColor}] text-white hover:bg-[${primaryColor}] hover:text-white focus:bg-[${primaryColor}] focus:text-white`
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                            
                            {step.id === 'time' && (
                              <div className="space-y-2">
                                <Label className="font-medium flex items-center gap-2">
                                  {step.icon}
                                  Choisissez un horaire
                                </Label>
                                <div className="grid grid-cols-3 gap-2">
                                  <Button
                                    variant="outline"
                                    className={
                                      buttonCorners === 'squared' ? 'rounded-none' : 
                                      buttonCorners === 'pill' ? 'rounded-full' : ''
                                    }
                                    style={{ 
                                      backgroundColor: primaryColor, 
                                      color: 'white',
                                      border: 'none'
                                    }}
                                  >
                                    9:00
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className={
                                      buttonCorners === 'squared' ? 'rounded-none' : 
                                      buttonCorners === 'pill' ? 'rounded-full' : ''
                                    }
                                  >
                                    10:00
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className={
                                      buttonCorners === 'squared' ? 'rounded-none' : 
                                      buttonCorners === 'pill' ? 'rounded-full' : ''
                                    }
                                  >
                                    11:00
                                  </Button>
                                </div>
                              </div>
                            )}
                            
                            {step.id === 'info' && (
                              <div className="space-y-2">
                                <Label className="font-medium flex items-center gap-2">
                                  {step.icon}
                                  Vos informations
                                </Label>
                                <div className="space-y-3">
                                  <Input placeholder="Nom complet" className="bg-white" />
                                  <Input placeholder="Email" className="bg-white" />
                                  <Input placeholder="Téléphone" className="bg-white" />
                                </div>
                              </div>
                            )}
                            
                            {step.id === 'payment' && (
                              <div className="space-y-2">
                                <Label className="font-medium flex items-center gap-2">
                                  {step.icon}
                                  Paiement
                                </Label>
                                <div className="p-3 border rounded">
                                  <p className="text-sm text-muted-foreground">Options de paiement</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <div className="h-8 w-12 bg-slate-100 rounded flex items-center justify-center text-xs">Visa</div>
                                    <div className="h-8 w-12 bg-slate-100 rounded flex items-center justify-center text-xs">MC</div>
                                    <div className="h-8 w-12 bg-slate-100 rounded flex items-center justify-center text-xs">PayPal</div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        <Button 
                          className={`w-full mt-4 ${
                            buttonCorners === 'squared' ? 'rounded-none' : 
                            buttonCorners === 'pill' ? 'rounded-full' : ''
                          }`}
                          style={{ backgroundColor: primaryColor, color: 'white', border: 'none' }}
                        >
                          {bookingButtonText}
                        </Button>
                        
                        {showConfirmation && (
                          <div className="mt-4 p-3 border border-green-200 rounded bg-green-50 text-green-700 text-sm">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 mt-0.5" />
                              <p>Aperçu du message de confirmation:<br />{confirmationMessage}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-3">
                      <Button variant="outline" size="sm" onClick={() => window.open('/preview-booking', '_blank')}>
                        Voir en plein écran
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="steps" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                {/* Configuration des étapes */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Move className="h-4 w-4" />
                      Ordre des étapes
                    </CardTitle>
                    <CardDescription>
                      Glissez-déposez pour réorganiser les étapes et activer/désactiver celles que vous souhaitez
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DndContext 
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext 
                        items={steps.map(step => step.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {steps.map((step) => (
                          <SortableStep 
                            key={step.id} 
                            step={step} 
                            onChange={handleStepChange} 
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  </CardContent>
                </Card>

                {/* Textes personnalisés */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Textes personnalisés
                    </CardTitle>
                    <CardDescription>
                      Personnalisez les textes de votre page de réservation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="business-name">Nom de l'entreprise</Label>
                      <Input 
                        id="business-name" 
                        value={businessName} 
                        onChange={(e) => setBusinessName(e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="welcome-message">Message de bienvenue</Label>
                      <Textarea 
                        id="welcome-message" 
                        value={welcomeMessage} 
                        onChange={(e) => setWelcomeMessage(e.target.value)} 
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="button-text">Texte du bouton</Label>
                      <Input 
                        id="button-text" 
                        value={bookingButtonText} 
                        onChange={(e) => setBookingButtonText(e.target.value)} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between mb-3 pt-3">
                      <div>
                        <Label htmlFor="show-confirmation" className="text-base">Afficher message de confirmation</Label>
                        <p className="text-sm text-muted-foreground">
                          Affiche un message de confirmation après la réservation
                        </p>
                      </div>
                      <Switch 
                        id="show-confirmation" 
                        checked={showConfirmation} 
                        onCheckedChange={setShowConfirmation} 
                      />
                    </div>
                    
                    {showConfirmation && (
                      <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                        <Label htmlFor="confirmation-message">Message de confirmation</Label>
                        <Textarea 
                          id="confirmation-message" 
                          value={confirmationMessage} 
                          onChange={(e) => setConfirmationMessage(e.target.value)} 
                          rows={2}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Options avancées */}
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Options avancées
                    </CardTitle>
                    <CardDescription>
                      Paramètres supplémentaires pour votre page de réservation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="page-url">URL personnalisée</Label>
                      <div className="flex">
                        <div className="bg-muted px-3 py-2 rounded-l-md border border-r-0 text-muted-foreground">
                          reservatoo.com/
                        </div>
                        <Input 
                          id="page-url"
                          placeholder="votre-entreprise" 
                          className="rounded-l-none"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Personnalisez l'URL de votre page de réservation
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="redirect-url">Page de redirection</Label>
                      <Select defaultValue="thank-you">
                        <SelectTrigger id="redirect-url">
                          <SelectValue placeholder="Choisir une page" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="thank-you">Page de remerciement</SelectItem>
                          <SelectItem value="homepage">Page d'accueil</SelectItem>
                          <SelectItem value="custom">URL personnalisée</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Après la réservation, le client sera redirigé vers cette page
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2 pt-2">
                      <div>
                        <Label htmlFor="google-analytics" className="text-base">Google Analytics</Label>
                        <p className="text-sm text-muted-foreground">
                          Activer le suivi Google Analytics
                        </p>
                      </div>
                      <Switch id="google-analytics" />
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <Label htmlFor="seo-indexation" className="text-base">Indexation SEO</Label>
                        <p className="text-sm text-muted-foreground">
                          Autoriser l'indexation par les moteurs de recherche
                        </p>
                      </div>
                      <Switch id="seo-indexation" defaultChecked />
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="seo-description">Description SEO</Label>
                      <Textarea 
                        id="seo-description"
                        placeholder="Description de votre page pour les moteurs de recherche" 
                        rows={2}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Apparaîtra dans les résultats de recherche Google
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Aperçu mobile */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Aperçu mobile
                    </CardTitle>
                    <CardDescription>
                      Visualisez l'apparence sur mobile
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <div className="border-4 border-black rounded-3xl p-2 bg-black w-[240px]">
                      <div className="overflow-hidden rounded-2xl h-[400px] bg-white">
                        <div 
                          className="py-3 px-2 flex items-center justify-between"
                          style={{ backgroundColor: primaryColor, color: '#fff' }}
                        >
                          <div className="flex items-center gap-1">
                            {logo && (
                              <div className="h-5 w-5 rounded-full bg-white p-0.5">
                                <img src={logo} alt="Logo" className="h-full w-full object-contain" />
                              </div>
                            )}
                            <span className="font-bold text-xs">{businessName}</span>
                          </div>
                        </div>
                        
                        <div className="p-2">
                          <p className="text-xs text-center mb-2 font-medium">{welcomeMessage}</p>
                          {steps[0].enabled && (
                            <div className="mb-2">
                              <p className="text-xs mb-1 font-medium">Choisir un service</p>
                              <div className="border rounded p-1.5 text-xs">Service exemple</div>
                            </div>
                          )}
                          
                          {steps.find(s => s.id === 'date')?.enabled && (
                            <div className="mb-2">
                              <p className="text-xs mb-1 font-medium">Sélectionner une date</p>
                              <div className="bg-slate-50 rounded p-1 text-center text-xs">
                                {selectedDate ? format(selectedDate, 'd MMMM yyyy', { locale: fr }) : 'Calendrier'}
                              </div>
                            </div>
                          )}
                          
                          <Button 
                            className={`w-full text-xs py-1 px-2 h-7 mt-2 ${
                              buttonCorners === 'squared' ? 'rounded-none' : 
                              buttonCorners === 'pill' ? 'rounded-full' : ''
                            }`}
                            style={{ backgroundColor: primaryColor, color: 'white', border: 'none' }}
                          >
                            {bookingButtonText}
                          </Button>
                        </div>
                      </div>
                      <div className="h-1 w-16 bg-slate-600 rounded mx-auto mt-2"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="share" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Partager votre page
                </CardTitle>
                <CardDescription>
                  Utilisez ces outils pour partager votre page avec vos clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Options de partage */}
                    <div className="space-y-6 flex-1">
                      {/* Lien direct */}
                      <div className="space-y-2">
                        <Label htmlFor="booking-link" className="text-base">Lien de réservation</Label>
                        <div className="flex">
                          <Input
                            id="booking-link"
                            value="https://reservatoo.com/votre-nom"
                            readOnly
                            className="rounded-r-none"
                          />
                          <Button
                            onClick={() => {
                              navigator.clipboard.writeText("https://reservatoo.com/votre-nom");
                              toast.success("Lien copié dans le presse-papier");
                            }}
                            className="rounded-l-none"
                            variant="outline"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Partagez ce lien par email ou messagerie
                        </p>
                      </div>
                      
                      {/* Code QR */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-base font-medium mb-1">Code QR</h3>
                          <p className="text-sm text-muted-foreground">
                            Téléchargez le code QR pour l'afficher dans votre établissement
                          </p>
                        </div>
                        
                        <div className="flex items-start gap-4">
                          <div className="border p-3 rounded bg-white">
                            <svg width="120" height="120" viewBox="0 0 100 100" style={{ width: '120px', height: '120px' }}>
                              <rect x="0" y="0" width="100" height="100" fill="white" />
                              <rect x="10" y="10" width="10" height="10" fill="black" />
                              <rect x="20" y="10" width="10" height="10" fill="black" />
                              <rect x="30" y="10" width="10" height="10" fill="black" />
                              <rect x="60" y="10" width="10" height="10" fill="black" />
                              <rect x="70" y="10" width="10" height="10" fill="black" />
                              <rect x="80" y="10" width="10" height="10" fill="black" />
                              <rect x="10" y="20" width="10" height="10" fill="black" />
                              <rect x="40" y="20" width="10" height="10" fill="black" />
                              <rect x="50" y="20" width="10" height="10" fill="black" />
                              <rect x="80" y="20" width="10" height="10" fill="black" />
                              <rect x="10" y="30" width="10" height="10" fill="black" />
                              <rect x="30" y="30" width="10" height="10" fill="black" />
                              <rect x="50" y="30" width="10" height="10" fill="black" />
                              <rect x="80" y="30" width="10" height="10" fill="black" />
                              <rect x="10" y="40" width="10" height="10" fill="black" />
                              <rect x="30" y="40" width="10" height="10" fill="black" />
                              <rect x="40" y="40" width="10" height="10" fill="black" />
                              <rect x="60" y="40" width="10" height="10" fill="black" />
                              <rect x="80" y="40" width="10" height="10" fill="black" />
                              <rect x="10" y="50" width="10" height="10" fill="black" />
                              <rect x="30" y="50" width="10" height="10" fill="black" />
                              <rect x="50" y="50" width="10" height="10" fill="black" />
                              <rect x="60" y="50" width="10" height="10" fill="black" />
                              <rect x="70" y="50" width="10" height="10" fill="black" />
                              <rect x="80" y="50" width="10" height="10" fill="black" />
                              <rect x="10" y="60" width="10" height="10" fill="black" />
                              <rect x="80" y="60" width="10" height="10" fill="black" />
                              <rect x="10" y="70" width="10" height="10" fill="black" />
                              <rect x="30" y="70" width="10" height="10" fill="black" />
                              <rect x="40" y="70" width="10" height="10" fill="black" />
                              <rect x="50" y="70" width="10" height="10" fill="black" />
                              <rect x="60" y="70" width="10" height="10" fill="black" />
                              <rect x="80" y="70" width="10" height="10" fill="black" />
                              <rect x="10" y="80" width="10" height="10" fill="black" />
                              <rect x="20" y="80" width="10" height="10" fill="black" />
                              <rect x="30" y="80" width="10" height="10" fill="black" />
                              <rect x="40" y="80" width="10" height="10" fill="black" />
                              <rect x="50" y="80" width="10" height="10" fill="black" />
                              <rect x="60" y="80" width="10" height="10" fill="black" />
                              <rect x="70" y="80" width="10" height="10" fill="black" />
                              <rect x="80" y="80" width="10" height="10" fill="black" />
                            </svg>
                          </div>
                          
                          <div className="space-y-2">
                            <Button onClick={() => toast.success("Code QR téléchargé")} variant="outline" className="w-full">
                              <Download className="h-4 w-4 mr-2" />
                              Télécharger PNG
                            </Button>
                            <Button onClick={() => toast.success("Code QR téléchargé")} variant="outline" className="w-full">
                              <FileText className="h-4 w-4 mr-2" />
                              Télécharger PDF
                            </Button>
                            <Button onClick={() => toast.success("Code QR imprimé")} variant="outline" className="w-full">
                              <Printer className="h-4 w-4 mr-2" />
                              Imprimer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Réseaux sociaux */}
                    <div className="space-y-4 flex-1">
                      <div>
                        <h3 className="text-base font-medium mb-1">Réseaux sociaux</h3>
                        <p className="text-sm text-muted-foreground">
                          Partagez votre page de réservation sur vos réseaux sociaux
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="justify-start">
                          <svg className="h-5 w-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                            <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                          </svg>
                          Facebook
                        </Button>
                        
                        <Button variant="outline" className="justify-start">
                          <svg className="h-5 w-5 mr-2" fill="#1DA1F2" viewBox="0 0 24 24">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                          X / Twitter
                        </Button>
                        
                        <Button variant="outline" className="justify-start">
                          <svg className="h-5 w-5 mr-2" fill="#E1306C" viewBox="0 0 24 24">
                            <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.8995 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.224 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z" />
                          </svg>
                          Instagram
                        </Button>
                        
                        <Button variant="outline" className="justify-start">
                          <svg className="h-5 w-5 mr-2" fill="#0A66C2" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                          LinkedIn
                        </Button>
                        
                        <Button variant="outline" className="justify-start">
                          <svg className="h-5 w-5 mr-2" fill="#25D366" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-1.016-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                          </svg>
                          WhatsApp
                        </Button>
                        
                        <Button variant="outline" className="justify-start">
                          <Mail className="h-5 w-5 mr-2" />
                          Email
                        </Button>
                        
                        <Button variant="outline" className="justify-start">
                          <Share2 className="h-5 w-5 mr-2" />
                          Autre...
                        </Button>
                      </div>
                      
                      <div className="mt-4">
                        <h3 className="text-base font-medium mb-1">Widget pour votre site web</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Intégrez un bouton de réservation sur votre site web
                        </p>
                        
                        <div className="border rounded-md p-3 bg-slate-50">
                          <Label htmlFor="widget-code" className="text-xs mb-1 block">
                            Code d'intégration
                          </Label>
                          <div className="relative">
                            <Textarea 
                              id="widget-code"
                              className="pr-8 font-mono text-xs h-24"
                              value={`<script src="https://reservatoo.com/widget.js" data-id="votre-id"></script>`}
                              readOnly
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute top-2 right-2 h-6 w-6 p-0"
                              onClick={() => {
                                navigator.clipboard.writeText(`<script src="https://reservatoo.com/widget.js" data-id="votre-id"></script>`);
                                toast.success("Code copié dans le presse-papier");
                              }}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">
                              Collez ce code dans votre site web pour afficher un bouton de réservation
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave}>Enregistrer les modifications</Button>
        </div>
      </CardContent>
    </Card>
  );
}
