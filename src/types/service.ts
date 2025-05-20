
export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  location: string;
  capacity: number;
  category: string;
  categoryId?: string;
  bufferTimeBefore: number;
  bufferTimeAfter: number;
  assignedEmployees: string[];
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurringExceptions?: string[]; // Dates au format ISO pour les exceptions
  isActive: boolean;
  variableDurationOptions?: VariableDurationOption[];
}

export interface VariableDurationOption {
  id: string;
  duration: number;
  price: number;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  color?: string;
  icon?: string;
  imageUrl?: string;
  order?: number;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  isActive: boolean;
  recipientType: 'client' | 'employee' | 'admin';
  notificationType: NotificationType;
  triggerType: 'immediate' | 'scheduled';
  scheduledTime?: number; // Minutes before/after appointment
  scheduledTimeUnit?: 'minutes' | 'hours' | 'days';
  scheduledTimeRelative?: 'before' | 'after';
  appointmentStatus?: AppointmentStatus[];
  services?: string[]; // Service IDs
  sendOnlyThis: boolean;
  channel: NotificationChannel;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 
  | 'appointment_created' 
  | 'appointment_updated' 
  | 'appointment_cancelled' 
  | 'appointment_status_changed' 
  | 'appointment_reminder';

export type NotificationChannel = 'email' | 'sms' | 'whatsapp';

export type AppointmentStatus = 
  | 'approved' 
  | 'pending' 
  | 'cancelled' 
  | 'rejected' 
  | 'rescheduled' 
  | 'completed';
