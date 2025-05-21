
import { supabase } from '@/integrations/supabase/client';
import { createDefaultBusiness } from './businessUtils';

/**
 * Loads user profile and ensures business exists
 */
export const loadUserProfile = async (userId: string) => {
  try {
    // Load profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Erreur lors du chargement du profil:', profileError);
      return { profile: null, businessId: null };
    }

    // Set profile data if found
    if (profileData) {
      // Check if user has a business
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', userId)
        .maybeSingle();

      if (businessError) {
        console.error('Erreur lors de la vérification de l\'entreprise:', businessError);
        return { profile: profileData, businessId: null };
      }

      // Create a default business if none exists
      if (!businessData) {
        console.log("Aucune entreprise trouvée, création d'une entreprise par défaut");
        const businessId = await createDefaultBusiness(userId, profileData.first_name, profileData.last_name);
        return { profile: profileData, businessId };
      }
      
      return { profile: profileData, businessId: businessData.id };
    }
    
    return { profile: null, businessId: null };
  } catch (error) {
    console.error('Erreur lors du chargement du profil:', error);
    return { profile: null, businessId: null };
  }
};
