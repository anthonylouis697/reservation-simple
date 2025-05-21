
import { ClientInfo } from './clientService';

export interface BookingData {
  businessId: string;
  serviceId: string;
  date: Date;
  time: string;
  client: ClientInfo;
}

export interface BookingResult {
  id: string;
  startTime: Date;
  endTime: Date;
  serviceId: string;
  clientName: string;
  clientEmail: string;
  status: 'confirmed' | 'cancelled' | 'pending';
}

export interface Booking {
  id: string;
  client: ClientInfo;
  serviceId: string;
  date: Date;
  time: string;
  status: 'confirmed' | 'cancelled' | 'pending';
}

// Interface for the database client object
export interface DbClient {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  notes?: string;
}

// Interface for reservation data from database
export interface DbReservation {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
  service_id: string;
  clients?: DbClient;
}
