import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import TrackMyProject from "./pages/TrackMyProject";
import Affiliate from "./pages/Affiliate";
import ZeroAdvancePayment from "./pages/ZeroAdvancePayment";
import NotFound from "./pages/NotFound";
import WebsiteDevelopment from "./pages/WebsiteDevelopment";
import AppDevelopment from "./pages/AppDevelopment";
import AiSpokesperson from "./pages/AiSpokesperson";
import BusinessProfile from "./pages/BusinessProfile";
import AdminPanel from "./pages/AdminPanel";
import FaqPage from "./pages/FaqPage";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import ReferralLanding from "./pages/ReferralLanding";
import Meetings from "./pages/Meetings";
import HireIndianDeveloper from "./pages/HireIndianDeveloper";
import VersionChecker from "./components/VersionChecker";

// Create a new QueryClient instance outside of the component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  // Add AdSense meta tag
  useEffect(() => {
    const adsenseMetaTag = document.createElement('meta');
    adsenseMetaTag.name = 'google-adsense-account';
    adsenseMetaTag.content = 'ca-pub-4580754396684091';
    document.head.appendChild(adsenseMetaTag);
    
    return () => {
      document.head.removeChild(adsenseMetaTag);
    };
  }, []);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <VersionChecker />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/track-project" element={<TrackMyProject />} />
                <Route path="/affiliate" element={<Affiliate />} />
                <Route path="/zero-advance-payment" element={<ZeroAdvancePayment />} />
                <Route path="/website-development" element={<WebsiteDevelopment />} />
                <Route path="/app-development" element={<AppDevelopment />} />
                <Route path="/ai-spokesperson" element={<AiSpokesperson />} />
                <Route path="/business-profile" element={<BusinessProfile />} />
                <Route path="/admin-panel" element={<AdminPanel />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/refer/:referrerId" element={<ReferralLanding />} />
                <Route path="/meetings" element={<Meetings />} />
                <Route path="/hire-indian-developer" element={<HireIndianDeveloper />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
