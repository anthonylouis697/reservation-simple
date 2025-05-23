
import { ColorAndButtonStyles } from './sections/ColorAndButtonStyles';
import { LogoUploader } from './sections/LogoUploader';

export function CustomizeTab() {
  return (
    <div className="space-y-6">
      <ColorAndButtonStyles />
      <LogoUploader />
    </div>
  );
}
