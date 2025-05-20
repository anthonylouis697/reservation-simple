
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const industries = [
  {
    id: 1,
    name: 'Beauté & Bien-être',
    icon: '✨',
    description: 'Solution idéale pour les salons de coiffure, instituts de beauté, spas et massothérapeutes',
    benefits: ['Gestion des équipements et cabines', 'Réservation des services combinés', 'Fidélisation clients'],
  },
  {
    id: 2,
    name: 'Santé',
    icon: '🏥',
    description: 'Parfait pour les cliniques, médecins, dentistes, kinésithérapeutes et professionnels de santé',
    benefits: ['Dossier patient sécurisé', 'Questionnaires médicaux personnalisés', 'Rappels de rendez-vous automatisés'],
  },
  {
    id: 3,
    name: 'Coaching & Conseil',
    icon: '💼',
    description: 'Adapté aux coachs personnels, consultants, conseillers et experts indépendants',
    benefits: ['Sessions individuelles ou de groupe', 'Facturation horaire simplifiée', 'Suivi de progression clients'],
  },
  {
    id: 4,
    name: 'Sport & Fitness',
    icon: '🏋️',
    description: 'Conçu pour les salles de sport, studios de yoga, entraîneurs personnels et clubs sportifs',
    benefits: ['Réservation de cours collectifs', 'Gestion des abonnements', 'Planification des ressources'],
  },
  {
    id: 5,
    name: 'Éducation & Formation',
    icon: '🎓',
    description: 'Idéal pour les formateurs, écoles, centres de formation et tuteurs privés',
    benefits: ['Programmation des cours', 'Gestion des classes et groupes', 'Inscriptions en ligne'],
  },
  {
    id: 6,
    name: 'Événementiel',
    icon: '🎪',
    description: 'Solution complète pour les organisateurs d\'événements, lieux de réception et prestataires',
    benefits: ['Réservation de créneaux et espaces', 'Gestion des équipements', 'Coordination des intervenants'],
  },
];

const IndustryCard = ({ industry }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group relative h-full border-0 bg-gradient-to-br from-white to-gray-50">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-indigo-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
      <CardHeader className="pb-0">
        <div className="text-3xl mb-2">{industry.icon}</div>
        <CardTitle className="text-xl font-bold">{industry.name}</CardTitle>
        <CardDescription className="text-gray-600">{industry.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="space-y-2">
          {industry.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <span className="text-indigo-500 mr-2">•</span>
              <span className="text-sm text-gray-700">{benefit}</span>
            </li>
          ))}
        </ul>
        <Button variant="link" className="text-indigo-600 hover:text-indigo-800 p-0 mt-4 group-hover:underline">
          En savoir plus
          <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

const Industries = () => {
  return (
    <div id="industries" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="bg-indigo-100 text-indigo-800 inline-block rounded-full px-3 py-1 text-sm font-semibold mb-3">
            Secteurs d'activité
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            La solution adaptée à votre domaine
          </h2>
          <p className="text-xl text-gray-600">
            Quelle que soit votre activité, Reservatoo s'adapte à vos besoins spécifiques avec des fonctionnalités sur mesure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry) => (
            <IndustryCard key={industry.id} industry={industry} />
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 mb-8">
            Vous ne trouvez pas votre secteur d'activité ? Contactez-nous pour découvrir comment Reservatoo peut s'adapter à vos besoins spécifiques.
          </p>
          <Link to="/contact">
            <Button size="lg" variant="outline" className="border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50">
              Discutons de vos besoins
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Industries;
