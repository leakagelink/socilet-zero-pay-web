
import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Admin from "./pages/Admin";
import FaqPage from "./pages/FaqPage";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import ReferralLanding from "./pages/ReferralLanding";
import VersionChecker from "./components/VersionChecker";
import { initializeAnalytics } from './lib/firebase';

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
  // Initialize Firebase Analytics when the app loads
  useEffect(() => {
    const setupAnalytics = async () => {
      const analytics = await initializeAnalytics();
      if (analytics) {
        console.log('Firebase Analytics initialized successfully');
      }
    };
    
    setupAnalytics();
    
    // Add AdSense-related meta tag to head
    const adsenseMetaTag = document.createElement('meta');
    adsenseMetaTag.name = 'google-adsense-account';
    adsenseMetaTag.content = 'ca-pub-placeholder'; // Replace with your actual AdSense Publisher ID when you get one
    document.head.appendChild(adsenseMetaTag);
    
    // Add AdSense consent mode meta tag
    const consentMetaTag = document.createElement('meta');
    consentMetaTag.name = 'ad-consent';
    consentMetaTag.content = 'pending';
    document.head.appendChild(consentMetaTag);
    
    return () => {
      document.head.removeChild(adsenseMetaTag);
      document.head.removeChild(consentMetaTag);
    };
  }, []);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
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
              <Route path="/admin" element={<Admin />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/refer/:referrerId" element={<ReferralLanding />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
