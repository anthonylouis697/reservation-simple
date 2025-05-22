
import { ClientInfo } from './clientService';

export interface BookingData {
  businessId: string;
  serviceId: string;
  serviceName: string;
  serviceDuration?: number;  // Added missing property
  date: Date;
  time: string;
  clientInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  notes?: string;
}

export interface BookingResult {
  id: string;
  startTime: Date;
  endTime: Date;
  serviceId?: string;
  serviceName: string;
  clientName: string;
  clientEmail?: string;
  status: 'confirmed' | 'cancelled' | 'pending';
}

export interface Booking {
  id: string;
  business_id: string;
  service_id: string;
  service_name: string;
  client_id?: string | null;
  client_first_name: string;
  client_last_name: string;
  client_email: string;
  client_phone: string;
  start_time: string;
  end_time: string;
  notes?: string | null;
  status: string;
  created_at: string;
  updated_at?: string;
  // Adding client property for compatibility
  client?: {
    name: string;
    email: string;
    phone?: string;
    notes?: string;
  };
  // Adding calculated properties
  serviceId?: string; // Alias for service_id
  date?: Date;        // Calculated from start_time
  time?: string;      // Extracted from start_time
}

// Interface for the database client object
export interface DbClient {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  notes?: string;
  business_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Interface for reservation data from database
export interface DbReservation {
  id: string;
  business_id?: string;
  service_id?: string;
  service_name?: string;
  client_id?: string;
  client_first_name?: string; // Added
  client_last_name?: string;  // Added
  client_email?: string;      // Added
  client_phone?: string;      // Added
  start_time: string;
  end_time: string;
  status: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  clients?: DbClient;
}
