
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

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

  // Function to create a default business for new users
  const createDefaultBusiness = async (userId: string, firstName: string = "", lastName: string = "") => {
    try {
      // Generate a random slug for the business
      const randomSlug = `business-${uuidv4().substring(0, 8)}`;
      const businessName = firstName && lastName 
        ? `${firstName} ${lastName}`
        : "Mon entreprise";

      const { data, error } = await supabase
        .from('businesses')
        .insert([{
          owner_id: userId,
          name: businessName,
          slug: randomSlug,
          description: "Ma description d'entreprise"
        }])
        .select('id')
        .single();

      if (error) {
        console.error('Erreur lors de la création de l\'entreprise:', error);
        return null;
      }

      // Create default booking page settings
      if (data) {
        const { error: settingsError } = await supabase
          .from('booking_page_settings')
          .insert([{
            business_id: data.id,
            business_name: businessName,
            custom_url: randomSlug
          }]);

        if (settingsError) {
          console.error('Erreur lors de la création des paramètres de réservation:', settingsError);
        }
      }

      return data?.id;
    } catch (error) {
      console.error('Erreur:', error);
      return null;
    }
  };

  useEffect(() => {
    // Function to load user profile and ensure business exists
    const loadUserProfile = async (userId: string) => {
      try {
        // Load profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (profileError) {
          console.error('Erreur lors du chargement du profil:', profileError);
          return;
        }

        // Set profile data if found
        if (profileData) {
          setProfile(profileData);

          // Check if user has a business
          const { data: businessData, error: businessError } = await supabase
            .from('businesses')
            .select('id')
            .eq('owner_id', userId)
            .maybeSingle();

          if (businessError) {
            console.error('Erreur lors de la vérification de l\'entreprise:', businessError);
            return;
          }

          // Create a default business if none exists
          if (!businessData) {
            await createDefaultBusiness(userId, profileData.first_name, profileData.last_name);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
      }
    };

    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth event:', event, 'Session:', currentSession?.user?.id);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // If user is logged in, load profile
        if (currentSession?.user) {
          // Defer profile loading to prevent deadlocks
          setTimeout(() => {
            loadUserProfile(currentSession.user.id);
          }, 0);
          
          // Redirect logic for authenticated users
          // Only redirect to dashboard if user is on login/signup pages
          if (['/login', '/signup', '/'].includes(location.pathname)) {
            navigate('/dashboard');
          }
        } else {
          setProfile(null);
          
          // Redirect to login if on a protected route
          const isProtectedRoute = !['/', '/login', '/signup', '/reset-password', '/booking'].some(
            path => location.pathname === path || location.pathname.startsWith('/booking/')
          );
          
          if (isProtectedRoute) {
            navigate('/login', { state: { from: location.pathname } });
          }
        }

        setIsLoading(false);
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Initial session check:', currentSession?.user?.id);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        // Defer profile loading
        setTimeout(() => {
          loadUserProfile(currentSession.user.id);
        }, 0);
        
        // Redirect logic for the initial check
        if (['/login', '/signup', '/'].includes(location.pathname)) {
          navigate('/dashboard');
        }
      } else {
        // Handle non-authenticated state
        const isProtectedRoute = !['/', '/login', '/signup', '/reset-password', '/booking'].some(
          path => location.pathname === path || location.pathname.startsWith('/booking/')
        );
        
        if (isProtectedRoute) {
          navigate('/login', { state: { from: location.pathname } });
        }
      }
      
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

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
        navigate('/login');
      } else {
        // User was created and immediately signed in
        toast.success('Inscription réussie !');
        
        // Create default business if needed
        if (data.user) {
          await createDefaultBusiness(data.user.id, options?.first_name, options?.last_name);
        }
        
        navigate('/dashboard');
      }
    } catch (error: any) {
      // Handle specific errors
      if (error.message?.includes('User already registered')) {
        toast.error('Cet email est déjà utilisé. Veuillez vous connecter.');
      } else {
        toast.error(error.message || 'Une erreur est survenue lors de l\'inscription.');
      }
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      toast.success('Connexion réussie !');
      // Redirection handled by the auth state listener
    } catch (error: any) {
      // Handle specific error messages
      if (error.message?.includes('Email not confirmed')) {
        toast.error('Veuillez confirmer votre email avant de vous connecter.');
      } else if (error.message?.includes('Invalid login credentials')) {
        toast.error('Email ou mot de passe incorrect.');
      } else {
        toast.error(error.message || 'Une erreur est survenue lors de la connexion.');
      }
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      toast.success('Déconnexion réussie.');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue lors de la déconnexion.');
    } finally {
      setIsLoading(false);
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
