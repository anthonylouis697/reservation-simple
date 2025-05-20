
import { FC } from 'react';
import { ImageIcon } from 'lucide-react';

interface PreviewTemplateHeaderProps {
  businessName: string;
  primaryColor: string;
  logo: string | null;
  templateStyle: 'standard' | 'minimal' | 'premium';
  welcomeMessage: string;
}

export const PreviewTemplateHeader: FC<PreviewTemplateHeaderProps> = ({
  businessName,
  primaryColor,
  logo,
  templateStyle,
  welcomeMessage
}) => {
  return (
    <>
      <div 
        className={`h-12 flex items-center justify-center text-white font-medium ${
          templateStyle === 'minimal' ? 'border-b' : ''
        }`}
        style={{ backgroundColor: primaryColor }}
      >
        {businessName}
      </div>
      
      <div className="flex flex-col items-center justify-center">
        <div className={`w-16 h-16 ${templateStyle === 'premium' ? 'rounded-xl' : 'rounded-full'} border flex items-center justify-center bg-white mb-2`}>
          {logo ? (
            <img src={logo} alt="Logo" className="max-h-full max-w-full object-contain" />
          ) : (
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        
        <p className={`text-sm text-center ${templateStyle === 'premium' ? 'font-medium' : ''}`}>
          {welcomeMessage}
        </p>
      </div>
    </>
  );
};
