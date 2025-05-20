
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import RequireAuth from '@/components/auth/RequireAuth';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Services from './pages/Services';
import CalendarPage from './pages/CalendarPage';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import Visibility from './pages/Visibility';
import BookingPage from './pages/BookingPage';
import AdditionalServices from './pages/AdditionalServices';
import Statistics from './pages/Statistics';
import Events from './pages/Events';
import Marketing from './pages/Marketing';
import Payments from './pages/Payments';
import GiftCards from './pages/GiftCards';
import HelpCenter from './pages/HelpCenter';
import ProfilePage from './pages/Account/ProfilePage';
import SecurityPage from './pages/Account/SecurityPage';
import BillingPage from './pages/Account/BillingPage';
import TeamPage from './pages/Account/TeamPage';
import SocialIntegration from './pages/SocialIntegration';
import Welcome from './pages/Welcome';
import PublicBooking from './pages/PublicBooking';
import Reservations from './pages/Reservations';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/booking/:businessSlug" element={<PublicBooking />} />

          {/* Route de bienvenue (semi-protégée) */}
          <Route path="/welcome" element={<Welcome />} />

          {/* Routes nécessitant une authentification */}
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/clients" element={<RequireAuth><Clients /></RequireAuth>} />
          <Route path="/services" element={<RequireAuth><Services /></RequireAuth>} />
          <Route path="/calendar" element={<RequireAuth><CalendarPage /></RequireAuth>} />
          <Route path="/reservations" element={<RequireAuth><Reservations /></RequireAuth>} />
          <Route path="/visibility" element={<RequireAuth><Visibility /></RequireAuth>} />
          <Route path="/visibility/booking-page" element={<RequireAuth><BookingPage /></RequireAuth>} />
          <Route path="/visibility/additional-services" element={<RequireAuth><AdditionalServices /></RequireAuth>} />
          <Route path="/visibility/social-integration" element={<RequireAuth><SocialIntegration /></RequireAuth>} />
          <Route path="/statistics" element={<RequireAuth><Statistics /></RequireAuth>} />
          <Route path="/events" element={<RequireAuth><Events /></RequireAuth>} />
          <Route path="/marketing" element={<RequireAuth><Marketing /></RequireAuth>} />
          <Route path="/payments" element={<RequireAuth><Payments /></RequireAuth>} />
          <Route path="/gift-cards" element={<RequireAuth><GiftCards /></RequireAuth>} />
          <Route path="/help" element={<RequireAuth><HelpCenter /></RequireAuth>} />

          {/* Pages de paramètres */}
          <Route path="/settings/*" element={<RequireAuth><Settings /></RequireAuth>} />

          {/* Pages de compte */}
          <Route path="/account/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
          <Route path="/account/security" element={<RequireAuth><SecurityPage /></RequireAuth>} />
          <Route path="/account/billing" element={<RequireAuth><BillingPage /></RequireAuth>} />
          <Route path="/account/team" element={<RequireAuth><TeamPage /></RequireAuth>} />
          
          {/* Route 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
