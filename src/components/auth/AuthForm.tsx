
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SocialLoginButtons } from './SocialLoginButtons';
import { EmailPasswordForm } from './EmailPasswordForm';
import { AuthFormHeader } from './AuthFormHeader';
import { AuthFormFooter } from './AuthFormFooter';
import { useAuthFormHandlers } from './useAuthFormHandlers';

interface AuthFormProps {
  type: 'login' | 'signup';
}

const AuthForm = ({ type }: AuthFormProps) => {
  const { isLoading, handleSubmit, handleSocialAuth } = useAuthFormHandlers(type);
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-2 text-center">
        <AuthFormHeader type={type} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <SocialLoginButtons 
            isLoading={isLoading} 
            onSocialAuth={handleSocialAuth} 
          />
          
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
          
          <EmailPasswordForm 
            type={type}
            isLoading={isLoading}
            onSubmit={handleSubmit}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <AuthFormFooter type={type} />
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
