
import React from 'react';

interface BusinessHeaderProps {
  businessName: string;
  welcomeMessage?: string;
  logo?: string | null;
  primaryColor: string;
}

const BusinessHeader = ({ businessName, welcomeMessage, logo, primaryColor }: BusinessHeaderProps) => {
  return (
    <div className="mb-8 text-center">
      {logo && (
        <div className="mb-4 flex justify-center">
          <img src={logo} alt={businessName} className="h-16 max-w-full object-contain" />
        </div>
      )}
      <h1 className="text-3xl font-bold" style={{ color: primaryColor }}>{businessName}</h1>
      {welcomeMessage && <p className="mt-2 text-gray-600">{welcomeMessage}</p>}
    </div>
  );
};

export default BusinessHeader;
