
import React from 'react';
import { BookingPageCustomization } from '@/components/Visibility/BookingPage/BookingPageCustomization';

const BookingCustomization = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold">Personnalisation de la page de réservation</h1>
        <p className="text-muted-foreground">
          Personnalisez l'apparence et les options de partage de votre page de réservation
        </p>
      </div>
      
      <BookingPageCustomization />
    </div>
  );
};

export default BookingCustomization;
