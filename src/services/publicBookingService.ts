
import { supabase } from '@/integrations/supabase/client';
import { Service, Category } from '@/types/service';

/**
 * Récupère les services publics pour une entreprise spécifique
 * @param businessId L'ID de l'entreprise
 * @returns Liste des services actifs pour cette entreprise
 */
export const getPublicServices = async (businessId: string): Promise<Service[] | null> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('position');
      
    if (error) {
      console.error('Erreur lors de la récupération des services:', error);
      return null;
    }
    
    return data.map(service => ({
      id: service.id,
      name: service.name,
      description: service.description || '',
      duration: service.duration,
      price: Number(service.price),
      location: '',
      capacity: 1,
      category: '',
      categoryId: service.category_id || undefined,
      bufferTimeBefore: 0,
      bufferTimeAfter: 0,
      assignedEmployees: [],
      isRecurring: false,
      isActive: service.is_active
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error);
    return null;
  }
};

/**
 * Récupère les catégories de services pour une entreprise spécifique
 * @param businessId L'ID de l'entreprise
 * @returns Liste des catégories de services pour cette entreprise
 */
export const getPublicCategories = async (businessId: string): Promise<Category[] | null> => {
  try {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('business_id', businessId)
      .order('position');
      
    if (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      return null;
    }
    
    return data.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description || undefined,
      isActive: true,
      order: category.position
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return null;
  }
};
