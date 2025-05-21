
import { supabase } from '@/integrations/supabase/client';
import { Service, Category } from '@/types/service';

/**
 * Récupère les services publics pour une entreprise spécifique
 * @param businessId L'ID de l'entreprise
 * @returns Liste des services actifs pour cette entreprise
 */
export const getPublicServices = async (businessId: string): Promise<Service[] | null> => {
  try {
    console.log('Fetching services for business ID:', businessId);
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        service_categories(name)
      `)
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('position');
      
    if (error) {
      console.error('Erreur lors de la récupération des services:', error);
      return null;
    }
    
    console.log('Services fetched successfully:', data?.length || 0);
    
    return data.map(service => ({
      id: service.id,
      name: service.name,
      description: service.description || '',
      duration: service.duration,
      price: Number(service.price),
      location: '',
      capacity: 1,
      category: service.service_categories?.name || '',
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
    console.log('Fetching categories for business ID:', businessId);
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('business_id', businessId)
      .order('position');
      
    if (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      return null;
    }
    
    console.log('Categories fetched successfully:', data?.length || 0);
    
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

/**
 * Récupère un service par son ID
 * @param serviceId L'ID du service
 * @returns Le service correspondant ou null
 */
export const getPublicServiceById = async (serviceId: string): Promise<Service | null> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        service_categories(name)
      `)
      .eq('id', serviceId)
      .maybeSingle();
      
    if (error || !data) {
      console.error('Erreur lors de la récupération du service:', error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      duration: data.duration,
      price: Number(data.price),
      location: '',
      capacity: 1,
      category: data.service_categories?.name || '',
      categoryId: data.category_id || undefined,
      bufferTimeBefore: 0,
      bufferTimeAfter: 0,
      assignedEmployees: [],
      isRecurring: false,
      isActive: data.is_active
    };
  } catch (error) {
    console.error('Erreur lors de la récupération du service:', error);
    return null;
  }
};

/**
 * Vérifie si une entreprise possède des services actifs
 * @param businessId L'ID de l'entreprise
 * @returns true si l'entreprise a au moins un service actif
 */
export const hasActiveServices = async (businessId: string): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .eq('is_active', true);
      
    if (error) {
      console.error('Erreur lors de la vérification des services actifs:', error);
      return false;
    }
    
    return count !== null && count > 0;
  } catch (error) {
    console.error('Erreur lors de la vérification des services actifs:', error);
    return false;
  }
};
