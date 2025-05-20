
interface AuthFormFooterProps {
  type: 'login' | 'signup';
}

export const AuthFormFooter = ({ type }: AuthFormFooterProps) => {
  return (
    <p className="text-sm text-gray-500">
      {type === 'login' 
        ? 'Vous n\'avez pas de compte? ' 
        : 'Vous avez déjà un compte? '
      }
      <a 
        href={type === 'login' ? '/signup' : '/login'} 
        className="text-primary hover:underline"
      >
        {type === 'login' ? 'S\'inscrire' : 'Se connecter'}
      </a>
    </p>
  );
};
