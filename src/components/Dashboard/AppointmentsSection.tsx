
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for appointments - in a real app, this would come from an API
const upcomingAppointments = [
  { id: 1, name: 'Marie Dupont', time: '09:00 - 10:00', service: 'Consultation initiale', date: new Date().toLocaleDateString('fr-FR') },
  { id: 2, name: 'Jean Martin', time: '11:30 - 12:30', service: 'Suivi mensuel', date: new Date().toLocaleDateString('fr-FR') },
  { id: 3, name: 'Sophie Lambert', time: '14:00 - 15:00', service: 'Rendez-vous', date: new Date().toLocaleDateString('fr-FR') },
];

export const AppointmentsSection = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendez-vous à venir</CardTitle>
        <CardDescription>Vos prochains rendez-vous pour aujourd'hui</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {upcomingAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100">
              <div className="bg-indigo-100 rounded-full p-2">
                <Clock className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="font-medium">{appointment.name}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{appointment.time}</span>
                  <span className="mx-2">•</span>
                  <span>{appointment.service}</span>
                </div>
              </div>
              <div className="ml-auto space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/calendar')}>Détails</Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5">
          <Button variant="outline" className="w-full" onClick={() => navigate('/calendar')}>
            Voir tous les rendez-vous
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
