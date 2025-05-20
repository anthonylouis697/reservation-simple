
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
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading: authLoading, signUp, signIn, signOut, resetPassword } = useAuthManagement();

  useEffect(() => {
    console.log("AuthProvider useEffect running, current path:", location.pathname);
    console.log("Auth state at mount:", { hasUser: !!user, isLoading });
    
    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth event:', event, 'Session:', currentSession?.user?.id);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // If user is logged in, load profile
        if (currentSession?.user) {
          console.log("User is authenticated, current path:", location.pathname);
          
          // Defer profile loading to prevent deadlocks
          setTimeout(() => {
            loadUserProfile(currentSession.user.id).then(({ profile: userProfile }) => {
              setProfile(userProfile);
            });
          }, 0);
          
          // Redirect logic for authenticated users
          // Only redirect to dashboard if user is on login/signup/home pages
          if (['/login', '/signup', '/'].includes(location.pathname)) {
            console.log("Redirecting authenticated user to dashboard from", location.pathname);
            navigate('/dashboard');
          }
        } else {
          console.log("No user session detected");
          setProfile(null);
          
          // Redirect to login if on a protected route
          const isProtectedRoute = !['/', '/login', '/signup', '/reset-password', '/booking'].some(
            path => location.pathname === path || location.pathname.startsWith('/booking/')
          );
          
          if (isProtectedRoute) {
            console.log("Redirecting unauthenticated user to login from protected route:", location.pathname);
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
        console.log("Initial check: User is authenticated");
        
        // Defer profile loading
        setTimeout(() => {
          loadUserProfile(currentSession.user.id).then(({ profile: userProfile }) => {
            setProfile(userProfile);
          });
        }, 0);
        
        // Redirect logic for the initial check
        if (['/login', '/signup', '/'].includes(location.pathname)) {
          console.log("Initial check: Redirecting to dashboard");
          navigate('/dashboard');
        }
      } else {
        console.log("Initial check: No authenticated user");
        // Handle non-authenticated state
        const isProtectedRoute = !['/', '/login', '/signup', '/reset-password', '/booking'].some(
          path => location.pathname === path || location.pathname.startsWith('/booking/')
        );
        
        if (isProtectedRoute) {
          console.log("Initial check: Redirecting to login");
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

  // Notify user of authentication status via console
  useEffect(() => {
    if (user && !isLoading) {
      console.log("User is authenticated:", user.email);
    }
  }, [user, isLoading]);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
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
