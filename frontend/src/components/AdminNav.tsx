"use client";

import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { 
  Users, 
  Package, 
  CreditCard, 
  Wallet, 
  BarChart3, 
  Video,
  LogOut
} from "lucide-react";

export function AdminNav() {
  const router = useRouter();
  const { logout } = useAdminAuth();

  const handleLogout = async () => {
    try {
      // Appeler l'API de déconnexion
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      // Nettoyer le localStorage
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_refresh_token');
      localStorage.removeItem('admin_email');
      localStorage.removeItem('admin_user');
      
      // Rediriger vers la page de login
      router.push('/admin/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // En cas d'erreur, quand même nettoyer et rediriger
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_refresh_token');
      localStorage.removeItem('admin_email');
      localStorage.removeItem('admin_user');
      router.push('/admin/login');
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">PureSkin Admin</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/admin/produit")}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Package className="w-4 h-4 inline mr-2" />
              Produits
            </button>
            
            <button
              onClick={() => router.push("/admin/videos")}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Video className="w-4 h-4 inline mr-2" />
              Vidéos
            </button>
            
            <button
              onClick={() => router.push("/admin/paiement/pagePaiement")}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <CreditCard className="w-4 h-4 inline mr-2" />
              Paiements
            </button>
            
            <button
              onClick={() => router.push("/admin/transactions")}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Wallet className="w-4 h-4 inline mr-2" />
              Transactions
            </button>
            
            <button
              onClick={() => router.push("/admin/community")}
              className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Users className="w-4 h-4 inline mr-2" />
              Communauté
            </button>
            
            <button
              onClick={() => router.push("/admin/stats")}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Statistiques
            </button>
            
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4 inline mr-2" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
