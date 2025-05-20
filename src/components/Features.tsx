
import { 
  Calendar, Clock, Users, Globe, RefreshCw, Bell, 
  CreditCard, Settings, Star, Shield, LineChart, Smartphone 
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

const features = [
  {
    id: 1,
    name: 'Calendrier intelligent',
    description: 'Interface intuitive avec vues personnalisables. Organisez vos rendez-vous, gérez vos disponibilités et synchronisez avec vos calendriers existants.',
    icon: Calendar,
    color: 'bg-blue-500',
    details: 'Notre calendrier a été conçu pour optimiser votre gestion du temps. Il offre une vue claire de vos rendez-vous et activités avec filtrage par service, employé ou localisation. Les synchronisations bidirectionnelles avec Google Calendar et Outlook évitent les conflits d\'horaire.',
    image: 'calendar-preview.png',
  },
  {
    id: 2,
    name: 'Réservations 24/7',
    description: 'Permettez à vos clients de réserver à tout moment, même en dehors des heures d\'ouverture, pour ne jamais manquer une opportunité.',
    icon: Clock,
    color: 'bg-purple-500',
    details: 'Notre système de réservation est disponible en permanence, permettant à vos clients de prendre rendez-vous quand cela leur convient. Le processus de réservation est optimisé pour le mobile, réduisant les abandons et augmentant les conversions de 35% en moyenne.',
    image: 'bookings-preview.png',
  },
  {
    id: 3,
    name: 'Gestion des clients',
    description: 'Base de données clients complète avec historique des rendez-vous, préférences personnelles et suivi des communications.',
    icon: Users,
    color: 'bg-amber-500',
    details: 'Centralisez toutes les informations de vos clients dans une interface unique et intuitive. Accédez instantanément à l\'historique complet des rendez-vous, notez les préférences spécifiques et suivez l\'ensemble des interactions pour personnaliser chaque expérience.',
    image: 'clients-preview.png',
  },
  {
    id: 4,
    name: 'Site de réservation personnalisé',
    description: 'Page de réservation entièrement personnalisable qui s\'intègre parfaitement à votre image de marque et à votre site web existant.',
    icon: Globe,
    color: 'bg-green-500',
    details: 'Créez une expérience de réservation qui reflète parfaitement votre marque. Personnalisez les couleurs, les polices, et l\'apparence générale pour une intégration harmonieuse avec votre identité visuelle. L\'interface responsive s\'adapte à tous les appareils.',
    image: 'booking-page-preview.png',
  },
  {
    id: 5,
    name: 'Synchronisation multi-plateforme',
    description: 'Synchronisation automatique avec les principaux calendriers pour éviter les conflits de planning et les double-réservations.',
    icon: RefreshCw,
    color: 'bg-cyan-500',
    details: 'Ne craignez plus les chevauchements de rendez-vous. Notre système se synchronise parfaitement avec Google Calendar, Outlook, et iCalendar, mettant automatiquement à jour toutes vos plateformes dès qu\'une modification est effectuée.',
    image: 'sync-preview.png',
  },
  {
    id: 6,
    name: 'Notifications automatiques',
    description: 'Rappels automatiques par email et SMS pour réduire les absences et les retards de vos clients de plus de 30%.',
    icon: Bell,
    color: 'bg-red-500',
    details: 'Réduisez significativement les no-shows grâce à notre système de notifications. Envoyez des rappels personnalisés par email et SMS à des moments stratégiques avant les rendez-vous, avec la possibilité pour les clients de confirmer ou reprogrammer en un clic.',
    image: 'notifications-preview.png',
  },
  {
    id: 7,
    name: 'Paiements en ligne',
    description: 'Intégration avec les principales plateformes de paiement pour accepter les acomptes et règlements lors de la réservation.',
    icon: CreditCard,
    color: 'bg-emerald-500',
    details: 'Sécurisez vos revenus en acceptant les paiements anticipés et les acomptes. Notre plateforme s\'intègre avec Stripe, PayPal et d\'autres services de paiement majeurs pour des transactions sécurisées et fluides, avec réconciliation automatique.',
    image: 'payments-preview.png',
  },
  {
    id: 8,
    name: 'Analyses et performances',
    description: 'Tableaux de bord analytiques détaillés pour suivre vos performances et prendre des décisions éclairées.',
    icon: LineChart,
    color: 'bg-indigo-500',
    details: 'Obtenez une vision claire de vos performances commerciales avec nos tableaux de bord analytiques. Suivez le taux de remplissage, identifiez les périodes les plus actives, analysez les tendances de vos clients et optimisez votre planning pour maximiser vos revenus.',
    image: 'analytics-preview.png',
  },
  {
    id: 9,
    name: 'Boost de visibilité',
    description: 'Augmentez votre visibilité et vos revenus en vous connectant aux meilleures plateformes du marché.',
    icon: Star,
    color: 'bg-yellow-500',
    details: 'Élargissez votre portée en vous connectant aux principales plateformes de réservation spécifiques à votre secteur. Nos intégrations permettent de synchroniser automatiquement vos disponibilités et de recevoir de nouveaux clients sans effort supplémentaire.',
    image: 'visibility-preview.png',
  },
  {
    id: 10,
    name: 'Sécurité des données',
    description: 'Protection avancée des données personnelles et conformité RGPD pour vous et vos clients.',
    icon: Shield,
    color: 'bg-gray-700',
    details: 'La sécurité est notre priorité. Toutes les données sont chiffrées et stockées selon les meilleures pratiques de l\'industrie. Notre plateforme est entièrement conforme au RGPD, vous permettant de gérer facilement les consentements et les demandes d\'accès ou de suppression.',
    image: 'security-preview.png',
  },
  {
    id: 11,
    name: 'Application mobile',
    description: 'Gérez vos réservations où que vous soyez avec notre application mobile dédiée pour iOS et Android.',
    icon: Smartphone,
    color: 'bg-pink-500',
    details: 'Restez connecté à votre activité en déplacement. Notre application mobile vous permet de consulter votre agenda, gérer vos rendez-vous, communiquer avec vos clients et recevoir des notifications en temps réel, où que vous soyez.',
    image: 'mobile-app-preview.png',
  },
  {
    id: 12,
    name: 'Personnalisation avancée',
    description: 'Adaptez l\'outil à vos besoins spécifiques grâce à des options de configuration étendues.',
    icon: Settings,
    color: 'bg-teal-500',
    details: 'Configurez la plateforme selon vos besoins précis. Définissez des règles de disponibilité complexes, personnalisez les champs de réservation, créez des formulaires sur mesure et adaptez chaque aspect du système à votre mode de fonctionnement particulier.',
    image: 'customization-preview.png',
  },
];

const FeatureCard = ({ feature, isSelected, onClick }) => {
  return (
    <Card 
      className={`h-full transition-all duration-300 cursor-pointer border-2 hover:shadow-lg ${
        isSelected ? 'border-indigo-500 shadow-md ring-2 ring-indigo-200' : 'border-transparent hover:border-indigo-200'
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className={`w-12 h-12 rounded-lg ${feature.color} text-white flex items-center justify-center mb-3`}>
          <feature.icon className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl">{feature.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-600 min-h-[80px]">{feature.description}</CardDescription>
      </CardContent>
    </Card>
  );
};

const Features = () => {
  const [selectedFeature, setSelectedFeature] = useState(features[0]);

  return (
    <div id="features" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="bg-indigo-100 text-indigo-800 inline-block rounded-full px-3 py-1 text-sm font-semibold mb-3">
            Fonctionnalités
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Tout ce dont vous avez besoin pour briller
          </h2>
          <p className="text-xl text-gray-600">
            Reservatoo combine les outils essentiels pour gérer efficacement vos réservations, vos clients, et développer votre activité.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {features.slice(0, 6).map((feature) => (
                <FeatureCard 
                  key={feature.id}
                  feature={feature}
                  isSelected={selectedFeature.id === feature.id}
                  onClick={() => setSelectedFeature(feature)}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col justify-center">
            <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-bl-full -mt-8 -mr-8 opacity-50"></div>
              <div className="relative">
                <div className={`w-16 h-16 rounded-xl ${selectedFeature.color} text-white flex items-center justify-center mb-6`}>
                  <selectedFeature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{selectedFeature.name}</h3>
                <p className="text-gray-600 mb-6 text-lg">{selectedFeature.details}</p>
                
                <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 shadow-md">
                        <p className="text-sm text-gray-600">Aperçu de la fonctionnalité</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold mb-6">Et bien plus encore</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.slice(6).map((feature) => (
              <FeatureCard 
                key={feature.id}
                feature={feature}
                isSelected={selectedFeature.id === feature.id}
                onClick={() => setSelectedFeature(feature)}
              />
            ))}
          </div>
          
          <div className="mt-12">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Découvrir toutes nos fonctionnalités
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
