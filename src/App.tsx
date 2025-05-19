
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import CalendarPage from "./pages/CalendarPage";
import BookingCustomization from "./pages/BookingCustomization";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import VisibilityBoostPage from "./components/VisibilityBoost/VisibilityBoostPage";
import HelpCenter from "./pages/HelpCenter";
import Events from "./pages/Events";
import Statistics from "./pages/Statistics";
import Clients from "./pages/Clients";
import Marketing from "./pages/Marketing";
import GiftCards from "./pages/GiftCards";
import Payments from "./pages/Payments";

// Account management pages
import ProfilePage from "./pages/Account/ProfilePage";
import TeamPage from "./pages/Account/TeamPage";
import BillingPage from "./pages/Account/BillingPage";
import SecurityPage from "./pages/Account/SecurityPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/booking-customization" element={<BookingCustomization />} />
          <Route path="/visibility-boost" element={<VisibilityBoostPage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/services" element={<Services />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/gift-cards" element={<GiftCards />} />
          <Route path="/payments" element={<Payments />} />
          
          {/* Account management routes */}
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/team" element={<TeamPage />} />
          <Route path="/account/billing" element={<BillingPage />} />
          <Route path="/account/security" element={<SecurityPage />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
