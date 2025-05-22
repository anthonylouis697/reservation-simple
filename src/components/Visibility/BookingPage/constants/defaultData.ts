
import { BookingCustomTexts } from "../types";

export const defaultCustomTexts: BookingCustomTexts = {
  // Service step
  serviceSelectionTitle: "Choisissez un service",
  serviceSelectionDescription: "Sélectionnez le service que vous souhaitez réserver",
  
  // Date step
  dateSelectionTitle: "Choisissez une date",
  dateSelectionDescription: "Sélectionnez la date qui vous convient",
  
  // Time step
  timeSelectionTitle: "Sélection de l'horaire",
  timeSelectionDescription: "Choisissez un horaire disponible",
  noAvailableTimesMessage: "Aucun horaire disponible pour cette date",
  
  // Client info step
  clientInfoTitle: "Vos informations",
  clientInfoDescription: "Merci de renseigner vos coordonnées",
  
  // Confirmation
  confirmationTitle: "Réservation confirmée",
  confirmationMessage: "Votre réservation a été enregistrée avec succès. Un email de confirmation vous a été envoyé.",
  
  // Labels
  selectServiceLabel: "Service",
  selectDateLabel: "Date",
  selectTimeLabel: "Heure",
  clientInfoLabel: "Informations",
  paymentMethodLabel: "Paiement"
};
