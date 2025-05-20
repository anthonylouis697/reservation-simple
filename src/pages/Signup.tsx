
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthForm from '@/components/auth/AuthForm';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Créez votre compte BookWise</h1>
            <p className="text-sm text-muted-foreground">
              Inscrivez-vous pour commencer à gérer vos réservations en ligne
            </p>
          </div>
          
          <AuthForm type="signup" />
          
          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>
              En créant un compte, vous acceptez nos{" "}
              <a href="#" className="text-primary hover:underline">
                conditions d'utilisation
              </a>{" "}
              et notre{" "}
              <a href="#" className="text-primary hover:underline">
                politique de confidentialité
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
