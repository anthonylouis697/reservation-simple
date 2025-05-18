
import React from 'react';
import { cn } from '@/lib/utils';
import { type Appointment } from './CalendarView';
import { Clock } from 'lucide-react';

interface AppointmentItemProps {
  appointment: Appointment;
  onClick?: () => void;
}

const AppointmentItem = ({ appointment, onClick }: AppointmentItemProps) => {
  const statusColors = {
    confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    pending: 'bg-amber-100 text-amber-800 border-amber-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <div 
      className={cn(
        "border rounded-md p-3 hover:bg-accent transition-colors cursor-pointer",
        "flex items-center justify-between"
      )}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h4 className="font-medium">{appointment.title}</h4>
          <p className="text-sm text-muted-foreground">{appointment.clientName}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm">{appointment.time.start} - {appointment.time.end}</span>
            <span 
              className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                statusColors[appointment.status]
              )}
            >
              {appointment.status === 'confirmed' && 'Confirmé'}
              {appointment.status === 'pending' && 'En attente'}
              {appointment.status === 'cancelled' && 'Annulé'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentItem;
