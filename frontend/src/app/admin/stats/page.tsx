"use client";

import { useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { 
  Users, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Home
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
  pendingOrders: number;
  averageRating: number;
  monthlyRevenue: number;
  monthlyOrders: number;
}

export default function AdminStatsPage() {
  const { adminUser, isLoading, isAuthenticated, logout } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    averageRating: 0,
    monthlyRevenue: 0,
    monthlyOrders: 0
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Le hook gère la redirection automatique
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin/stats" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">PureSkin Stats</h1>
                  <p className="text-xs text-gray-500">Statistiques administrateur</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {adminUser?.fullName || adminUser?.email || 'Admin'}
                  </p>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-xs text-green-600">En ligne</p>
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
                title="Se déconnecter"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4 4m4-4v18" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 2.75m0 18.5l5.06-5.06a5.5 5.5 0 0 0 7.78 0L12 21.25" />
                </svg>
                <span className="text-sm">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Welcome Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-400 rounded-full mr-3"></div>
              <div>
                <h3 className="text-sm font-medium text-green-800">
                  Bienvenue, {adminUser?.fullName || adminUser?.email || 'Admin'} !
                </h3>
                <p className="text-xs text-green-600 mt-1">
                  Vous êtes connecté aux statistiques PureSkin
                </p>
              </div>
            </div>
            <div className="text-xs text-green-600">
              Session active
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commandes totales</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                <p className="text-xs text-green-600 mt-1">+{stats.monthlyOrders} ce mois</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenu total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString('fr-FR')} €</p>
                <p className="text-xs text-green-600 mt-1">+{stats.monthlyRevenue.toLocaleString('fr-FR')} € ce mois</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-blue-600 mt-1">Clients actifs</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Produits</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                <p className="text-xs text-orange-600 mt-1">En catalogue</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation rapide</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Home className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Dashboard complet</p>
                <p className="text-sm text-gray-500">Vue d'ensemble</p>
              </div>
            </Link>
            
            <Link
              href="/admin/orders"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Commandes</p>
                <p className="text-sm text-gray-500">Gestion des commandes</p>
              </div>
            </Link>
            
            <Link
              href="/admin/products"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Package className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Produits</p>
                <p className="text-sm text-gray-500">Gestion des produits</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
