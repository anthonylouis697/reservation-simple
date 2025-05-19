
export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  location: string;
  capacity: number;
  category: string;
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
