
import { CSSProperties } from 'react';

// Define ButtonCorners type directly since it's not exported from the types file
type ButtonCorners = "rounded" | "squared" | "pill";

interface ButtonStyleProps {
  buttonCorners: ButtonCorners;
  primaryColor: string;
}

export const useButtonStyle = ({ buttonCorners, primaryColor }: ButtonStyleProps) => {
  /**
   * Returns styling classes and inline styles for buttons based on configuration
   */
  const getButtonStyle = () => {
    // Déterminer la classe de bord arrondi
    let borderRadiusClass = '';
    let borderRadiusStyle = '';
    
    switch (buttonCorners) {
      case 'squared': 
        borderRadiusClass = 'rounded-none'; 
        borderRadiusStyle = '0px';
        break;
      case 'rounded': 
        borderRadiusClass = 'rounded-md'; 
        borderRadiusStyle = '6px';
        break;
      case 'pill': 
        borderRadiusClass = 'rounded-full'; 
        borderRadiusStyle = '9999px';
        break;
      default: 
        borderRadiusClass = 'rounded-md';
        borderRadiusStyle = '6px';
    }
    
    // L'objet de style complet pour les boutons
    const style = {
      backgroundColor: primaryColor, 
      borderColor: primaryColor,
      borderRadius: borderRadiusStyle
    };
    
    return {
      className: `${borderRadiusClass} transition-colors`,
      style
    };
  };
  
  return { getButtonStyle };
};
