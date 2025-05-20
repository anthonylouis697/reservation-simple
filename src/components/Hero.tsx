
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50 z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-indigo-100/40 to-transparent z-0"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-200 rounded-full opacity-20 blur-3xl z-0"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl z-0"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mb-2">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-1.5"></span>
              Nouveau : Synchronisation mobile disponible
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-800 via-indigo-600 to-indigo-700">
              Simplifiez vos réservations. <br /> 
              <span className="text-indigo-600">Optimisez votre temps.</span>
            </h1>
            
            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Reservatoo est la plateforme de réservation tout-en-un qui permet à votre entreprise de briller. 
              Gérez vos rendez-vous, vos clients et votre croissance à partir d'une seule interface élégante.
            </p>

            {/* Key benefits */}
            <div className="flex flex-col md:flex-row md:space-x-6 md:space-y-0 space-y-3 justify-center lg:justify-start mt-6">
              {["Réduction de 30% des absences", "Configuration en 10 minutes", "Assistance 7j/7"].map((benefit) => (
                <div key={benefit} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-indigo-500 mr-1.5" />
                  <span className="text-gray-700 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 justify-center lg:justify-start mt-2">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl hover:shadow-indigo-200/40 transition-all duration-300 group">
                  Commencer gratuitement
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50">
                  Découvrir nos fonctionnalités
                </Button>
              </Link>
            </div>
            
            {/* Trust badges */}
            <div className="pt-6 mt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">Ils nous font confiance :</p>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-8 gap-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-24 bg-gray-200/70 rounded-md animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Hero image / App preview */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl blur-sm opacity-60"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              <div className="h-10 bg-gray-100 border-b border-gray-200 flex items-center px-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="w-48 h-5 bg-gray-200 rounded mx-auto"></div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 p-3 h-full">
                {Array(31).fill(0).map((_, i) => (
                  <div 
                    key={i} 
                    className={`relative h-16 p-1 rounded-md border ${
                      i % 8 === 3 || i % 7 === 5 ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-gray-100'
                    }`}
                  >
                    <div className="text-xs font-medium text-gray-500">{i + 1}</div>
                    {i % 8 === 3 && (
                      <div className="absolute bottom-1 left-1 right-1 p-1 text-[10px] bg-indigo-500 text-white rounded text-center">
                        14:30
                      </div>
                    )}
                    {i % 7 === 5 && (
                      <div className="absolute bottom-1 left-1 right-1 p-1 text-[10px] bg-indigo-500 text-white rounded text-center">
                        10:00
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between px-4 py-3 bg-indigo-50">
                <div className="bg-indigo-500 text-white text-xs rounded-full px-2 py-1">12 rendez-vous aujourd'hui</div>
                <div className="bg-white border border-gray-200 rounded p-1 shadow-sm">
                  <div className="w-24 h-4 bg-gray-100 rounded"></div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute top-8 -right-4 transform rotate-6 bg-white rounded-lg shadow-lg p-3 animate-bounce animation-delay-1000">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xs font-medium">Nouveau client</div>
                  <div className="text-xs text-gray-500">à l'instant</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 transform -rotate-6 bg-white rounded-lg shadow-lg p-3 z-10">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                  <div className="w-5 h-5 bg-indigo-600 rounded-full"></div>
                </div>
                <div>
                  <div className="w-24 h-3 bg-gray-200 rounded"></div>
                  <div className="w-16 h-2 bg-gray-100 rounded mt-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
