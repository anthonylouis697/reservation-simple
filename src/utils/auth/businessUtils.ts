
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

/**
 * Creates a default business for a new user
 */
export const createDefaultBusiness = async (userId: string, firstName: string = "", lastName: string = "") => {
  try {
    // Generate a random slug for the business
    const randomSlug = `business-${uuidv4().substring(0, 8)}`;
    const businessName = firstName && lastName 
      ? `${firstName} ${lastName}`
      : "Mon entreprise";

    const { data, error } = await supabase
      .from('businesses')
      .insert([{
        owner_id: userId,
        name: businessName,
        slug: randomSlug,
        description: "Ma description d'entreprise"
      }])
      .select('id')
      .single();

    if (error) {
      console.error('Erreur lors de la création de l\'entreprise:', error);
      return null;
    }

    // Create default booking page settings
    if (data) {
      const { error: settingsError } = await supabase
        .from('booking_page_settings')
        .insert([{
          business_id: data.id,
          business_name: businessName,
          custom_url: randomSlug
        }]);

      if (settingsError) {
        console.error('Erreur lors de la création des paramètres de réservation:', settingsError);
      }
    }

    return data?.id;
  } catch (error) {
    console.error('Erreur:', error);
    return null;
  }
};
