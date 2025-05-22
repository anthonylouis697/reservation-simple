
import { BookingCustomTexts, BookingStep, Steps } from '../types';

export const defaultCustomTexts: BookingCustomTexts = {
  selectServiceLabel: "Choisissez un service",
  selectDateLabel: "Sélectionnez une date",
  selectTimeLabel: "Sélectionnez un horaire",
  clientInfoLabel: "Vos informations",
  serviceSelectionTitle: "Services disponibles",
  serviceSelectionDescription: "Choisissez un service pour continuer",
  dateSelectionTitle: "Sélection de la date",
  dateSelectionDescription: "Choisissez une date pour votre rendez-vous",
  timeSelectionTitle: "Sélection de l'horaire",
  timeSelectionDescription: "Choisissez un horaire disponible",
  noAvailableTimesMessage: "Aucun horaire disponible pour cette date",
  clientInfoTitle: "Vos informations",
  clientInfoDescription: "Merci de remplir tous les champs obligatoires",
  confirmationTitle: "Réservation confirmée",
  confirmationMessage: "Votre réservation a bien été enregistrée. Merci!"
};

export const defaultBookingSteps: BookingStep[] = [
  {
    id: "service",
    name: "Service",
    type: Steps.SERVICE,
    enabled: true,
    required: true,
    position: 0
  },
  {
    id: "date",
    name: "Date",
    type: Steps.DATE,
    enabled: true,
    required: true,
    position: 1
  },
  {
    id: "time",
    name: "Horaire",
    type: Steps.TIME,
    enabled: true,
    required: true,
    position: 2
  },
  {
    id: "client_info",
    name: "Informations",
    type: Steps.CLIENT_INFO,
    enabled: true,
    required: true,
    position: 3
  }
];

export const defaultTemplates = [
  {
    id: "standard",
    name: "Standard",
    description: "Template standard avec une mise en page claire et professionnelle",
    style: "clean",
    colors: {
      primary: "#4f46e5",
      secondary: "#ffffff"
    }
  },
  {
    id: "modern",
    name: "Moderne",
    description: "Design épuré avec des couleurs contemporaines",
    style: "modern",
    colors: {
      primary: "#0ea5e9",
      secondary: "#f8fafc"
    }
  },
  {
    id: "elegant",
    name: "Élégant",
    description: "Un design sophistiqué pour une clientèle exigeante",
    style: "elegant",
    colors: {
      primary: "#8b5cf6",
      secondary: "#f3f4f6"
    }
  }
];
