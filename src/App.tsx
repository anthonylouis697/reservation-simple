
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ResetPassword from '@/pages/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import CalendarPage from '@/pages/CalendarPage';
import ClientsPage from '@/pages/Clients';
import Services from '@/pages/Services';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import RequireAuth from '@/components/auth/RequireAuth';
import BookingPage from '@/pages/BookingPage';
import BookingCustomization from '@/pages/BookingCustomization';
import BookingLink from '@/pages/BookingLink';
import AdditionalServices from '@/pages/AdditionalServices';
import Marketing from '@/pages/Marketing';
import Visibility from '@/pages/Visibility';
import Reservations from '@/pages/Reservations';
import Statistics from '@/pages/Statistics';
import Welcome from '@/pages/Welcome';
import Payments from '@/pages/Payments';
import Events from '@/pages/Events';
import AccountLayout from '@/components/Account/AccountLayout';
import ProfilePage from '@/pages/Account/ProfilePage';
import BillingPage from '@/pages/Account/BillingPage';
import SecurityPage from '@/pages/Account/SecurityPage';
import TeamPage from '@/pages/Account/TeamPage';
import { AuthProvider } from '@/contexts/AuthContext';
import PublicBooking from '@/pages/PublicBooking';
import ErrorBoundary from '@/components/ErrorBoundary';
import { BusinessProvider } from '@/contexts/BusinessContext';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <BusinessProvider>
            <Routes>
              {/* Public routes - accessible to everyone including authenticated users */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/booking/:businessSlug" element={<PublicBooking />} />
              
              {/* Protected routes */}
              <Route path="/welcome" element={<RequireAuth><Welcome /></RequireAuth>} />
              <Route path="/dashboard" element={<RequireAuth><Navigate to="/calendar" replace /></RequireAuth>} />
              <Route path="/calendar" element={<RequireAuth><CalendarPage /></RequireAuth>} />
              <Route path="/clients" element={<RequireAuth><ClientsPage /></RequireAuth>} />
              <Route path="/services" element={<RequireAuth><Services /></RequireAuth>} />
              <Route path="/events" element={<RequireAuth><Events /></RequireAuth>} />
              <Route path="/reservations" element={<RequireAuth><Reservations /></RequireAuth>} />
              <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
              <Route path="/booking-page" element={<RequireAuth><BookingPage /></RequireAuth>} />
              <Route path="/booking-link" element={<RequireAuth><BookingLink /></RequireAuth>} />
              <Route path="/booking-customization" element={<RequireAuth><BookingCustomization /></RequireAuth>} />
              <Route path="/visibility-boost" element={<RequireAuth><Visibility /></RequireAuth>} />
              <Route path="/marketing" element={<RequireAuth><Marketing /></RequireAuth>} />
              <Route path="/additional-services" element={<RequireAuth><AdditionalServices /></RequireAuth>} />
              <Route path="/payments" element={<RequireAuth><Payments /></RequireAuth>} />
              
              {/* Profil direct sans imbrication */}
              <Route path="/account/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
              <Route path="/account/billing" element={<RequireAuth><BillingPage /></RequireAuth>} />
              <Route path="/account/security" element={<RequireAuth><SecurityPage /></RequireAuth>} />
              <Route path="/account/team" element={<RequireAuth><TeamPage /></RequireAuth>} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster position="top-right" />
          </BusinessProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
