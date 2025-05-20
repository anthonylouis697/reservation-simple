
import { createContext, useContext, ReactNode } from 'react';
import { BookingPageContextType } from './types';
import { useBookingPageState } from './hooks/useBookingPageState';

const BookingPageContext = createContext<BookingPageContextType | undefined>(undefined);

interface BookingPageProviderProps {
  children: ReactNode;
}

export function BookingPageProvider({ children }: BookingPageProviderProps) {
  const bookingPageState = useBookingPageState();

  return (
    <BookingPageContext.Provider value={bookingPageState}>
      {children}
    </BookingPageContext.Provider>
  );
}

export function useBookingPage() {
  const context = useContext(BookingPageContext);
  if (context === undefined) {
    throw new Error('useBookingPage must be used within a BookingPageProvider');
  }
  return context;
}
