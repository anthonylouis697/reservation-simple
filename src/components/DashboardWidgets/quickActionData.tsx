import React from 'react';
import { Calendar, UserPlus, Settings, BarChart3, Tag, Trash2 } from "lucide-react";
import { QuickActionProps } from "./QuickAction";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { initialServices, initialCategories } from "@/mock/serviceData";

export const resetMockData = async (businessId: string) => {
  try {
    toast.info("Suppression des données en cours...");
    
    // Suppression des réservations existantes
    const { error: deleteReservationsError } = await supabase
      .from('reservations')
      .delete()
      .eq('business_id', businessId);
    
    if (deleteReservationsError) {
      console.error("Erreur lors de la suppression des réservations:", deleteReservationsError);
      throw deleteReservationsError;
    }

    // Suppression des clients existants
    const { error: deleteClientsError } = await supabase
      .from('clients')
      .delete()
      .eq('business_id', businessId);
    
    if (deleteClientsError) {
      console.error("Erreur lors de la suppression des clients:", deleteClientsError);
      throw deleteClientsError;
    }
    
    // Suppression des services existants
    const { error: deleteServicesError } = await supabase
      .from('services')
      .delete()
      .eq('business_id', businessId);
    
    if (deleteServicesError) {
      console.error("Erreur lors de la suppression des services:", deleteServicesError);
      throw deleteServicesError;
    }
    
    // Suppression des catégories existantes
    const { error: deleteCategoriesError } = await supabase
      .from('service_categories')
      .delete()
      .eq('business_id', businessId);
    
    if (deleteCategoriesError) {
      console.error("Erreur lors de la suppression des catégories:", deleteCategoriesError);
      throw deleteCategoriesError;
    }
    
    // Vider le stockage local (réservations de démo)
    localStorage.removeItem('bookings');
    
    toast.success("Données réinitialisées avec succès");
    return true;
  } catch (error) {
    console.error("Erreur lors de la réinitialisation des données:", error);
    toast.error("Échec de la réinitialisation des données");
    return false;
  }
};

export const getQuickActions = (navigateFunction: (path: string) => void, businessId?: string): QuickActionProps[] => {
  const actions: QuickActionProps[] = [
    {
      icon: <Calendar className="h-5 w-5 text-blue-600" />,
      label: "Nouveau rendez-vous",
      description: "Créer un nouveau rendez-vous",
      onClick: () => navigateFunction("/calendar"),
      color: "bg-blue-100"
    },
    {
      icon: <UserPlus className="h-5 w-5 text-green-600" />,
      label: "Nouveau client",
      description: "Ajouter un client à votre base",
      onClick: () => navigateFunction("/clients"),
      color: "bg-green-100"
    },
    {
      icon: <Tag className="h-5 w-5 text-purple-600" />,
      label: "Nouveau service",
      description: "Créer ou modifier vos services",
      onClick: () => navigateFunction("/services"),
      color: "bg-purple-100"
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-amber-600" />,
      label: "Statistiques",
      description: "Voir vos données d'activité",
      onClick: () => navigateFunction("/statistics"),
      color: "bg-amber-100"
    },
    {
      icon: <Settings className="h-5 w-5 text-indigo-600" />,
      label: "Paramètres",
      description: "Configurer votre compte",
      onClick: () => navigateFunction("/settings"),
      color: "bg-indigo-100"
    }
  ];

  return actions;
};
