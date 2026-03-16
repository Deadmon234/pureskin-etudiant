"use client";

import { useState, useEffect } from "react";

interface FarotyAuthData {
  accessToken: string;
  refreshToken: string;
  email: string;
  expiresAt: number;
}

interface UseFarotyAuthReturn {
  farotyToken: string | null;
  farotyEmail: string | null;
  isFarotyAuthenticated: boolean;
  farotyLogin: (email: string, otp: string) => Promise<boolean>;
  farotyLogout: () => void;
  farotyRefresh: () => Promise<boolean>;
}

export function useFarotyAuth(): UseFarotyAuthReturn {
  const [farotyToken, setFarotyToken] = useState<string | null>(null);
  const [farotyEmail, setFarotyEmail] = useState<string | null>(null);

  useEffect(() => {
    // Charger les tokens Faroty depuis localStorage (séparés des tokens admin)
    const token = localStorage.getItem("faroty_access_token");
    const email = localStorage.getItem("faroty_email");
    
    setFarotyToken(token);
    setFarotyEmail(email);
  }, []);

  const farotyLogin = async (email: string, otp: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/faroty/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      
      if (data.success && data.data) {
        // Stocker les tokens Faroty séparément
        localStorage.setItem("faroty_access_token", data.data.accessToken);
        localStorage.setItem("faroty_refresh_token", data.data.refreshToken);
        localStorage.setItem("faroty_email", email);
        
        setFarotyToken(data.data.accessToken);
        setFarotyEmail(email);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur connexion Faroty:", error);
      return false;
    }
  };

  const farotyLogout = () => {
    localStorage.removeItem("faroty_access_token");
    localStorage.removeItem("faroty_refresh_token");
    localStorage.removeItem("faroty_email");
    
    setFarotyToken(null);
    setFarotyEmail(null);
  };

  const farotyRefresh = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem("faroty_refresh_token");
      if (!refreshToken) return false;

      const response = await fetch("/api/faroty/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();
      
      if (data.success && data.data?.accessToken) {
        localStorage.setItem("faroty_access_token", data.data.accessToken);
        setFarotyToken(data.data.accessToken);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Erreur refresh Faroty:", error);
      return false;
    }
  };

  return {
    farotyToken,
    farotyEmail,
    isFarotyAuthenticated: !!farotyToken,
    farotyLogin,
    farotyLogout,
    farotyRefresh,
  };
}
