
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, ThumbsUp, Shield, Clock, Globe } from 'lucide-react';

const WhyChooseUs = () => {
  const benefits = [
    {
      icon: <Clock className="h-10 w-10 text-indigo-500" />,
      title: "Gain de temps considérable",
      description: "Automatisez les rendez-vous et réduisez de 75% le temps consacré à la gestion administrative."
    },
    {
      icon: <ThumbsUp className="h-10 w-10 text-indigo-500" />,
      title: "Expérience client supérieure",
      description: "Offrez une expérience de réservation fluide et professionnelle, disponible 24/7."
    },
    {
      icon: <Shield className="h-10 w-10 text-indigo-500" />,
      title: "Sécurité & conformité RGPD",
      description: "Protection des données avec chiffrement de bout en bout et conformité totale aux normes européennes."
    },
    {
      icon: <Globe className="h-10 w-10 text-indigo-500" />,
      title: "Rayonnement international",
      description: "Interface disponible en 8 langues pour servir vos clients du monde entier."
    }
  ];

  const differentiators = [
    "Interface intuitive conçue pour tous les niveaux techniques",
    "Support client réactif avec temps de réponse moyen de 3h",
    "Mises à jour régulières basées sur les retours utilisateurs",
    "Intégrations natives avec les outils que vous utilisez déjà",
    "Personnalisation avancée sans connaissance technique",
    "Migration depuis d'autres systèmes sans frais supplémentaires"
  ];

  return (
    <div className="py-20 bg-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="bg-indigo-100 text-indigo-800 inline-block rounded-full px-3 py-1 text-sm font-semibold mb-3">
            Pourquoi nous choisir
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Ce qui nous différencie
          </h2>
          <p className="text-xl text-gray-600">
            Avec Reservatoo, bénéficiez d'une solution complète, intuitive et évolutive qui s'adapte aux besoins uniques de votre entreprise.
          </p>
        </div>

        {/* Main benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100 text-center"
            >
              <div className="inline-flex items-center justify-center rounded-full bg-indigo-100 p-3 mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* What sets us apart */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute -inset-4 bg-indigo-600 rounded-2xl opacity-10 blur-lg"></div>
              <div className="relative bg-white rounded-xl p-8 shadow-lg border border-indigo-100">
                <h3 className="text-2xl font-bold mb-6 text-indigo-800">Ce qui fait notre différence</h3>
                <ul className="space-y-4">
                  {differentiators.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-indigo-500 mr-3 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link to="/signup">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white group">
                      Essayer gratuitement
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold mb-6">Nos clients témoignent</h3>
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-lg relative">
                  <div className="text-4xl text-indigo-200 absolute top-2 left-3">"</div>
                  <div className="relative">
                    <p className="italic text-gray-700 mb-4">
                      Depuis que nous utilisons Reservatoo, nos no-shows ont diminué de 62%. L'expérience client est tellement fluide que nos réservations en ligne ont augmenté de plus de 40% en trois mois.
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-indigo-700 font-bold">S</span>
                      </div>
                      <div>
                        <p className="font-medium">Sophie Martins</p>
                        <p className="text-sm text-gray-500">Directrice, Spa Harmony</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-gray-50 rounded-lg relative">
                  <div className="text-4xl text-indigo-200 absolute top-2 left-3">"</div>
                  <div className="relative">
                    <p className="italic text-gray-700 mb-4">
                      La simplicité d'utilisation combinée à la puissance des fonctionnalités fait de Reservatoo un outil indispensable. Notre équipe a gagné 15 heures par semaine sur des tâches administratives.
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-indigo-700 font-bold">T</span>
                      </div>
                      <div>
                        <p className="font-medium">Thomas Durand</p>
                        <p className="text-sm text-gray-500">Gérant, Centre médical Santé Plus</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Link to="/#testimonials" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mt-6">
                <span>Lire plus de témoignages</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
