
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { featuresItems, industriesItems } from './NavMenuItems';

interface MobileNavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  user: any;
  signOut: () => void;
}

const MobileNavigation = ({ isMenuOpen, setIsMenuOpen, user, signOut }: MobileNavigationProps) => {
  if (!isMenuOpen) return null;
  
  return (
    <div className="lg:hidden bg-white shadow-lg absolute w-full">
      <div className="pt-2 pb-3 space-y-1 max-h-[70vh] overflow-y-auto">
        <div className="px-4 py-2">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Fonctionnalités
          </div>
          {featuresItems.map((item) => (
            <Link 
              key={item.title}
              to={item.href} 
              className="flex items-center pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-indigo-500 hover:text-indigo-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="mr-2">{item.icon}</span>
              {item.title}
            </Link>
          ))}
        </div>
        
        <div className="px-4 py-2">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Industries
          </div>
          {industriesItems.map((item) => (
            <Link 
              key={item.title}
              to={item.href} 
              className="flex items-center pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-indigo-500 hover:text-indigo-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="mr-2">{item.icon}</span>
              {item.title}
            </Link>
          ))}
        </div>
        
        <Link 
          to="/#pricing" 
          className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-indigo-500 hover:text-indigo-700"
          onClick={() => setIsMenuOpen(false)}
        >
          Tarifs
        </Link>
        
        <Link 
          to="/#testimonials" 
          className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-indigo-500 hover:text-indigo-700"
          onClick={() => setIsMenuOpen(false)}
        >
          Témoignages
        </Link>
        
        <Link 
          to="/#contact" 
          className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-indigo-500 hover:text-indigo-700"
          onClick={() => setIsMenuOpen(false)}
        >
          Contact
        </Link>
      </div>
      
      <div className="pt-4 pb-3 border-t border-gray-200 flex flex-col space-y-2 px-4">
        {user ? (
          <>
            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <LogIn className="h-4 w-4" />
                Mon espace
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              onClick={() => {
                setIsMenuOpen(false);
                signOut();
              }}
              className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              Déconnexion
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              <Button variant="outline" className="w-full">Connexion</Button>
            </Link>
            <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full">Essayer gratuitement</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileNavigation;
