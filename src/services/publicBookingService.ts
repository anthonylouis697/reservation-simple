
import { supabase } from "@/integrations/supabase/client";
import { Service, Category } from "@/types/service";

/**
 * Récupère les services depuis la base de données pour l'affichage sur la page de réservation publique
 */
export const getPublicServices = async (businessId: string): Promise<Service[]> => {
  try {
    // Récupérer les services depuis Supabase
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .select(`
        *,
        service_categories(*)
      `)
      .eq('business_id', businessId)
      .order('position');
      
    if (servicesError) throw servicesError;
    
    if (!servicesData) return [];
    
    // Transformer les données pour correspondre au format Service[]
    const services: Service[] = servicesData.map(service => ({
      id: service.id,
      name: service.name,
      description: service.description || '',
      duration: service.duration,
      price: service.price,
      location: 'Cabinet principal', // Valeur par défaut
      capacity: 1, // Valeur par défaut
      category: service.service_categories ? service.service_categories.name : 'Non catégorisé',
      categoryId: service.category_id || undefined,
      bufferTimeBefore: 5, // Valeur par défaut
      bufferTimeAfter: 5, // Valeur par défaut
      assignedEmployees: [], // Valeur par défaut
      isRecurring: false, // Valeur par défaut
      isActive: service.is_active
    }));
    
    return services;
  } catch (error) {
    console.error("Erreur lors de la récupération des services:", error);
    return [];
  }
};

/**
 * Récupère les catégories depuis la base de données pour l'affichage sur la page de réservation publique
 */
export const getPublicCategories = async (businessId: string): Promise<Category[]> => {
  try {
    // Récupérer les catégories depuis Supabase
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('service_categories')
      .select('*')
      .eq('business_id', businessId)
      .order('position');
      
    if (categoriesError) throw categoriesError;
    
    if (!categoriesData) return [];
    
    // Transformer les données pour correspondre au format Category[]
    const categories: Category[] = categoriesData.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description || undefined,
      isActive: true, // Par défaut les catégories sont actives
      order: category.position,
      color: '#' + Math.floor(Math.random()*16777215).toString(16) // Couleur aléatoire
    }));
    
    return categories;
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    return [];
  }
};
