
import { CalendarDays } from 'lucide-react';
import { CardTitle, CardDescription } from '@/components/ui/card';

interface AuthFormHeaderProps {
  type: 'login' | 'signup';
}

export const AuthFormHeader = ({ type }: AuthFormHeaderProps) => {
  return (
    <>
      <div className="flex justify-center">
        <CalendarDays className="h-10 w-10 text-primary" />
      </div>
      <CardTitle className="text-2xl">
        {type === 'login' ? 'Connexion à BookWise' : 'Créer un compte BookWise'}
      </CardTitle>
      <CardDescription>
        {type === 'login' 
          ? 'Connectez-vous à votre compte pour gérer vos rendez-vous' 
          : 'Créez un compte pour commencer à utiliser BookWise'
        }
      </CardDescription>
    </>
  );
};
