
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
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div 
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${index <= currentStep 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}
            >
              {index + 1}
            </div>
            <span 
              className={`
                ml-2 text-sm font-medium
                ${index <= currentStep ? 'text-blue-600' : 'text-gray-500'}
              `}
            >
              {step.name}
            </span>
            {index < steps.length - 1 && (
              <div 
                className={`
                  w-12 h-0.5 mx-4
                  ${index < currentStep ? 'bg-blue-600' : 'bg-gray-200'}
                `}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default BookingProgress;
