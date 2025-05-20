
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/CalendarPage';
import Clients from './pages/Clients';
import Services from './pages/Services';
import Statistics from './pages/Statistics';
import Marketing from './pages/Marketing';
import Events from './pages/Events';
import Payments from './pages/Payments';
import Settings from './pages/Settings';
import Visibility from './pages/Visibility';
import BookingPage from './pages/BookingPage';
import AdditionalServices from './pages/AdditionalServices';
import NotFound from './pages/NotFound';
import SocialIntegration from './pages/SocialIntegration';
import GiftCards from './pages/GiftCards';
import HelpCenter from './pages/HelpCenter';
import Welcome from './pages/Welcome';

// Account routes
import ProfilePage from './pages/Account/ProfilePage';
import SecurityPage from './pages/Account/SecurityPage';
import TeamPage from './pages/Account/TeamPage';
import BillingPage from './pages/Account/BillingPage';

// Components
import { OnboardingGuide } from './components/OnboardingGuide';

function App() {
  return (
    <Router>
      <Toaster position="top-right" closeButton />
      <OnboardingGuide />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Welcome page for new users */}
        <Route path="/welcome" element={<Welcome />} />
        
        {/* App routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/services" element={<Services />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/marketing" element={<Marketing />} />
        <Route path="/events" element={<Events />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/visibility" element={<Visibility />} />
        <Route path="/visibility/booking-page" element={<BookingPage />} />
        <Route path="/visibility/additional-services" element={<AdditionalServices />} />
        <Route path="/social-integration" element={<SocialIntegration />} />
        <Route path="/gift-cards" element={<GiftCards />} />
        <Route path="/help" element={<HelpCenter />} />
        
        {/* Account routes */}
        <Route path="/account/profile" element={<ProfilePage />} />
        <Route path="/account/security" element={<SecurityPage />} />
        <Route path="/account/team" element={<TeamPage />} />
        <Route path="/account/billing" element={<BillingPage />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
