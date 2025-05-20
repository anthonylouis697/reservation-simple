
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/booking/:businessSlug" element={<PublicBooking />} />

        {/* Routes nécessitant une authentification */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/services" element={<Services />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/visibility" element={<Visibility />} />
        <Route path="/visibility/booking-page" element={<BookingPage />} />
        <Route path="/visibility/additional-services" element={<AdditionalServices />} />
        <Route path="/visibility/social-integration" element={<SocialIntegration />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/events" element={<Events />} />
        <Route path="/marketing" element={<Marketing />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/gift-cards" element={<GiftCards />} />
        <Route path="/help" element={<HelpCenter />} />

        {/* Pages de paramètres */}
        <Route path="/settings/*" element={<Settings />} />

        {/* Pages de compte */}
        <Route path="/account/profile" element={<ProfilePage />} />
        <Route path="/account/security" element={<SecurityPage />} />
        <Route path="/account/billing" element={<BillingPage />} />
        <Route path="/account/team" element={<TeamPage />} />
        
        {/* Route 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
