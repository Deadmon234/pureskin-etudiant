"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface UseAdminPaymentAuthReturn {
  accessToken: string | null;
  email: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

interface AdminPaymentAuthContextType extends UseAdminPaymentAuthReturn {}

const AdminPaymentAuthContext = createContext<AdminPaymentAuthContextType | undefined>(undefined);

export function AdminPaymentAuthProvider({ children }: { children: ReactNode }) {
  const auth = useAdminPaymentAuthBase();
  
  return (
    <AdminPaymentAuthContext.Provider value={auth}>
      {children}
    </AdminPaymentAuthContext.Provider>
  );
}

function useAdminPaymentAuthBase(): UseAdminPaymentAuthReturn {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier l'authentification admin simple depuis localStorage
    const checkAuth = () => {
      const token = localStorage.getItem("admin_token");
      const adminEmail = localStorage.getItem("admin_email");
      
      if (token && adminEmail) {
        setAccessToken(token);
        setEmail(adminEmail);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_email");
    setAccessToken(null);
    setEmail(null);
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  return {
    accessToken,
    email,
    isAuthenticated,
    isLoading,
    logout
  };
}

export function useAdminPaymentAuth(): UseAdminPaymentAuthReturn {
  const context = useContext(AdminPaymentAuthContext);
  if (context === undefined) {
    throw new Error('useAdminPaymentAuth must be used within an AdminPaymentAuthProvider');
  }
  return context;
}
