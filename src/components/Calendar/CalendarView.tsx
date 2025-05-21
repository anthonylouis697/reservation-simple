
import React, { useState } from 'react';
import { format, addDays, startOfWeek, endOfWeek, addWeeks, subWeeks, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, CalendarIcon as CalendarIconLucide, ArrowLeft } from 'lucide-react';
import { cn } from "@/lib/utils";
import AppointmentItem from './AppointmentItem';
import { useNavigate } from 'react-router-dom';

export type Appointment = {
  id: string;
  title: string;
  clientName: string;
  time: { start: string; end: string };
  date: Date;
  color?: string;
  serviceName: string;
  status: 'confirmed' | 'pending' | 'cancelled';
};

interface CalendarViewProps {
  appointments?: Appointment[];
  onAddAppointment?: () => void;
  onViewAppointment?: (appointment: Appointment) => void;
  onEditAppointment?: (appointment: Appointment) => void;
  defaultView?: 'day' | 'week' | 'month';
  standalone?: boolean; // Nouveau prop pour indiquer si c'est la vue calendrier principale
}

const CalendarView = ({
  appointments = [],
  onAddAppointment,
  onViewAppointment,
  onEditAppointment,
  defaultView = 'week',
  standalone = false
}: CalendarViewProps) => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>(defaultView);
  const [weekStartDate, setWeekStartDate] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStartDate, i));

  const getDayHours = () => {
    return Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 to 19:00
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((appointment) => {
      const appDate = new Date(appointment.date);
      return appDate.getDate() === date.getDate() && 
             appDate.getMonth() === date.getMonth() && 
             appDate.getFullYear() === date.getFullYear();
    });
  };

  const getAppointmentsForWeek = () => {
    const weekEnd = endOfWeek(weekStartDate, { weekStartsOn: 1 });
    return appointments.filter((appointment) => {
      const appDate = new Date(appointment.date);
      return appDate >= weekStartDate && appDate <= weekEnd;
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setWeekStartDate(direction === 'next' 
      ? addWeeks(weekStartDate, 1) 
      : subWeeks(weekStartDate, 1));
  };

  const handleViewChange = (value: string) => {
    setView(value as 'day' | 'week' | 'month');
  };

  const renderDayView = () => {
    const dayHours = getDayHours();
    const dayAppointments = getAppointmentsForDate(date);

    return (
      <div className="border rounded-md p-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {format(date, "EEEE d MMMM yyyy", { locale: fr })}
          </h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setDate(new Date())}>
              Aujourd'hui
            </Button>
            <Button variant="outline" size="icon" onClick={() => setDate(addDays(date, -1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setDate(addDays(date, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2 mt-4">
          {dayHours.map((hour) => (
            <div key={hour} className="grid grid-cols-12 h-16 border-t">
              <div className="col-span-1 text-xs text-muted-foreground pt-1 pr-2 text-right">
                {`${hour}:00`}
              </div>
              <div className="col-span-11 relative px-2">
                {dayAppointments
                  .filter(app => {
                    const startHour = parseInt(app.time.start.split(':')[0]);
                    return startHour === hour;
                  })
                  .map(appointment => (
                    <div 
                      key={appointment.id} 
                      className={cn(
                        "absolute w-full bg-indigo-100 border-l-4 border-indigo-500 rounded p-1",
                        "hover:bg-indigo-200 transition-colors cursor-pointer"
                      )}
                      style={{ top: '0', height: '90%' }}
                      onClick={() => onViewAppointment?.(appointment)}
                    >
                      <p className="font-medium text-sm truncate">{appointment.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {appointment.clientName} • {appointment.time.start} - {appointment.time.end}
                      </p>
                    </div>
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const dayHours = getDayHours();
    const weekAppointments = getAppointmentsForWeek();
    
    return (
      <div className="border rounded-md">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="text-lg font-semibold">
            {format(weekStartDate, "d MMMM", { locale: fr })} - {format(addDays(weekStartDate, 6), "d MMMM yyyy", { locale: fr })}
          </h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setWeekStartDate(startOfWeek(new Date(), { weekStartsOn: 1 }))}>
              Cette semaine
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateWeek('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateWeek('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-8 overflow-x-auto">
          {/* Header Row */}
          <div className="col-span-1"></div>
          {weekDays.map((day, i) => (
            <div 
              key={i} 
              className={cn(
                "p-2 text-center border-b", 
                isToday(day) ? "bg-accent" : ""
              )}
            >
              <p className="text-xs text-muted-foreground">{format(day, "EEE", { locale: fr })}</p>
              <p className={cn("font-semibold", isToday(day) ? "text-primary" : "")}>{format(day, "d")}</p>
            </div>
          ))}
          
          {/* Time Cells */}
          {dayHours.map((hour) => (
            <React.Fragment key={hour}>
              <div className="border-r p-1 text-xs text-muted-foreground text-right pr-2">
                {`${hour}:00`}
              </div>
              
              {weekDays.map((day, dayIndex) => {
                const dayAppointments = weekAppointments.filter(app => {
                  const appDate = new Date(app.date);
                  const startHour = parseInt(app.time.start.split(':')[0]);
                  return appDate.getDate() === day.getDate() && 
                         appDate.getMonth() === day.getMonth() && 
                         startHour === hour;
                });
                
                return (
                  <div 
                    key={dayIndex} 
                    className="border-r border-b h-12 relative"
                    onClick={() => {
                      setDate(day);
                      setView('day');
                    }}
                  >
                    {dayAppointments.map((appointment) => (
                      <div 
                        key={appointment.id} 
                        className={cn(
                          "absolute inset-x-0 bg-indigo-100 border-l-4 border-indigo-500 rounded p-1 m-0.5",
                          "hover:bg-indigo-200 transition-colors cursor-pointer"
                        )}
                        style={{ top: '0', height: '90%' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewAppointment?.(appointment);
                        }}
                      >
                        <p className="font-medium text-xs truncate">{appointment.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{appointment.time.start}</p>
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    return (
      <div className="border rounded-md">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            if (date) {
              setDate(date);
              setView('day');
            }
          }}
          className="rounded-md"
          modifiers={{
            hasAppointment: appointments.map(app => new Date(app.date))
          }}
          modifiersStyles={{
            hasAppointment: {
              fontWeight: 'bold',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              borderRadius: '50%',
              borderBottom: '2px solid rgb(99, 102, 241)'
            }
          }}
        />

        <CardContent>
          <h3 className="font-medium mb-2">Rendez-vous prévus pour aujourd'hui</h3>
          <div className="space-y-2">
            {getAppointmentsForDate(new Date()).length ? (
              getAppointmentsForDate(new Date()).map((appointment) => (
                <AppointmentItem 
                  key={appointment.id} 
                  appointment={appointment} 
                  onClick={() => onViewAppointment?.(appointment)}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Aucun rendez-vous prévu pour aujourd'hui</p>
            )}
          </div>
        </CardContent>
      </div>
    );
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          {standalone && (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/dashboard')}
                className="h-9 w-9"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle>Calendrier</CardTitle>
                <CardDescription>Gérez vos rendez-vous et votre agenda</CardDescription>
              </div>
            </div>
          )}
          {!standalone && (
            <div>
              <CardTitle>Calendrier</CardTitle>
              <CardDescription>Gérez vos rendez-vous et votre agenda</CardDescription>
            </div>
          )}
          <Button onClick={onAddAppointment}>+ Nouveau rendez-vous</Button>
        </div>
        
        <Tabs value={view} onValueChange={handleViewChange} className="mt-4">
          <TabsList>
            <TabsTrigger value="day">Jour</TabsTrigger>
            <TabsTrigger value="week">Semaine</TabsTrigger>
            <TabsTrigger value="month">Mois</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-auto">
        {view === 'day' && renderDayView()}
        {view === 'week' && renderWeekView()}
        {view === 'month' && renderMonthView()}
      </CardContent>
    </Card>
  );
};

export default CalendarView;
