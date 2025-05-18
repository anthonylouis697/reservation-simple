
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckIcon } from 'lucide-react';

const tiers = [
  {
    name: 'Gratuit',
    price: '0€',
    description: 'Parfait pour les indépendants qui débutent',
    features: [
      'Jusqu\'à 10 réservations par mois',
      'Calendrier de base',
      'Notifications par email',
      'Page de réservation personnalisable',
      'Support par email',
    ],
    ctaText: 'Commencer gratuitement',
    ctaLink: '/signup',
    popular: false,
  },
  {
    name: 'Professionnel',
    price: '19€',
    period: 'par mois',
    description: 'Idéal pour les professionnels et les petites entreprises',
    features: [
      'Réservations illimitées',
      'Calendrier avancé avec planification automatique',
      'Notifications email et SMS',
      'Intégration avec Google Calendar',
      'Page de réservation entièrement personnalisable',
      'Support prioritaire',
      'Rapports et statistiques de base',
    ],
    ctaText: 'Commencer l\'essai gratuit',
    ctaLink: '/signup?plan=pro',
    popular: true,
  },
  {
    name: 'Entreprise',
    price: '49€',
    period: 'par mois',
    description: 'Pour les entreprises avec plusieurs employés et sites',
    features: [
      'Tout ce qui est inclus dans le plan Professionnel',
      'Gestion multi-utilisateurs (jusqu\'à 10)',
      'Gestion multi-sites',
      'API complète pour intégrations personnalisées',
      'Rapports et analyses avancés',
      'Formation et onboarding personnel',
      'Support dédié',
    ],
    ctaText: 'Contacter les ventes',
    ctaLink: '/contact',
    popular: false,
  },
];

const Pricing = () => {
  return (
    <div id="pricing" className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Tarifs</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            Des plans adaptés à tous les besoins
          </p>
          <p className="mt-4 max-w-xl mx-auto text-xl text-gray-500">
            Choisissez le forfait qui vous convient le mieux et commencez à simplifier vos réservations dès aujourd'hui.
          </p>
        </div>

        <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {tiers.map((tier) => (
            <div 
              key={tier.name} 
              className={`relative flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm ${
                tier.popular 
                  ? 'ring-2 ring-indigo-600 lg:scale-105 z-10' 
                  : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-indigo-600 px-4 py-1 text-sm font-semibold text-white">
                  Populaire
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{tier.name}</h3>
                <p className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight text-gray-900">{tier.price}</span>
                  {tier.period && <span className="ml-1 text-base font-medium text-gray-500">{tier.period}</span>}
                </p>
                <p className="mt-6 text-gray-500">{tier.description}</p>

                <ul role="list" className="mt-6 space-y-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex">
                      <CheckIcon className="flex-shrink-0 w-5 h-5 text-green-500" aria-hidden="true" />
                      <span className="ml-3 text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link to={tier.ctaLink}>
                  <Button
                    variant={tier.popular ? "default" : "outline"}
                    className="w-full"
                  >
                    {tier.ctaText}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
