
import { useState } from 'react';

const screenshots = [
  {
    id: 1,
    title: 'Tableau de bord intuitif',
    description: 'Vue d\'ensemble claire de vos rendez-vous, clients et performances',
    image: 'https://firebasestorage.googleapis.com/v0/b/docplanner-dev-6b3cc.appspot.com/o/dashboard-screenshot.png?alt=media',
  },
  {
    id: 2,
    title: 'Gestion de calendrier simplifiée',
    description: 'Visualisez et gérez facilement votre planning et vos disponibilités',
    image: 'https://firebasestorage.googleapis.com/v0/b/docplanner-dev-6b3cc.appspot.com/o/calendar-screenshot.png?alt=media',
  },
  {
    id: 3,
    title: 'Gestion des clients',
    description: 'Suivez l\'historique et les préférences de vos clients en un clin d\'œil',
    image: 'https://firebasestorage.googleapis.com/v0/b/docplanner-dev-6b3cc.appspot.com/o/clients-screenshot.png?alt=media',
  },
  {
    id: 4,
    title: 'Personnalisation des services',
    description: 'Définissez vos prestations, tarifs et durées selon vos besoins',
    image: 'https://firebasestorage.googleapis.com/v0/b/docplanner-dev-6b3cc.appspot.com/o/services-screenshot.png?alt=media',
  },
];

const Screenshots = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div id="screenshots" className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Interface</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Découvrez l'application en images
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Une interface moderne et intuitive pour gérer efficacement votre activité
          </p>
        </div>

        <div className="mt-12">
          <div className="relative">
            {/* Screenshot preview */}
            <div className="bg-gray-100 p-4 rounded-xl overflow-hidden shadow-lg">
              <div className="relative w-full rounded-lg shadow-sm overflow-hidden bg-white">
                <div className="h-8 bg-gray-200 rounded-t-lg flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                
                <div className="aspect-[16/9] w-full relative">
                  <img
                    src={screenshots[activeIndex].image}
                    alt={screenshots[activeIndex].title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* Text description */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-900">
                {screenshots[activeIndex].title}
              </h3>
              <p className="mt-2 text-gray-600">
                {screenshots[activeIndex].description}
              </p>
            </div>

            {/* Thumbnails navigation */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              {screenshots.map((screenshot, index) => (
                <button
                  key={screenshot.id}
                  onClick={() => setActiveIndex(index)}
                  className={`flex-1 min-w-[150px] max-w-[200px] p-2 rounded-lg border-2 transition-colors ${
                    index === activeIndex 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <img
                    src={screenshot.image}
                    alt={screenshot.title}
                    className="w-full h-20 object-cover rounded"
                  />
                  <p className="mt-1 text-sm font-medium truncate">
                    {screenshot.title}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screenshots;
