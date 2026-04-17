import "./global.css";

import { createRoot } from "react-dom/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ServiceRequests from "./pages/ServiceRequests";
import Technicians from "./pages/Technicians";
import ServiceTypes from "./pages/ServiceTypes";
import NotFound from "./pages/NotFound";
import ViewRequest from "./pages/ViewRequest";
import EditRequest from "./pages/EditRequest";
import Login from "./pages/Login";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* ✅ Only Sonner toaster (clean setup) */}
      <Sonner richColors position="top-right" />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/service-requests" element={<ServiceRequests />} />
          <Route path="/technicians" element={<Technicians />} />
          <Route path="/service-types" element={<ServiceTypes />} />
          <Route path="/service-requests/view/:id" element={<ViewRequest />} />
          <Route path="/service-requests/edit/:id" element={<EditRequest />} />
          <Route path="/login" element={<Login />} />
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);