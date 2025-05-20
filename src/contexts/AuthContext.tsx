
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signUp: (email: string, password: string, options?: { first_name?: string; last_name?: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fonction pour charger le profil utilisateur
    const loadUserProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error('Erreur lors du chargement du profil:', error);
        } else if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    // Écouteur de changement d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth event:', event, 'Session:', currentSession);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Si l'utilisateur est connecté, charger son profil
        if (currentSession?.user) {
          // Utiliser setTimeout pour éviter les deadlocks potentiels
          setTimeout(() => {
            loadUserProfile(currentSession.user.id);
          }, 0);
          
          // Si l'utilisateur est sur la page d'accueil, login ou signup, rediriger vers dashboard
          if (['/login', '/signup', '/'].includes(location.pathname)) {
            navigate('/dashboard');
          }
        } else {
          setProfile(null);
          
          // Si l'utilisateur n'est pas connecté et est sur une page protégée, rediriger vers login
          const isProtectedRoute = !['/', '/login', '/signup', '/reset-password'].includes(location.pathname);
          if (isProtectedRoute) {
            navigate('/login', { state: { from: location.pathname } });
          }
        }

        setIsLoading(false);
      }
    );

    // Vérifier s'il y a une session existante au chargement
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Initial session check:', currentSession);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        loadUserProfile(currentSession.user.id);
        
        // Si l'utilisateur est sur la page d'accueil, login ou signup, rediriger vers dashboard
        if (['/login', '/signup', '/'].includes(location.pathname)) {
          navigate('/dashboard');
        }
      } else {
        // Si l'utilisateur n'est pas connecté et est sur une page protégée, rediriger vers login
        const isProtectedRoute = !['/', '/login', '/signup', '/reset-password'].includes(location.pathname);
        if (isProtectedRoute) {
          navigate('/login', { state: { from: location.pathname } });
        }
      }
      
      setIsLoading(false);
    });

    // Nettoyer l'abonnement
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  const signUp = async (email: string, password: string, options?: { first_name?: string; last_name?: string }) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: options?.first_name || '',
            last_name: options?.last_name || ''
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        throw error;
      }

      if (!data.session) {
        toast.success('Inscription réussie ! Vérifiez votre email pour confirmer votre compte.');
        navigate('/welcome');
      } else {
        toast.success('Inscription réussie !');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue lors de l\'inscription.');
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      toast.success('Connexion réussie !');
      // La redirection sera gérée par l'écouteur onAuthStateChange
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue lors de la connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      toast.success('Déconnexion réussie.');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue lors de la déconnexion.');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) {
        throw error;
      }
      
      toast.success('Instructions envoyées par email.');
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        signUp,
        signIn,
        signOut,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
