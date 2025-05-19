
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
  isActive: boolean;
}
