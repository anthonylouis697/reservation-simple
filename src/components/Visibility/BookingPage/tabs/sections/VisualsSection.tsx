
import { ColorAndButtonStyles } from './ColorAndButtonStyles';
import { LogoUploader } from './LogoUploader';

export function VisualsSection() {
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <ColorAndButtonStyles />
      <LogoUploader />
    </div>
  );
}
