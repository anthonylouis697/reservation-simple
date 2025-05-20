
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthForm from '@/components/auth/AuthForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Bienvenue sur BookWise</h1>
            <p className="text-sm text-muted-foreground">
              Connectez-vous à votre compte pour gérer vos rendez-vous
            </p>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-6">
              <AuthForm type="login" />
            </TabsContent>
            <TabsContent value="signup" className="mt-6">
              <AuthForm type="signup" />
            </TabsContent>
          </Tabs>
          
          <div className="text-center mt-6 space-y-2">
            <p className="text-sm">
              Vous cherchez à prendre rendez-vous ? <br />
              <Link to="/" className="text-primary font-medium hover:underline">
                Retournez à l'accueil
              </Link>
            </p>
          </div>
          
          <div className="text-center space-y-2 border-t pt-6 text-sm text-muted-foreground">
            <p>BookWise est la solution tout-en-un pour les professionnels</p>
            <div className="flex justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mr-1"></div>
                <span>Agenda en ligne</span>
              </div>
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mr-1"></div>
                <span>Gestion clients</span>
              </div>
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mr-1"></div>
                <span>Paiements</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
