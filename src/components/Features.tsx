
import { Calendar, Clock, Users, Globe, RefreshCw, Bell } from 'lucide-react';

const features = [
  {
    id: 1,
    name: 'Calendrier intuitif',
    description: 'Interface de calendrier claire et intuitive pour visualiser et gérer vos disponibilités en quelques clics.',
    icon: Calendar,
  },
  {
    id: 2,
    name: 'Réservations 24/7',
    description: 'Permettez à vos clients de réserver à tout moment, même en dehors des heures d\'ouverture.',
    icon: Clock,
  },
  {
    id: 3,
    name: 'Gestion des clients',
    description: 'Base de données clients complète avec historique des rendez-vous et préférences personnelles.',
    icon: Users,
  },
  {
    id: 4,
    name: 'Site de réservation personnalisé',
    description: 'Page de réservation personnalisable qui s\'intègre parfaitement à votre image de marque.',
    icon: Globe,
  },
  {
    id: 5,
    name: 'Synchronisation multi-plateforme',
    description: 'Synchronisez avec Google Calendar, Outlook et autres plateformes pour éviter les conflits de planning.',
    icon: RefreshCw,
  },
  {
    id: 6,
    name: 'Notifications automatiques',
    description: 'Rappels automatiques par email et SMS pour réduire les absences et les retards.',
    icon: Bell,
  },
];

const Features = () => {
  return (
    <div id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Fonctionnalités</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Une meilleure façon de gérer vos réservations
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Découvrez comment BookWise transforme votre gestion de réservations avec des outils puissants et faciles à utiliser.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.id} className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="px-6 py-8">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                  <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
