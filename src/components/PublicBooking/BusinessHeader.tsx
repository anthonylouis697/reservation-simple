
import React from 'react';

interface BusinessHeaderProps {
  businessSettings: any;
  businessName?: string;
}

const BusinessHeader = ({ businessSettings, businessName }: BusinessHeaderProps) => {
  return (
    <div className="text-center mb-12">
      {businessSettings?.logo_url && (
        <div className="mb-6">
          <img 
            src={businessSettings.logo_url} 
            alt={businessSettings.name}
            className="h-20 mx-auto rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
        {businessSettings?.name || businessName || 'Réservation en ligne'}
      </h1>
      <p className="text-xl text-gray-600 font-medium">
        ✨ Bienvenue sur notre expérience de réservation unique ✨
      </p>
      <div className="mt-4 inline-block px-6 py-2 bg-white rounded-full shadow-md">
        <span className="text-sm text-gray-500">🚀 Rapide • 🎯 Simple • 🔒 Sécurisé</span>
      </div>
    </div>
  );
};

export default BusinessHeader;
