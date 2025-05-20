
import { format, addMinutes, setHours, setMinutes } from 'date-fns';

// Fonction pour générer des créneaux horaires disponibles pour une date donnée
export const getAvailableTimeSlots = (date: Date, serviceDuration: number): string[] => {
  // Cette fonction est une simulation - dans un environnement réel,
  // elle devrait vérifier la base de données pour les créneaux déjà réservés,
  // les heures d'ouverture, etc.

  // Simulons les horaires d'ouverture pour la journée sélectionnée
  const today = new Date();
  const isToday = date.getDate() === today.getDate() && 
                 date.getMonth() === today.getMonth() && 
                 date.getFullYear() === today.getFullYear();
  
  // Si c'est aujourd'hui, ne proposer que des créneaux futurs
  const currentHour = isToday ? today.getHours() : 0;
  const currentMinute = isToday ? today.getMinutes() : 0;
  
  // Déterminer le jour de la semaine (0 = dimanche, 1 = lundi, etc.)
  const dayOfWeek = date.getDay();
  
  // Définir les horaires d'ouverture selon le jour de la semaine
  let startHour = 9; // Par défaut, ouvre à 9h
  let endHour = 18;  // Par défaut, ferme à 18h
  
  // Samedi (6)
  if (dayOfWeek === 6) {
    startHour = 10;
    endHour = 15;
  } 
  // Dimanche (0)
  else if (dayOfWeek === 0) {
    // Fermé le dimanche, renvoyer un tableau vide
    return [];
  }
  
  const availableSlots: string[] = [];
  let slotTime = new Date(date);
  
  // Définir l'heure de début
  slotTime = setHours(slotTime, startHour);
  slotTime = setMinutes(slotTime, 0);
  
  // Si nous sommes aujourd'hui et qu'il est déjà tard, ajuster l'heure de début
  if (isToday && currentHour >= startHour) {
    // Arrondir à l'heure ou la demi-heure suivante
    const nextHour = currentHour;
    const nextMinute = currentMinute < 30 ? 30 : 0;
    const nextHourAdjustment = nextMinute === 0 && currentMinute > 30 ? 1 : 0;
    
    slotTime = setHours(slotTime, nextHour + nextHourAdjustment);
    slotTime = setMinutes(slotTime, nextMinute);
    
    // Ajouter 15 minutes de marge
    slotTime = addMinutes(slotTime, 15);
  }
  
  // Générer les créneaux horaires disponibles
  while (slotTime.getHours() < endHour) {
    // Formater l'heure au format "HH:MM"
    const timeString = format(slotTime, 'HH:mm');
    availableSlots.push(timeString);
    
    // Avancer de 30 minutes pour le prochain créneau
    slotTime = addMinutes(slotTime, 30);
  }
  
  // Simuler quelques créneaux déjà réservés
  const randomUnavailable = Math.floor(Math.random() * availableSlots.length);
  if (randomUnavailable < availableSlots.length) {
    availableSlots.splice(randomUnavailable, 1);
  }
  
  return availableSlots;
};

// Fonction pour vérifier si un créneau spécifique est disponible
export const isTimeSlotAvailable = (date: Date, time: string): boolean => {
  // Cette fonction devrait vérifier dans une base de données si le créneau est disponible
  // Ici, nous utilisons une simulation
  return Math.random() > 0.2; // 80% de chance que le créneau soit disponible
};

// Fonction pour réserver un créneau horaire
export const bookTimeSlot = async (
  serviceId: string, 
  date: Date, 
  time: string, 
  clientInfo: {
    name: string;
    email: string;
    phone?: string;
    notes?: string;
  }
): Promise<boolean> => {
  // Cette fonction devrait enregistrer la réservation dans une base de données
  // Ici, nous simulons simplement un succès après une courte attente
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Réservation enregistrée:", {
        serviceId,
        date: format(date, "yyyy-MM-dd"),
        time,
        clientInfo
      });
      resolve(true);
    }, 1000);
  });
};
