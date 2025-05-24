
import React from 'react';
import { BookingStep } from '@/components/Visibility/BookingPage/types';

interface BookingProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: BookingStep[];
}

const BookingProgress = ({ currentStep, totalSteps, steps }: BookingProgressProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="relative">
              <div 
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 transform
                  ${index <= currentStep 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-110' 
                    : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                  }
                `}
              >
                {index < currentStep ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              {index <= currentStep && (
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-ping opacity-30"></div>
              )}
            </div>
            <div className="ml-3 hidden md:block">
              <span 
                className={`
                  text-sm font-semibold transition-colors duration-300
                  ${index <= currentStep ? 'text-gray-800' : 'text-gray-500'}
                `}
              >
                {step.name}
              </span>
              {index === currentStep && (
                <div className="text-xs text-blue-600 font-medium">En cours...</div>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div 
                  className={`
                    h-1 rounded-full transition-all duration-500
                    ${index < currentStep 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-md' 
                      : 'bg-gray-200'
                    }
                  `}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner overflow-hidden">
        <div 
          className="h-3 rounded-full transition-all duration-700 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg relative"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        >
          <div className="absolute inset-0 bg-white opacity-30 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="mt-3 text-center">
        <span className="text-sm text-gray-600 font-medium">
          Étape {currentStep + 1} sur {totalSteps}
        </span>
        <div className="text-xs text-gray-500 mt-1">
          {Math.round(((currentStep + 1) / totalSteps) * 100)}% complété
        </div>
      </div>
    </div>
  );
};

export default BookingProgress;
