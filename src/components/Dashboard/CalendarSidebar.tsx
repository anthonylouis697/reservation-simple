
import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';

export const CalendarSidebar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendrier</CardTitle>
        <CardDescription>Gérez vos disponibilités</CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="border rounded-md p-3 pointer-events-auto"
        />
        <Separator className="my-6" />
        <Button className="w-full" onClick={() => navigate('/calendar')}>
          Ouvrir le calendrier
        </Button>
      </CardContent>
    </Card>
  );
};
