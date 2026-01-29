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
  // Add security-focused meta tags
  useEffect(() => {
    // Add Content Security Policy meta tag
    const cspMetaTag = document.createElement('meta');
    cspMetaTag.httpEquiv = 'Content-Security-Policy';
    cspMetaTag.content = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://bblutfbzkfgpihedjknu.supabase.co;";
    document.head.appendChild(cspMetaTag);
    
    // Add AdSense-related meta tag (keeping existing functionality)
    const adsenseMetaTag = document.createElement('meta');
    adsenseMetaTag.name = 'google-adsense-account';
    adsenseMetaTag.content = 'ca-pub-4580754396684091';
    document.head.appendChild(adsenseMetaTag);
    
    // Add security headers via meta tags
    const xFrameOptionsTag = document.createElement('meta');
    xFrameOptionsTag.httpEquiv = 'X-Frame-Options';
    xFrameOptionsTag.content = 'DENY';
    document.head.appendChild(xFrameOptionsTag);
    
    const xContentTypeOptionsTag = document.createElement('meta');
    xContentTypeOptionsTag.httpEquiv = 'X-Content-Type-Options';
    xContentTypeOptionsTag.content = 'nosniff';
    document.head.appendChild(xContentTypeOptionsTag);
    
    return () => {
      // Cleanup meta tags on unmount
      document.head.removeChild(cspMetaTag);
      document.head.removeChild(adsenseMetaTag);
      document.head.removeChild(xFrameOptionsTag);
      document.head.removeChild(xContentTypeOptionsTag);
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
