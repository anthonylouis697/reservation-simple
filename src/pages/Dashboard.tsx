
import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Star, Settings, ArrowRight } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from "@/components/ui/progress";
import { useNavigate } from 'react-router-dom';
import { OnboardingGuide } from '@/components/OnboardingGuide';
import { AppLayout } from '@/components/AppLayout';
import { QuickActions } from '@/components/DashboardWidgets/QuickActions';
import { RevenueChart } from '@/components/DashboardWidgets/RevenueChart';
import { ClientsWidget } from '@/components/DashboardWidgets/ClientsWidget';
import { ServicesWidget } from '@/components/DashboardWidgets/ServicesWidget';
import { UpcomingEvents } from '@/components/DashboardWidgets/UpcomingEvents';

const Dashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();
  
  // Mock data for appointments
  const upcomingAppointments = [
    { id: 1, name: 'Marie Dupont', time: '09:00 - 10:00', service: 'Consultation initiale', date: new Date().toLocaleDateString('fr-FR') },
    { id: 2, name: 'Jean Martin', time: '11:30 - 12:30', service: 'Suivi mensuel', date: new Date().toLocaleDateString('fr-FR') },
    { id: 3, name: 'Sophie Lambert', time: '14:00 - 15:00', service: 'Rendez-vous', date: new Date().toLocaleDateString('fr-FR') },
  ];
  
  // Profil completion status
  const profileCompletion = 65;
  
  // Check système configuration
  const setupSteps = [
    { title: "Profil complété", completed: true },
    { title: "Services configurés", completed: true },
    { title: "Disponibilités définies", completed: true },
    { title: "Page de réservation personnalisée", completed: false },
    { title: "Intégration de paiement", completed: false },
  ];
  
  return (
    <AppLayout>
      {/* Onboarding pour les nouveaux utilisateurs */}
      <OnboardingGuide />
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500">Bienvenue sur votre espace BookWise</p>
        </div>
        <Button className="mt-4 md:mt-0" onClick={() => navigate('/calendar')}>
          + Nouveau rendez-vous
        </Button>
      </div>
      
      {/* Quick actions */}
      <section className="mb-6">
        <QuickActions />
      </section>
      
      {/* Dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue chart */}
          <RevenueChart />
          
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
          
          {/* Upcoming events section */}
          <UpcomingEvents />
          
          {/* Guide de mise en route */}
          <Card>
            <CardHeader>
              <CardTitle>Guide de mise en route</CardTitle>
              <CardDescription>Complétez ces étapes pour configurer votre compte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {setupSteps.map((step, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {step.completed ? '✓' : (index + 1)}
                      </div>
                      <span className={`ml-3 ${step.completed ? 'line-through text-muted-foreground' : 'font-medium'}`}>
                        {step.title}
                      </span>
                    </div>
                    {!step.completed && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate('/settings')}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        Configurer
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30">
              <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Profil complété à {profileCompletion}%</span>
                </div>
                <Progress value={profileCompletion} className="h-2" />
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Calendar sidebar */}
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
          
          {/* Clients widget */}
          <ClientsWidget />
          
          {/* Services widget */}
          <ServicesWidget />
          
          {/* Visibility Boost Promo */}
          <Card className="border-primary/30 bg-gradient-to-b from-white to-primary/5">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-amber-500 fill-amber-400" />
                <CardTitle>Boost de Visibilité</CardTitle>
              </div>
              <CardDescription>
                Augmentez vos revenus en vous connectant aux plateformes partenaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-amber-600 font-semibold">+35%</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Augmentez vos réservations</p>
                    <p className="text-xs text-muted-foreground">Les utilisateurs rapportent en moyenne 35% de clients en plus</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                onClick={() => navigate('/visibility-boost')}
              >
                Découvrir <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
