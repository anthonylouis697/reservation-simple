
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { user, isLoading, businessId } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("RequireAuth check:", { user: !!user, isLoading, businessId, path: location.pathname });
    
    // Seulement rediriger si le chargement est terminé et qu'il n'y a pas d'utilisateur
    if (!isLoading && !user) {
      console.log("Redirecting to login from:", location.pathname);
      
      // On affiche un message pour informer l'utilisateur
      if (location.pathname !== '/') {
        toast.error('Vous devez être connecté pour accéder à cette page');
      }
      
      // Stocker l'URL d'origine pour y revenir après la connexion
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [user, isLoading, navigate, location]);

  // Afficher un état de chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  // Ne rendre les enfants que si l'utilisateur est authentifié
  return user ? <>{children}</> : null;
};

export default RequireAuth;
