
import type { CSSProperties } from 'react';
import { BookingTemplate } from '../../types';

// Function to generate template-specific styles
export const getTemplateStyles = (template: BookingTemplate): CSSProperties => {
  const baseStyles: CSSProperties = {
    backgroundColor: template.colors.background,
    color: template.colors.text,
  };

  switch (template.style) {
    case 'minimal':
      return {
        ...baseStyles,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      };
    case 'premium':
      return {
        ...baseStyles,
        fontFamily: 'Georgia, serif',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
      };
    case 'standard':
    default:
      return {
        ...baseStyles,
        fontFamily: 'Inter, sans-serif',
      };
  }
};
