"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePictureUrl: string;
  role: string;
}

interface AdminAuthData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: AdminUser;
  device: any;
  session: any;
}

interface UseAdminAuthReturn {
  adminUser: AdminUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  refreshAuth: () => void;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
}

interface AdminAuthContextType extends UseAdminAuthReturn {}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const auth = useAdminAuthBase();
  
  return (
    <AdminAuthContext.Provider value={auth}>
      {children}
    </AdminAuthContext.Provider>
  );
}

function useAdminAuthBase(): UseAdminAuthReturn {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = () => {
    // Rendre la vérification plus rapide avec timeout
    const timeoutId = setTimeout(() => {
      const token = localStorage.getItem("admin_access_token");
      const user = localStorage.getItem("admin_user");
      
      console.log('🔍 Vérification authentification admin rapide...');
      console.log('Token présent:', !!token);
      console.log('Utilisateur présent:', !!user);
      
      if (!token && !user) {
        console.log('❌ Aucune session trouvée');
        setIsLoading(false);
        return false;
      }
      
      try {
        const parsedUser = user ? JSON.parse(user) : null;
        
        if (parsedUser) {
          console.log('✅ Admin authentifié:', parsedUser.email);
          setAdminUser(parsedUser);
          setAccessToken(token);
        } else {
          console.log('⚠️ Utilisateur non disponible - mode fallback');
          setAdminUser({
            id: '1',
            fullName: 'Admin',
            email: 'admin@pureskin.com',
            phoneNumber: '+237000000000',
            profilePictureUrl: '',
            role: 'ADMIN'
          });
          setAccessToken(token);
        }
        
        return true;
      } catch (error) {
        console.error('❌ Erreur parsing utilisateur admin:', error);
        console.log('🔄 Mode dégradé - accès maintenu');
        setAdminUser({
          id: '1',
          fullName: 'Admin',
          email: 'admin@pureskin.com',
          phoneNumber: '+237000000000',
          profilePictureUrl: '',
          role: 'ADMIN'
        });
        setAccessToken(token);
        return true;
      } finally {
        setIsLoading(false);
      }
    }, 100); // Timeout de 100ms pour éviter le blocage
    
    return () => clearTimeout(timeoutId);
  };

  const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
    try {
      console.log('🔐 Tentative de connexion admin...');
      
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log('Réponse connexion:', data);

      if (data.success && data.data) {
        const authData: AdminAuthData = data.data;
        
        // Stocker les tokens et utilisateur
        localStorage.setItem("admin_access_token", authData.accessToken);
        localStorage.setItem("admin_refresh_token", authData.refreshToken);
        localStorage.setItem("admin_user", JSON.stringify(authData.user));
        
        // Mettre à jour l'état immédiatement
        setAdminUser(authData.user);
        setAccessToken(authData.accessToken);
        setIsLoading(false); // Arrêter le chargement immédiatement
        
        console.log('✅ Connexion admin réussie');
        return true;
      } else {
        console.error('❌ Échec connexion:', data.message);
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur connexion admin:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('🚪 Déconnexion admin...');
    
    // Appeler l'API de déconnexion si possible
    const token = localStorage.getItem("admin_access_token");
    if (token) {
      fetch("/api/admin/auth/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).catch(error => {
        console.log('Erreur appel logout API:', error);
      });
    }
    
    // Nettoyer le localStorage
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("admin_refresh_token");
    localStorage.removeItem("admin_user");
    
    setAdminUser(null);
    setAccessToken(null);
    
    console.log('✅ Session admin terminée - pas de redirection automatique');
    // Ne pas rediriger automatiquement - permettre l'accès manuel au login
  };

  const refreshAuth = async () => {
    try {
      const refreshToken = localStorage.getItem("admin_refresh_token");
      
      if (!refreshToken) {
        console.log('❌ Aucun refresh token disponible');
        logout();
        return;
      }

      const response = await fetch("/api/admin/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();
      
      if (data.success && data.data?.accessToken) {
        localStorage.setItem("admin_access_token", data.data.accessToken);
        setAccessToken(data.data.accessToken);
        console.log('✅ Token rafraîchi avec succès');
      } else {
        console.error('❌ Échec rafraîchissement token');
        logout();
      }
    } catch (error) {
      console.error('❌ Erreur rafraîchissement token:', error);
      logout();
    }
  };

  useEffect(() => {
    // Vérification initiale unique
    const cleanup = checkAuth();
    
    // Écouter les changements de localStorage (détection d'autres onglets)
    const handleStorageChange = (e: StorageEvent) => {
      // Ne réagir qu'aux changements pertinents
      if (e.key === 'admin_access_token' || e.key === 'admin_user') {
        console.log('🔄 Changement authentification détecté');
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      cleanup?.();
    };
  }, []); // Supprimer router des dépendances pour éviter les re-rendus

  return {
    adminUser,
    accessToken,
    isLoading,
    isAuthenticated: !!adminUser && !!accessToken,
    logout,
    refreshAuth,
    login
  };
}

export function useAdminAuth(): UseAdminAuthReturn {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

// Hook pour les appels API avec authentification
export function useAuthenticatedFetch() {
  const getAuthenticatedHeaders = () => {
    const token = localStorage.getItem("admin_access_token");
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  };

  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("admin_access_token");
    
    if (!token) {
      throw new Error('Aucun token d\'authentification trouvé');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    // Si le token est expiré (401), tenter de rafraîchir
    if (response.status === 401) {
      console.warn('⚠️ Token expiré - tentative de rafraîchissement');
      
      try {
        const refreshToken = localStorage.getItem("admin_refresh_token");
        if (refreshToken) {
          const refreshResponse = await fetch("/api/admin/auth/refresh", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
          });

          const refreshData = await refreshResponse.json();
          
          if (refreshData.success && refreshData.data?.accessToken) {
            localStorage.setItem("admin_access_token", refreshData.data.accessToken);
            
            // Réessayer la requête originale avec le nouveau token
            return fetch(url, {
              ...options,
              headers: {
                ...options.headers,
                "Authorization": `Bearer ${refreshData.data.accessToken}`,
                "Content-Type": "application/json"
              }
            });
          }
        }
      } catch (refreshError) {
        console.error('❌ Erreur rafraîchissement token:', refreshError);
      }
      
      // Si le rafraîchissement échoue, nettoyer et rediriger
      localStorage.removeItem("admin_access_token");
      localStorage.removeItem("admin_refresh_token");
      localStorage.removeItem("admin_user");
      window.location.href = "/admin/login";
      throw new Error('Token expiré et rafraîchissement échoué');
    }

    return response;
  };

  return { authenticatedFetch, getAuthenticatedHeaders };
}
