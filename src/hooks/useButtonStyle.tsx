
import { ButtonCorners } from '@/components/Visibility/BookingPage/types';
import { CSSProperties } from 'react';

interface ButtonStyleProps {
  buttonCorners: ButtonCorners;
  primaryColor: string;
}

export const useButtonStyle = ({ buttonCorners, primaryColor }: ButtonStyleProps) => {
  /**
   * Returns styling classes and inline styles for buttons based on configuration
   */
  const getButtonStyle = () => {
    let roundedClass = '';
    
    switch (buttonCorners) {
      case 'squared': roundedClass = 'rounded-none'; break;
      case 'rounded': roundedClass = 'rounded-md'; break;
      case 'pill': roundedClass = 'rounded-full'; break;
      default: roundedClass = 'rounded-md';
    }
    
    return {
      className: `${roundedClass} transition-colors`,
      style: { backgroundColor: primaryColor, borderColor: primaryColor } as CSSProperties
    };
  };
  
  return { getButtonStyle };
};
