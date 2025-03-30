
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
