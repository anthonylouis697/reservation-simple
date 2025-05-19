
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, ArrowRight, Book, Info, HelpCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useState } from "react";

interface QuickHelpProps {
  open: boolean;
  onClose: () => void;
}

export function QuickHelp({ open, onClose }: QuickHelpProps) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Déterminer le contenu d'aide contextuelle basé sur la page actuelle
  const getContextualHelp = () => {
    const path = location.pathname;
    
    if (path === "/dashboard") {
      return {
        title: "Tableau de bord",
        description: "Vue d'ensemble de votre activité et de vos prochains rendez-vous",
        faqs: [
          {
            question: "Comment ajouter un nouveau rendez-vous ?",
            answer: "Cliquez sur le bouton '+ Nouveau rendez-vous' en haut à droite du tableau de bord, ou accédez à la page Calendrier pour plus d'options."
          },
          {
            question: "Comment voir mes rendez-vous pour une date spécifique ?",
            answer: "Utilisez le mini-calendrier sur la droite pour sélectionner une date, puis cliquez sur 'Ouvrir le calendrier' pour voir tous les rendez-vous pour cette date."
          },
          {
            question: "Comment compléter mon profil ?",
            answer: "Suivez les étapes indiquées dans la section 'Guide de mise en route'. Cliquez sur 'Configurer' à côté de chaque étape non complétée."
          }
        ]
      };
    } else if (path === "/calendar") {
      return {
        title: "Calendrier",
        description: "Gérez vos disponibilités et vos rendez-vous",
        faqs: [
          {
            question: "Comment créer un nouveau rendez-vous ?",
            answer: "Cliquez sur un créneau horaire disponible dans le calendrier, puis remplissez les informations du rendez-vous dans le formulaire qui s'affiche."
          },
          {
            question: "Comment définir mes heures de disponibilité ?",
            answer: "Allez dans 'Paramètres' puis 'Disponibilité' pour configurer vos heures d'ouverture pour chaque jour de la semaine."
          },
          {
            question: "Comment bloquer certaines dates ?",
            answer: "Dans la vue calendrier, sélectionnez la date ou le créneau que vous souhaitez bloquer, puis choisissez 'Bloquer ce créneau' dans le menu contextuel."
          }
        ]
      };
    } else if (path === "/visibility-boost") {
      return {
        title: "Boost de Visibilité",
        description: "Augmentez votre visibilité sur les plateformes partenaires",
        faqs: [
          {
            question: "Comment fonctionne le Boost de Visibilité ?",
            answer: "Cette fonctionnalité vous permet de publier vos services automatiquement sur plusieurs plateformes partenaires pour attirer plus de clients."
          },
          {
            question: "Quels sont les frais associés ?",
            answer: "Le service coûte 29€ par mois, plus une commission de 2% sur les réservations issues des plateformes partenaires."
          },
          {
            question: "Comment suivre les performances de mes annonces ?",
            answer: "Dans la section 'Analytiques' du Boost de Visibilité, vous pouvez consulter le nombre de vues, de clics et de réservations générées par chaque plateforme."
          }
        ]
      };
    } else if (path === "/settings") {
      return {
        title: "Paramètres",
        description: "Personnalisez votre compte et vos services",
        faqs: [
          {
            question: "Comment changer mon mot de passe ?",
            answer: "Dans l'onglet 'Profil', faites défiler jusqu'à la section 'Sécurité', puis cliquez sur 'Modifier le mot de passe'."
          },
          {
            question: "Comment ajouter un nouveau service ?",
            answer: "Allez dans l'onglet 'Services', puis cliquez sur 'Ajouter un service'. Remplissez ensuite les détails du service comme le nom, la durée et le prix."
          },
          {
            question: "Comment personnaliser ma page de réservation ?",
            answer: "Dans l'onglet 'Booking Customization', vous pouvez modifier les couleurs, ajouter votre logo et personnaliser le texte de votre page de réservation."
          }
        ]
      };
    }
    
    // Aide par défaut si aucune page spécifique n'est reconnue
    return {
      title: "Centre d'aide",
      description: "Trouvez des réponses à vos questions",
      faqs: [
        {
          question: "Comment démarrer avec BookWise ?",
          answer: "Commencez par compléter votre profil dans 'Paramètres', puis configurez vos services et vos disponibilités. Vous serez prêt à recevoir des réservations !"
        },
        {
          question: "Comment contacter le support ?",
          answer: "Vous pouvez nous contacter par email à support@bookwise.com ou utiliser le chat en direct disponible en bas à droite de votre écran pendant les heures d'ouverture."
        },
        {
          question: "Comment annuler un abonnement ?",
          answer: "Allez dans 'Paramètres' > 'Abonnement', puis cliquez sur 'Gérer l'abonnement' et suivez les instructions pour annuler."
        }
      ]
    };
  };
  
  const contextualHelp = getContextualHelp();
  
  // Filtrer les FAQs selon la recherche
  const filteredFaqs = searchQuery 
    ? contextualHelp.faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : contextualHelp.faqs;
  
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Aide et Support</SheetTitle>
          <SheetDescription>
            {contextualHelp.description}
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans l'aide..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium flex items-center mb-2">
              <HelpCircle className="mr-2 h-5 w-5" />
              FAQ sur {contextualHelp.title}
            </h3>
            
            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucun résultat pour "{searchQuery}"</p>
                <p className="text-sm mt-2">Essayez d'autres termes ou consultez notre centre d'aide complet</p>
              </div>
            )}
          </div>
          
          <div className="border rounded-lg p-4 bg-muted/20">
            <h3 className="text-lg font-medium flex items-center mb-2">
              <Info className="mr-2 h-5 w-5" />
              Ressources
            </h3>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <Book className="mr-2 h-4 w-4" />
                  Guide d'utilisation
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <Book className="mr-2 h-4 w-4" />
                  Tutoriels vidéo
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <SheetFooter className="mt-6">
          <div className="w-full">
            <Button className="w-full">
              Contacter le support
            </Button>
            
            <SheetClose asChild>
              <Button variant="ghost" className="w-full mt-2">
                Fermer
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
