import { supabase } from '@/integrations/supabase/client';

// Client information types
export interface ClientInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  notes?: string;
}

// Helper for combining first and last names
export const getFullName = (client: ClientInfo): string => {
  return `${client.firstName} ${client.lastName}`;
};

// Helper to validate client email
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Helper to format phone number (optional)
export const formatPhoneNumber = (phone: string): string => {
  // Basic formatting for French phone numbers
  if (phone.length === 10 && phone.startsWith('0')) {
    return phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  return phone;
};

// Gets or creates a client
export const getOrCreateClient = async (
  businessId: string,
  clientInfo: ClientInfo
): Promise<string> => {
  try {
    // Check if client already exists by email
    const { data: existingClients, error: searchError } = await supabase
      .from('clients')
      .select('id, email')
      .eq('business_id', businessId)
      .eq('email', clientInfo.email)
      .maybeSingle();

    if (searchError) {
      console.error('Error searching for client:', searchError);
      throw searchError;
    }

    // If client exists, return their ID
    if (existingClients) {
      console.log('Found existing client:', existingClients.id);
      return existingClients.id;
    }

    // Otherwise create a new client
    const { data: newClient, error: createError } = await supabase
      .from('clients')
      .insert({
        business_id: businessId,
        first_name: clientInfo.firstName,
        last_name: clientInfo.lastName,
        email: clientInfo.email,
        phone: clientInfo.phone || null,
        notes: clientInfo.notes || null
      })
      .select('id')
      .single();

    if (createError) {
      console.error('Error creating client:', createError);
      throw createError;
    }

    console.log('Created new client:', newClient.id);
    return newClient.id;
  } catch (error) {
    console.error('Error in getOrCreateClient:', error);
    throw new Error('Failed to process client information');
  }
};

// Get a client by id
export const getClientById = async (clientId: string): Promise<ClientInfo | null> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('first_name, last_name, email, phone, notes')
      .eq('id', clientId)
      .single();
      
    if (error) {
      console.error('Error getting client:', error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      phone: data.phone || undefined,
      notes: data.notes || undefined
    };
  } catch (error) {
    console.error('Error in getClientById:', error);
    return null;
  }
};
