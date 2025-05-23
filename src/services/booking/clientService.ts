
import { supabase } from '@/integrations/supabase/client';

export interface ClientInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

// Crée un nouveau client ou récupère l'ID d'un client existant
export const getOrCreateClient = async (businessId: string, clientInfo: ClientInfo): Promise<string> => {
  try {
    if (!businessId) {
      throw new Error("Business ID is required");
    }
    
    if (!clientInfo.email) {
      throw new Error("Client email is required");
    }
    
    console.log("Recherche du client existant:", clientInfo.email, "pour le business:", businessId);
    
    // Vérifie si le client existe déjà (par email)
    const { data: existingClients, error: searchError } = await supabase
      .from('clients')
      .select('id')
      .eq('business_id', businessId)
      .eq('email', clientInfo.email)
      .limit(1);
    
    if (searchError) {
      console.error("Erreur lors de la recherche du client:", searchError);
      throw searchError;
    }
    
    // Si le client existe, retourne son ID
    if (existingClients && existingClients.length > 0) {
      console.log("Client existant trouvé:", existingClients[0].id);
      return existingClients[0].id;
    }
    
    // Sinon, crée un nouveau client
    console.log("Création d'un nouveau client");
    const { data: newClient, error: createError } = await supabase
      .from('clients')
      .insert([
        {
          business_id: businessId,
          first_name: clientInfo.firstName,
          last_name: clientInfo.lastName,
          email: clientInfo.email,
          phone: clientInfo.phone || null
        }
      ])
      .select()
      .single();
    
    if (createError) {
      console.error("Erreur lors de la création du client:", createError);
      throw createError;
    }
    
    if (!newClient) {
      throw new Error("Aucune donnée retournée lors de la création du client");
    }
    
    console.log("Nouveau client créé avec ID:", newClient.id);
    return newClient.id;
  } catch (error) {
    console.error("Erreur complète lors de la gestion du client:", error);
    throw new Error(`Erreur lors de la création/récupération du client: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};

// Récupère les informations d'un client par son ID
export const getClientById = async (clientId: string): Promise<ClientInfo | null> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('first_name, last_name, email, phone')
      .eq('id', clientId)
      .single();
    
    if (error) {
      console.error("Erreur lors de la récupération du client:", error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    return {
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email || '',
      phone: data.phone || ''
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du client:", error);
    return null;
  }
};
