
import { BookingTemplate } from '../../types';

export const getTemplateStyles = (template: BookingTemplate): React.CSSProperties => {
  const styles: React.CSSProperties = {
    backgroundColor: template.colors.background,
    color: template.colors.text,
  };
  
  if (template.style === 'minimal') {
    styles.boxShadow = 'none';
  } else if (template.style === 'premium') {
    styles.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
    styles.borderWidth = '0';
  }
  
  return styles;
};
