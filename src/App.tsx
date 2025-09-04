import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { dataService } from "@/services/dataService";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { TravelForm } from "./components/TravelForm";
import AIGenerate from "./pages/AIGenerate";
import ManualPlan from "./pages/ManualPlan";
import Details from "./pages/Details";
import Summary from "./pages/Summary";
import AdminPanel from "./pages/AdminPanelNew";
import TermsAndConditions from "./pages/TermsAndConditions";

const queryClient = new QueryClient();

// Initialize dataService on app start
dataService.initializeData();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />

           <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/travel-form" element={<TravelForm />} />
          <Route path="/ai-generate" element={<AIGenerate />} />
          <Route path="/manual-plan" element={<ManualPlan />} />
          <Route path="/details" element={<Details />} />
          <Route path="/details/:dayId" element={<Details />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/admin" element={<AdminPanel />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THIS LINE */}
          
          {/* Catch-all route for 404 Not Found */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
