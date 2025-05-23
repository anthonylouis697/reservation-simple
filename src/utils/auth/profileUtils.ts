
import { supabase } from '@/integrations/supabase/client';
import { createDefaultBusiness } from './businessUtils';

/**
 * Loads user profile and ensures business exists
 */
export const loadUserProfile = async (userId: string) => {
  try {
    console.log('Loading profile for user:', userId);
    
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
        .eq('owner_id', userId);

      if (businessError) {
        console.error('Erreur lors de la vérification de l\'entreprise:', businessError);
        return { profile: profileData, businessId: null };
      }

      // Create a default business if none exists
      if (!businessData || businessData.length === 0) {
        console.log("Aucune entreprise trouvée, création d'une entreprise par défaut");
        const businessId = await createDefaultBusiness(userId, profileData.first_name, profileData.last_name);
        console.log("Entreprise créée avec ID:", businessId);
        return { profile: profileData, businessId };
      }
      
      // Return the first business ID if multiple exist
      console.log("Entreprise existante trouvée:", businessData[0].id);
      return { profile: profileData, businessId: businessData[0].id };
    }
    
    return { profile: null, businessId: null };
  } catch (error) {
    console.error('Erreur lors du chargement du profil:', error);
    return { profile: null, businessId: null };
  }
};
