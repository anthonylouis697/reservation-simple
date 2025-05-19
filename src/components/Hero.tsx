
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>
          
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Simplifiez vos </span>{' '}
                <span className="block text-indigo-600 xl:inline">réservations en ligne</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Reservatoo est une plateforme complète qui vous permet de gérer vos rendez-vous, réservations et disponibilités en toute simplicité. Augmentez votre efficacité et offrez une expérience fluide à vos clients.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link to="/signup">
                    <Button size="lg" className="w-full">
                      Commencer gratuitement
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link to="/#features">
                    <Button variant="outline" size="lg" className="w-full">
                      En savoir plus
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 w-full bg-indigo-100 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
          <div className="relative w-3/4 h-3/4 rounded-lg shadow-xl overflow-hidden border border-gray-200">
            <div className="absolute top-0 w-full h-12 bg-white border-b border-gray-200 flex items-center px-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="mx-auto bg-gray-100 rounded-full h-6 w-64"></div>
            </div>
            <div className="mt-12 p-4 grid grid-cols-7 gap-2 h-full">
              {Array(31).fill(0).map((_, i) => (
                <div key={i} className={`h-16 border rounded-md ${i % 8 === 3 || i % 7 === 5 ? 'bg-indigo-100 border-indigo-200' : 'bg-white'}`}>
                  <div className="p-1 text-xs text-gray-500">{i + 1}</div>
                  {i % 8 === 3 && <div className="mx-1 my-1 p-1 text-xs bg-indigo-500 text-white rounded">14:30</div>}
                  {i % 7 === 5 && <div className="mx-1 my-1 p-1 text-xs bg-indigo-500 text-white rounded">10:00</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
