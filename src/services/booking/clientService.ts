
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
