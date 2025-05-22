
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Client information types
export interface ClientInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  notes?: string;
  name?: string; // Added for compatibility
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

// Function to get or create a client
export const getOrCreateClient = async (clientInfo: ClientInfo, businessId: string): Promise<string> => {
  try {
    // Check if client already exists by email
    const { data: existingClients, error: searchError } = await supabase
      .from('clients')
      .select('id, email')
      .eq('email', clientInfo.email)
      .eq('business_id', businessId);
      
    if (searchError) {
      console.error("Error searching for client:", searchError);
      throw new Error("Failed to search for existing client");
    }
    
    // If client already exists, return the ID
    if (existingClients && existingClients.length > 0) {
      return existingClients[0].id;
    }
    
    // Client doesn't exist, create a new one
    const newClientId = uuidv4();
    
    const { error: createError } = await supabase
      .from('clients')
      .insert({
        id: newClientId,
        first_name: clientInfo.firstName,
        last_name: clientInfo.lastName,
        email: clientInfo.email,
        phone: clientInfo.phone || null,
        notes: clientInfo.notes || null,
        business_id: businessId
      });
      
    if (createError) {
      console.error("Error creating client:", createError);
      throw new Error("Failed to create client");
    }
    
    return newClientId;
  } catch (error) {
    console.error("Error in getOrCreateClient:", error);
    throw error;
  }
};
