
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { Check, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { Service, Category } from '@/types/service';
import { useBookingPage } from '@/components/Visibility/BookingPage/BookingPageContext';
import { BookingPageProvider } from '@/components/Visibility/BookingPage/BookingPageContext';
import { createBooking, checkAvailability, BookingData } from '@/services/bookingService';
import { usePublicBookingData } from '@/components/Visibility/BookingPage/PublicBookingData';
import { getAvailableTimeSlots } from '@/utils/availability';
import { supabase } from '@/integrations/supabase/client';

const BookingContent = () => {
  const { businessSlug } = useParams();
  
  // Récupération des données de style de la page de réservation
  const { 
    businessName, 
    welcomeMessage, 
    primaryColor, 
    secondaryColor, 
    buttonCorners, 
    logo, 
    bookingButtonText,
    showConfirmation,
    confirmationMessage,
    layoutType,
    steps,
    customTexts
  } = useBookingPage();

  // Récupération des services et catégories depuis la base de données
  const { services, categories, isLoading: isLoadingData } = usePublicBookingData();
  
  // États pour le processus de réservation
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // États pour les informations du client
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');

  // État pour le succès de la réservation
  const [bookingComplete, setBookingComplete] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);

  // Réinitialiser le service sélectionné lorsque la catégorie change
  useEffect(() => {
    setSelectedService(null);
  }, [selectedCategory]);

  // Filtrage des services par catégorie sélectionnée
  const filteredServices = selectedCategory
    ? services.filter(service => service.isActive && service.categoryId === selectedCategory)
    : services.filter(service => service.isActive);

  // Filtre des catégories actives
  const activeCategories = categories.filter(cat => cat.isActive);
  
  // Styles dynamiques basés sur la configuration
  const getButtonStyle = () => {
    let roundedClass = '';
    
    switch (buttonCorners) {
      case 'squared': roundedClass = 'rounded-none'; break;
      case 'rounded': roundedClass = 'rounded-md'; break;
      case 'pill': roundedClass = 'rounded-full'; break;
      default: roundedClass = 'rounded-md';
    }
    
    return {
      className: `${roundedClass} transition-colors`,
      style: { backgroundColor: primaryColor, borderColor: primaryColor }
    };
  };
  
  // Mise à jour des créneaux horaires disponibles lorsque la date est sélectionnée
  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (selectedDate && selectedService) {
        setIsLoadingTimes(true);
        try {
          // Obtenir tous les créneaux potentiels
          const allSlots = getAvailableTimeSlots(selectedDate, selectedService.duration);
          
          // Vérifier la disponibilité réelle de chaque créneau
          const availabilityPromises = allSlots.map(async (slot) => {
            const isAvailable = await checkAvailability(selectedDate, slot, selectedService.duration);
            return { time: slot, available: isAvailable };
          });
          
          const availabilityResults = await Promise.all(availabilityPromises);
          const available = availabilityResults
            .filter(result => result.available)
            .map(result => result.time);
          
          setAvailableTimes(available);
        } catch (error) {
          console.error("Error fetching available times:", error);
          toast.error("Erreur lors du chargement des horaires disponibles");
        } finally {
          setIsLoadingTimes(false);
        }
        
        setSelectedTime(null);  // Réinitialiser le temps sélectionné
      }
    };
    
    fetchAvailableTimes();
  }, [selectedDate, selectedService]);

  // Fonction pour passer à l'étape suivante
  const handleNextStep = () => {
    // Validation de l'étape actuelle
    if (currentStep === 0 && !selectedService) {
      toast.error("Veuillez sélectionner un service");
      return;
    }
    
    if (currentStep === 1 && !selectedDate) {
      toast.error("Veuillez sélectionner une date");
      return;
    }
    
    if (currentStep === 2 && !selectedTime) {
      toast.error("Veuillez sélectionner un horaire");
      return;
    }
    
    if (currentStep === 3 && (!clientName || !clientEmail)) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // Si nous sommes à la dernière étape, finaliser la réservation
    if (currentStep === steps.filter(step => step.enabled).length - 1) {
      handleBooking();
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };

  // Fonction pour revenir à l'étape précédente
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Fonction pour soumettre la réservation
  const handleBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !clientName || !clientEmail) {
      toast.error("Informations incomplètes. Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setIsBooking(true);
    
    try {
      // Vérifier à nouveau la disponibilité avant de finaliser
      const isAvailable = await checkAvailability(selectedDate, selectedTime, selectedService.duration);
      
      if (!isAvailable) {
        toast.error("Ce créneau n'est plus disponible. Veuillez en choisir un autre.");
        // Retour à l'étape de sélection d'horaire
        setCurrentStep(2);
        setIsBooking(false);
        return;
      }
      
      // Préparer les données de réservation
      const bookingData: BookingData = {
        serviceId: selectedService.id,
        date: selectedDate,
        time: selectedTime,
        client: {
          name: clientName,
          email: clientEmail,
          phone: clientPhone || undefined,
          notes: clientNotes || undefined
        }
      };
      
      // Enregistrer la réservation
      const booking = await createBooking(bookingData);
      
      // Afficher le message de confirmation
      setBookingComplete(true);
      toast.success("Votre réservation a été enregistrée avec succès!");
      
      console.log("Réservation enregistrée:", booking);
    } catch (error) {
      console.error("Erreur lors de la création de la réservation:", error);
      toast.error("Une erreur est survenue lors de la réservation. Veuillez réessayer.");
    } finally {
      setIsBooking(false);
    }
  };

  // Fonction pour recommencer le processus
  const handleStartOver = () => {
    setSelectedCategory(null);
    setSelectedService(null);
    setSelectedDate(undefined);
    setSelectedTime(null);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setClientNotes('');
    setCurrentStep(0);
    setBookingComplete(false);
  };

  // Affichage du label de l'étape en cours
  const getStepLabel = (index: number) => {
    const activeSteps = steps.filter(step => step.enabled);
    if (index >= 0 && index < activeSteps.length) {
      return activeSteps[index].customLabel || activeSteps[index].name;
    }
    return "";
  };

  // Récupération de l'icône de l'étape en cours
  const getCurrentStepIcon = () => {
    const activeSteps = steps.filter(step => step.enabled);
    if (currentStep >= 0 && currentStep < activeSteps.length) {
      const StepIcon = activeSteps[currentStep].icon;
      return <StepIcon className="h-6 w-6" />;
    }
    return null;
  };

  // Si les données sont en chargement
  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement des services disponibles...</p>
        </div>
      </div>
    );
  }

  // Si aucun service n'est disponible
  if (services.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Aucun service disponible</h2>
          <p className="text-gray-600 mb-6">
            Cette entreprise n'a pas encore configuré ses services de réservation. 
            Veuillez réessayer ultérieurement ou contacter directement l'entreprise.
          </p>
        </div>
      </div>
    );
  }

  // Affichage du contenu en fonction de l'étape du processus
  const renderStepContent = () => {
    const activeSteps = steps.filter(step => step.enabled);
    
    if (bookingComplete) {
      return (
        <div className="text-center py-8">
          <div className="mx-auto bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Réservation confirmée!</h2>
          <p className="text-gray-600 mb-6">{confirmationMessage}</p>
          <Button onClick={handleStartOver} {...getButtonStyle()}>
            Nouvelle réservation
          </Button>
        </div>
      );
    }

    switch (currentStep) {
      case 0: // Sélection du service
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              {customTexts.selectServiceLabel || "Sélectionnez un service"}
            </h2>
            
            {activeCategories.length > 0 && (
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    onClick={() => setSelectedCategory(null)}
                    size="sm"
                    {...(!selectedCategory ? getButtonStyle() : {})}
                  >
                    Tous
                  </Button>
                  {activeCategories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.id)}
                      size="sm"
                      {...(selectedCategory === category.id ? getButtonStyle() : {})}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid gap-4 md:grid-cols-2">
              {filteredServices.map((service) => (
                <Card 
                  key={service.id} 
                  className={`cursor-pointer hover:shadow-md transition-all ${selectedService?.id === service.id ? 'ring-2' : ''}`}
                  style={{ borderColor: selectedService?.id === service.id ? primaryColor : undefined }}
                  onClick={() => setSelectedService(service)}
                >
                  <CardHeader>
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {service.duration} min
                    </div>
                    <div className="font-medium">{service.price} €</div>
                  </CardFooter>
                </Card>
              ))}

              {filteredServices.length === 0 && (
                <div className="col-span-2 text-center p-6 border rounded-lg">
                  <p>Aucun service disponible dans cette catégorie.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 1: // Sélection de la date
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              {customTexts.selectDateLabel || "Sélectionnez une date"}
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="border rounded-md p-2 flex-1">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    // Désactiver les dates passées
                    return date < new Date(new Date().setHours(0, 0, 0, 0));
                  }}
                  locale={fr}
                  className="p-3 pointer-events-auto"
                />
              </div>
              
              <div className="flex-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Détails du service</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Service:</span>
                        <span className="font-medium">{selectedService?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Durée:</span>
                        <span>{selectedService?.duration} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Prix:</span>
                        <span className="font-medium">{selectedService?.price} €</span>
                      </div>
                      {selectedDate && (
                        <div className="flex justify-between">
                          <span>Date:</span>
                          <span>{format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 2: // Sélection de l'horaire
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              {customTexts.selectTimeLabel || "Sélectionnez un horaire"}
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                {isLoadingTimes ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p>Chargement des horaires disponibles...</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                        {...(selectedTime === time ? getButtonStyle() : {})}
                        className="w-full"
                      >
                        {time}
                      </Button>
                    ))}
                    
                    {!isLoadingTimes && availableTimes.length === 0 && (
                      <div className="col-span-4 text-center p-6 border rounded-lg">
                        <p>Aucun horaire disponible pour cette date. Veuillez sélectionner une autre date.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Récapitulatif</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Service:</span>
                        <span className="font-medium">{selectedService?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: fr }) : ''}</span>
                      </div>
                      {selectedTime && (
                        <div className="flex justify-between">
                          <span>Heure:</span>
                          <span className="font-medium">{selectedTime}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between">
                        <span>Prix:</span>
                        <span className="font-medium">{selectedService?.price} €</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 3: // Informations du client
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              {customTexts.clientInfoLabel || "Vos informations"}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">Nom complet*</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Votre nom et prénom"
                  required
                />
              </div>
              <div>
                <Label htmlFor="clientEmail">Email*</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="clientPhone">Téléphone</Label>
                <Input
                  id="clientPhone"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="Votre numéro de téléphone"
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="clientNotes">Notes ou demandes particulières</Label>
                <Textarea
                  id="clientNotes"
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="Informations supplémentaires..."
                  rows={3}
                />
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Récapitulatif de la réservation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{selectedDate ? format(selectedDate, "EEEE d MMMM yyyy", { locale: fr }) : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heure:</span>
                    <span>{selectedTime}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Prix total:</span>
                    <span className="font-medium text-lg">{selectedService?.price} €</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  // Rendu de la navigation des étapes
  const renderStepNavigation = () => {
    const activeSteps = steps.filter(step => step.enabled);
    
    return (
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <div className="flex items-center gap-2">
          {getCurrentStepIcon()}
          <span className="font-medium">{getStepLabel(currentStep)}</span>
        </div>
        
        <div className="flex gap-2">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={isBooking}
            >
              Précédent
            </Button>
          )}
          
          <Button 
            onClick={handleNextStep}
            disabled={isBooking}
            {...getButtonStyle()}
          >
            {isBooking ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Traitement...
              </>
            ) : currentStep === activeSteps.length - 1 ? (
              bookingButtonText
            ) : (
              "Suivant"
            )}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="max-w-4xl mx-auto p-4 md:p-8" 
      style={{ 
        '--primary-color': primaryColor,
        '--secondary-color': secondaryColor
      } as React.CSSProperties}
    >
      {/* En-tête */}
      <div className="mb-8 text-center">
        {logo && (
          <div className="mb-4 flex justify-center">
            <img src={logo} alt={businessName} className="h-16" />
          </div>
        )}
        <h1 className="text-3xl font-bold" style={{ color: primaryColor }}>{businessName}</h1>
        {welcomeMessage && <p className="mt-2 text-gray-600">{welcomeMessage}</p>}
      </div>
      
      {/* Contenu de l'étape en cours */}
      {renderStepContent()}
      
      {/* Navigation des étapes */}
      {!bookingComplete && renderStepNavigation()}
    </div>
  );
};

const PublicBooking = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const [businessFound, setBusinessFound] = useState(true);
  
  useEffect(() => {
    const checkBusiness = async () => {
      try {
        // Vérifier si l'entreprise existe
        if (businessSlug) {
          const { data, error } = await supabase
            .from('businesses')
            .select('id')
            .eq('slug', businessSlug)
            .single();
            
          if (error || !data) {
            console.error("Entreprise introuvable:", error);
            setBusinessFound(false);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'entreprise:", error);
        setBusinessFound(false);
      } finally {
        // Simuler un temps de chargement pour les données
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };
    
    checkBusiness();
  }, [businessSlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Chargement de la page de réservation...</p>
        </div>
      </div>
    );
  }
  
  if (!businessFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Entreprise introuvable</h2>
          <p className="text-gray-600 mb-6">
            Nous n'avons pas trouvé d'entreprise correspondant à cette adresse. 
            Veuillez vérifier l'URL ou contacter l'entreprise pour plus d'informations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BookingPageProvider>
      <div className="min-h-screen bg-gray-50">
        <Helmet>
          <title>Réservation en ligne</title>
        </Helmet>
        <BookingContent />
      </div>
    </BookingPageProvider>
  );
};

export default PublicBooking;
