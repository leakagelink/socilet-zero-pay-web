
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
import Login from "./pages/Login";
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
              <Route path="/login" element={<Login />} />
              <Route path="/zero-advance-payment" element={<ZeroAdvancePayment />} />
              <Route path="/website-development" element={<WebsiteDevelopment />} />
              <Route path="/app-development" element={<AppDevelopment />} />
              <Route path="/ai-spokesperson" element={<AiSpokesperson />} />
              <Route path="/business-profile" element={<BusinessProfile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
