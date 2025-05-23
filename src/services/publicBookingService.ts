
import { supabase } from '@/integrations/supabase/client';
import { Service, Category } from '@/types/service';
import { toast } from 'sonner';

// Vérifie si un business a des services actifs
export const hasActiveServices = async (businessId: string): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from('services')
      .select('id', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .eq('is_active', true);
      
    if (error) {
      console.error("Erreur lors de la vérification des services:", error);
      throw error;
    }
    
    return count !== null && count > 0;
  } catch (error) {
    console.error("Erreur lors de la vérification des services actifs:", error);
    return false;
  }
};

// Récupère les services publics pour un business
export const getPublicServices = async (businessId: string): Promise<Service[]> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select(`
        id,
        name,
        description,
        price,
        duration,
        category_id,
        position,
        is_active
      `)
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('position', { ascending: true });
      
    if (error) {
      console.error("Erreur lors de la récupération des services:", error);
      throw error;
    }
    
    return (data || []).map(service => ({
      id: service.id,
      name: service.name,
      description: service.description || '',
      price: Number(service.price) || 0,
      duration: service.duration || 60,
      categoryId: service.category_id || null,
      position: service.position || 0,
      isActive: service.is_active !== false,
      // Add missing required properties from Service type
      location: '',
      capacity: 1,
      category: null,
      bufferTimeBefore: 0,
      bufferTimeAfter: 0,
      notes: '',
      color: '#000000'
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des services:", error);
    toast.error("Impossible de charger les services");
    return [];
  }
};

// Récupère les catégories publiques pour un business
export const getPublicCategories = async (businessId: string): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('service_categories')
      .select(`
        id,
        name,
        description,
        position
      `)
      .eq('business_id', businessId)
      .order('position', { ascending: true });
      
    if (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
      throw error;
    }
    
    return (data || []).map(category => ({
      id: category.id,
      name: category.name,
      description: category.description || '',
      position: category.position || 0,
      isActive: true // Add the required isActive property
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    toast.error("Impossible de charger les catégories de services");
    return [];
  }
};
