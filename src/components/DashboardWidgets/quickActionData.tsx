import React from 'react';
import { Calendar, UserPlus, Settings, BarChart3, Tag, Trash2 } from "lucide-react";
import { QuickActionProps } from "./QuickAction";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { initialServices, initialCategories } from "@/mock/serviceData";

export const resetMockData = async (businessId: string) => {
  try {
    // Suppression des services existants
    const { error: deleteServicesError } = await supabase
      .from('services')
      .delete()
      .eq('business_id', businessId);
    
    if (deleteServicesError) throw deleteServicesError;
    
    // Suppression des catégories existantes
    const { error: deleteCategoriesError } = await supabase
      .from('service_categories')
      .delete()
      .eq('business_id', businessId);
    
    if (deleteCategoriesError) throw deleteCategoriesError;
    
    // Création des catégories depuis les données fictives
    const categoriesToInsert = initialCategories.map(category => ({
      name: category.name,
      description: category.description || null,
      business_id: businessId,
      position: category.order || 0
    }));
    
    const { data: insertedCategories, error: insertCategoriesError } = await supabase
      .from('service_categories')
      .insert(categoriesToInsert)
      .select();
      
    if (insertCategoriesError) throw insertCategoriesError;
    
    // Mapping des anciens IDs aux nouveaux IDs de catégories
    const categoryIdMap = initialCategories.reduce((map, category, index) => {
      if (insertedCategories && insertedCategories[index]) {
        map[category.id] = insertedCategories[index].id;
      }
      return map;
    }, {} as Record<string, string>);
    
    // Création des services depuis les données fictives
    const servicesToInsert = initialServices.map(service => ({
      name: service.name,
      description: service.description || null,
      business_id: businessId,
      duration: service.duration,
      price: service.price,
      is_active: service.isActive,
      category_id: service.categoryId ? categoryIdMap[service.categoryId] : null,
      position: 0
    }));
    
    const { error: insertServicesError } = await supabase
      .from('services')
      .insert(servicesToInsert);
      
    if (insertServicesError) throw insertServicesError;
    
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
      onClick: () => navigateFunction("/settings?tab=services"),
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

  // Ajouter l'action de réinitialisation si l'ID de l'entreprise est disponible
  if (businessId) {
    actions.push({
      icon: <Trash2 className="h-5 w-5 text-red-600" />,
      label: "Réinitialiser données",
      description: "Remplacer par les données de démo",
      onClick: () => {
        if (window.confirm("Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action supprimera tous vos services et catégories existants.")) {
          resetMockData(businessId);
        }
      },
      color: "bg-red-100"
    });
  }

  return actions;
};
