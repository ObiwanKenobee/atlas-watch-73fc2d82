import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import CommandCenter from "./pages/CommandCenter";
import AgentDetail from "./pages/AgentDetail";
import AlertsPage from "./pages/AlertsPage";
import ConvergencePage from "./pages/ConvergencePage";
import RegistryPage from "./pages/RegistryPage";
import GovernancePage from "./pages/GovernancePage";
import SandboxPage from "./pages/SandboxPage";
import MapPage from "./pages/MapPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<CommandCenter />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/agents/:id" element={<AgentDetail />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/convergence" element={<ConvergencePage />} />
            <Route path="/registry" element={<RegistryPage />} />
            <Route path="/governance" element={<GovernancePage />} />
            <Route path="/sandbox" element={<SandboxPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
