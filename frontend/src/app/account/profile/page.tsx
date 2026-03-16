"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartButton } from "@/components/CartButton";
import Cart from "@/components/Cart";
import { Heart, Tag, ShoppingBag, User, Package, Star, LogOut } from "lucide-react";
import Link from "next/link";
import { apiService, Product } from "@/lib/api";
import { favoritesService, FavoriteItem } from "@/lib/favorites";
import { getProductImageUrl } from "@/utils/imageUtils";

export default function ProfilePage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [promotionalProducts, setPromotionalProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'favorites' | 'promotions'>('favorites');

  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les favoris
        const favoritesData = favoritesService.getFavorites();
        setFavorites(favoritesData);

        // Charger les produits complets pour les favoris
        const allProducts = await apiService.getProducts();
        const productsWithFavorites = allProducts.filter(product => 
          favoritesData.some(fav => fav.product.id === product.id)
        );
        setFavoriteProducts(productsWithFavorites);

        // Charger les produits en promotion
        const promoProducts = allProducts.filter(product => 
          product.price && product.price < 50 // Considérer les produits de moins de 50€ comme en promotion
        );
        setPromotionalProducts(promoProducts);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRemoveFavorite = (productId: number) => {
    const success = favoritesService.removeFromFavorites(productId);
    if (success) {
      setFavorites(favorites.filter(fav => fav.id !== productId));
      setFavoriteProducts(prev => prev.filter(product => product.id !== productId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header onCartClick={() => setIsCartOpen(true)} />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={() => setIsCartOpen(true)} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Profil</h1>
          <p className="text-gray-600">Gérez vos favoris et découvrez les promotions</p>
        </div>

        {/* User Info Card */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">Utilisateur PureSkin</h2>
              <p className="text-gray-600">client@pureskin-etu.com</p>
            </div>
            <button className="text-red-600 hover:text-red-700 flex items-center">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'favorites'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Heart className="w-4 h-4 inline mr-2" />
              Mes Favoris ({favoriteProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('promotions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'promotions'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Tag className="w-4 h-4 inline mr-2" />
              Promotions ({promotionalProducts.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'favorites' && (
          <div>
            {favoriteProducts.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun favori</h3>
                <p className="text-gray-600 mb-4">Vous n'avez pas encore ajouté de produits à vos favoris</p>
                <Link 
                  href="/products"
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Découvrir les produits
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProducts.map((product) => (
                  <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-gray-100">
                      <img
                        src={getProductImageUrl(product) || ''}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-gray-900">{product.price.toFixed(2)} €</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">4.8</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="flex-1 bg-green-500 text-white py-2 px-3 rounded text-center hover:bg-green-600 transition-colors text-sm"
                        >
                          Voir
                        </Link>
                        <button
                          onClick={() => handleRemoveFavorite(product.id)}
                          className="bg-red-50 text-red-600 py-2 px-3 rounded hover:bg-red-100 transition-colors text-sm"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'promotions' && (
          <div>
            {promotionalProducts.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune promotion</h3>
                <p className="text-gray-600 mb-4">Il n'y a pas de promotions en ce moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promotionalProducts.map((product) => (
                  <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative">
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Promotion
                      </span>
                    </div>
                    <div className="aspect-square bg-gray-100">
                      <img
                        src={getProductImageUrl(product) || ''}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-lg font-bold text-green-600">{product.price.toFixed(2)} €</span>
                          <span className="text-sm text-gray-500 line-through ml-2">{(product.price * 1.3).toFixed(2)} €</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">4.8</span>
                        </div>
                      </div>
                      <Link
                        href={`/products/${product.id}`}
                        className="w-full bg-green-500 text-white py-2 px-3 rounded text-center hover:bg-green-600 transition-colors text-sm block"
                      >
                        Voir l'offre
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
      
      {/* Cart */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
