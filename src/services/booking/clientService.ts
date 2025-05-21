
import { supabase } from '@/integrations/supabase/client';

export interface ClientInfo {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
}

// Function to check if a client exists and get their ID or create a new client
export const getOrCreateClient = async (client: ClientInfo, businessId: string): Promise<string> => {
  try {
    // Check if the client exists already
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('email', client.email)
      .eq('business_id', businessId)
      .maybeSingle();
    
    if (existingClient) {
      return existingClient.id;
    }

    // Create a new client
    const { data: newClient, error: clientError } = await supabase
      .from('clients')
      .insert({
        business_id: businessId,
        first_name: client.name.split(' ')[0],
        last_name: client.name.split(' ').slice(1).join(' ') || '-',  // Ensure last_name is never empty
        email: client.email,
        phone: client.phone,
        notes: client.notes
      })
      .select('id')
      .single();
    
    if (clientError) {
      console.error("Error creating client:", clientError);
      throw clientError;
    }
    
    return newClient.id;
  } catch (error) {
    console.error("Error working with client data:", error);
    throw error;
  }
};
