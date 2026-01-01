import { useState, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getConsultants, ADMIN_PASSWORD } from "./lib/mockData";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Consultants from "./pages/Consultants";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userName: string;
  consultantId?: string;
}

const App = () => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    isAdmin: false,
    userName: "",
    consultantId: undefined,
  });

  const handleLogin = useCallback((type: 'admin' | 'consultant', consultantId?: string, password?: string): boolean => {
    if (type === 'admin') {
      if (password === ADMIN_PASSWORD) {
        setAuth({
          isAuthenticated: true,
          isAdmin: true,
          userName: "Admin",
          consultantId: undefined,
        });
        return true;
      }
      return false;
    }

    // Consultant login
    const consultants = getConsultants();
    const consultant = consultants.find(c => c.id === consultantId);
    if (consultant && password === consultant.password) {
      setAuth({
        isAuthenticated: true,
        isAdmin: false,
        userName: consultant.name,
        consultantId: consultant.id,
      });
      return true;
    }

    return false;
  }, []);

  const handleLogout = () => {
    setAuth({
      isAuthenticated: false,
      isAdmin: false,
      userName: "",
      consultantId: undefined,
    });
  };

  const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
    if (!auth.isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    if (adminOnly && !auth.isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/login" 
              element={
                auth.isAuthenticated 
                  ? <Navigate to="/dashboard" replace /> 
                  : <Login onLogin={handleLogin} />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard 
                    isAdmin={auth.isAdmin}
                    userName={auth.userName}
                    consultantId={auth.consultantId}
                    onLogout={handleLogout}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/vendas" 
              element={
                <ProtectedRoute>
                  <Sales 
                    isAdmin={auth.isAdmin}
                    userName={auth.userName}
                    consultantId={auth.consultantId}
                    onLogout={handleLogout}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/consultores" 
              element={
                <ProtectedRoute adminOnly>
                  <Consultants onLogout={handleLogout} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/configuracoes" 
              element={
                <ProtectedRoute adminOnly>
                  <Settings onLogout={handleLogout} />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
