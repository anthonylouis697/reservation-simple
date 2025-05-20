
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
      // et stocker l'URL d'origine pour y revenir après la connexion
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [user, isLoading, navigate, location]);

  // Afficher les enfants uniquement si l'utilisateur est authentifié
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
  }

  return user ? <>{children}</> : null;
};

export default RequireAuth;
