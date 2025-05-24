
import React from 'react';

interface BookingSuccessProps {
  onStartOver: () => void;
}

const BookingSuccess = ({ onStartOver }: BookingSuccessProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8 text-center transform animate-scale-in">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
          Réservation confirmée !
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          🎉 Fantastique ! Votre réservation a été enregistrée avec succès. 
          Vous recevrez un email de confirmation dans quelques instants.
        </p>
        <button
          onClick={onStartOver}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
        >
          ✨ Nouvelle réservation
        </button>
      </div>
    </div>
  );
};

export default BookingSuccess;
