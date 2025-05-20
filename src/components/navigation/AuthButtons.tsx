
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

interface AuthButtonsProps {
  user: any;
  signOut: () => void;
  className?: string;
}

const AuthButtons = ({ user, signOut, className = "" }: AuthButtonsProps) => {
  return (
    <div className={`lg:ml-6 lg:flex lg:items-center lg:space-x-4 ${className}`}>
      {user ? (
        <>
          <Link to="/dashboard">
            <Button variant="outline" className="border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Mon espace
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            onClick={() => signOut()}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            Déconnexion
          </Button>
        </>
      ) : (
        <>
          <Link to="/login">
            <Button variant="outline" className="border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50">
              Connexion
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all">
              Essayer gratuitement
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthButtons;
