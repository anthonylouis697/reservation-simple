
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuthManagement } from '@/hooks/useAuthManagement';
import { loadUserProfile } from '@/utils/auth/profileUtils';
import { toast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  businessId: string | null;
  isLoading: boolean;
  signUp: (email: string, password: string, options?: { first_name?: string; last_name?: string }) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading: authLoading, signUp, signIn, signOut, resetPassword } = useAuthManagement();

  // Configuration de l'écouteur d'état d'authentification
  useEffect(() => {
    console.log("AuthProvider initializing, current path:", location.pathname);
    
    // D'abord, configurer l'écouteur d'état d'authentification pour détecter les changements
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth event:', event, 'Session:', currentSession?.user?.id);
        
        // Mise à jour des états de base (session et user)
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Si l'utilisateur est connecté, charger son profil
        if (currentSession?.user) {
          console.log("Auth state change: User is authenticated");
          
          // Important : utiliser setTimeout pour éviter les deadlocks avec Supabase
          setTimeout(() => {
            loadUserProfile(currentSession.user.id)
              .then(({ profile: userProfile, businessId: userBusinessId }) => {
                setProfile(userProfile);
                setBusinessId(userBusinessId);
                setIsLoading(false);
              })
              .catch(error => {
                console.error("Error loading profile:", error);
                setIsLoading(false);
              });
          }, 0);
          
          // Redirection si sur login/signup et déjà authentifié
          if (['/login', '/signup'].includes(location.pathname)) {
            console.log("Redirecting authenticated user from login/signup to dashboard");
            navigate('/dashboard');
          }
        } else {
          console.log("Auth state change: No user session");
          setProfile(null);
          setBusinessId(null);
          setIsLoading(false);
          
          // La redirection vers /login pour les routes protégées est gérée par le composant RequireAuth
        }
      }
    );

    // Vérification initiale de la session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Initial session check:', currentSession?.user?.id);
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        console.log("Initial check: User is authenticated");
        
        // Important : utiliser setTimeout pour éviter les deadlocks avec Supabase
        setTimeout(() => {
          loadUserProfile(currentSession.user.id)
            .then(({ profile: userProfile, businessId: userBusinessId }) => {
              setProfile(userProfile);
              setBusinessId(userBusinessId);
              setIsLoading(false);
            })
            .catch(error => {
              console.error("Error loading profile:", error);
              setIsLoading(false);
            });
        }, 0);
        
        // Redirection logique pour la vérification initiale
        if (['/login', '/signup'].includes(location.pathname)) {
          console.log("Initial check: Redirecting to dashboard");
          navigate('/dashboard');
        }
      } else {
        console.log("Initial check: No authenticated user");
        setIsLoading(false);
      }
    }).catch(error => {
      console.error("Error checking session:", error);
      setIsLoading(false);
    });

    // Nettoyage de l'abonnement
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        businessId,
        isLoading: isLoading || authLoading,
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
