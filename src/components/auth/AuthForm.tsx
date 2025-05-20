
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { SocialLoginButtons } from './SocialLoginButtons';
import { EmailPasswordForm } from './EmailPasswordForm';
import { AuthFormHeader } from './AuthFormHeader';
import { AuthFormFooter } from './AuthFormFooter';
import { useAuth } from '@/contexts/AuthContext';

interface AuthFormProps {
  type: 'login' | 'signup';
}

const AuthForm = ({ type }: AuthFormProps) => {
  const { isLoading } = useAuth();
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-2 text-center">
        <AuthFormHeader type={type} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <SocialLoginButtons isLoading={isLoading} />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                ou avec un email
              </span>
            </div>
          </div>
          
          <EmailPasswordForm type={type} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <AuthFormFooter type={type} />
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
