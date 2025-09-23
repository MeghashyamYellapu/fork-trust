import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import FarmerDashboard from "./pages/FarmerDashboard";
import ValidatorDashboard from "./pages/ValidatorDashboard";
import DistributorDashboard from "./pages/DistributorDashboard";
import RetailerDashboard from "./pages/RetailerDashboard";
import ConsumerQRResult from "./pages/ConsumerQRResult";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard/farmer" element={<FarmerDashboard />} />
            <Route path="/dashboard/validator" element={<ValidatorDashboard />} />
            <Route path="/dashboard/distributor" element={<DistributorDashboard />} />
            <Route path="/dashboard/retailer" element={<RetailerDashboard />} />
            <Route path="/qr-result" element={<ConsumerQRResult />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
