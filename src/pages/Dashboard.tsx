
import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Grid, Settings, LogOut } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();
  
  // Mock data for appointments
  const upcomingAppointments = [
    { id: 1, name: 'Marie Dupont', time: '09:00 - 10:00', service: 'Consultation initiale', date: new Date().toLocaleDateString('fr-FR') },
    { id: 2, name: 'Jean Martin', time: '11:30 - 12:30', service: 'Suivi mensuel', date: new Date().toLocaleDateString('fr-FR') },
    { id: 3, name: 'Sophie Lambert', time: '14:00 - 15:00', service: 'Rendez-vous', date: new Date().toLocaleDateString('fr-FR') },
  ];
  
  const handleLogout = () => {
    // In a real app, this would log the user out
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="bg-white w-64 border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-indigo-600 text-xl font-bold">BookWise</h2>
        </div>
        <div className="flex-grow py-6 px-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start text-left" onClick={() => navigate('/dashboard')}>
            <Grid className="mr-2 h-4 w-4" />
            Tableau de bord
          </Button>
          <Button variant="ghost" className="w-full justify-start text-left" onClick={() => navigate('/calendar')}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendrier
          </Button>
          <Button variant="ghost" className="w-full justify-start text-left">
            <User className="mr-2 h-4 w-4" />
            Clients
          </Button>
          <Button variant="ghost" className="w-full justify-start text-left" onClick={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </Button>
        </div>
        <div className="p-4 border-t border-gray-200">
          <Button variant="ghost" className="w-full justify-start text-left" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </aside>
      
      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="flex justify-around p-2">
          <Button variant="ghost" size="sm" className="flex flex-col items-center py-2" onClick={() => navigate('/dashboard')}>
            <Grid className="h-5 w-5" />
            <span className="text-xs mt-1">Tableau</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center py-2" onClick={() => navigate('/calendar')}>
            <CalendarIcon className="h-5 w-5" />
            <span className="text-xs mt-1">Calendrier</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center py-2">
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Clients</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center py-2" onClick={() => navigate('/settings')}>
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Paramètres</span>
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-grow p-6 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="text-gray-500">Bienvenue sur votre espace BookWise</p>
            </div>
            <Button className="mt-4 md:mt-0" onClick={() => navigate('/calendar')}>
              + Nouveau rendez-vous
            </Button>
          </div>
          
          {/* Dashboard content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Quick stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="rounded-full bg-blue-100 p-3">
                      <CalendarIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">Aujourd'hui</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">3</p>
                    <p className="text-sm text-gray-500">rendez-vous</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="rounded-full bg-green-100 p-3">
                      <Clock className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">Cette semaine</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">12</p>
                    <p className="text-sm text-gray-500">rendez-vous</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="rounded-full bg-indigo-100 p-3">
                      <User className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">Clients</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">28</p>
                    <p className="text-sm text-gray-500">total</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Upcoming appointments */}
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
            </div>
            
            {/* Calendar sidebar */}
            <div>
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
