"use client";

import { useEffect, useState } from "react";
import { apiService, Product } from "@/lib/api";
import { cartService, CartItem } from "@/lib/cart";
import { favoritesService } from "@/lib/favoritesService";
import { getProductImageUrl } from "@/utils/imageUtils";
import { ShoppingCart, Star, Heart, Check, ChevronLeft, ChevronRight } from "lucide-react";

export function ProductRow() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const productsPerPage = 5; // 5 products per row

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await apiService.getProducts();
        setProducts(data);
        console.log("Products loaded from API:", data);
      } catch (err) {
        console.log("API failed, using mock data:", err);
        // Use mock data as fallback
        const mockProducts = require("@/lib/mockData").mockProducts;
        setProducts(mockProducts as Product[]);
        setError(null); // Clear error since we have fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Update cart items when cart changes
    const updateCart = () => {
      const cart = cartService.getCart();
      setCartItems(cart.items);
    };

    updateCart();
    const interval = setInterval(updateCart, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update favorites when localStorage changes
    const updateFavorites = () => {
      const favs = favoritesService.getFavorites();
      setFavorites(favs.map(fav => fav.productId));
    };

    updateFavorites();
    const interval = setInterval(updateFavorites, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = async (product: Product) => {
    setAddingToCart(product.id);
    try {
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      cartService.addToCart(product, 1);
      
      // Update cart state
      const cart = cartService.getCart();
      setCartItems(cart.items);
      
      // Show success feedback
      setTimeout(() => {
        setAddingToCart(null);
      }, 1000);
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      setAddingToCart(null);
      
      // Show specific error message for out of stock
      if (error.message.includes('rupture de stock')) {
        alert(`❌ ${error.message}`);
      } else if (error.message.includes('supérieure au stock')) {
        alert(`⚠️ ${error.message}`);
      } else {
        alert('❌ Erreur lors de l\'ajout au panier');
      }
    }
  };

  const toggleFavorite = (product: Product) => {
    if (favoritesService.isFavorite(product.id)) {
      favoritesService.removeFromFavorites(product.id);
    } else {
      favoritesService.addToFavorites(product);
    }
    // Force update
    const favs = favoritesService.getFavorites();
    setFavorites(favs.map(fav => fav.productId));
  };

  const isInCart = (productId: number) => {
    return cartItems.some(item => item.id === productId);
  };

  const getItemQuantity = (productId: number) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Navigation logic for row
  const maxIndex = Math.max(0, products.length - productsPerPage);
  
  const goToPrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - productsPerPage));
  };

  const goToNext = () => {
    setCurrentIndex(Math.min(maxIndex, currentIndex + productsPerPage));
  };

  const currentProducts = products.slice(currentIndex, currentIndex + productsPerPage);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Nos produits <span className="text-green-600">spécialement étudiants</span>
          </h2>
          <div className="text-sm text-gray-600">
            <span className="flex items-center">
              <Heart className="w-4 h-4 mr-1 text-red-500 fill-current" />
              0 favori
            </span>
          </div>
        </div>
        
        <div className="relative overflow-hidden">
          <div className="flex space-x-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex-shrink-0 w-56 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun produit disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Nos produits <span className="text-green-600">spécialement étudiants</span>
        </h2>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            {favorites.length > 0 && (
              <span className="flex items-center">
                <Heart className="w-4 h-4 mr-1 text-red-500 fill-current" />
                {favorites.length} favori{favorites.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          {/* Navigation buttons */}
          {products.length > productsPerPage && (
            <div className="flex items-center space-x-2">
              <button
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className={`p-2 rounded-full transition-colors ${
                  currentIndex === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="text-sm text-gray-600">
                {Math.floor(currentIndex / productsPerPage) + 1} / {Math.ceil(products.length / productsPerPage)}
              </span>
              
              <button
                onClick={goToNext}
                disabled={currentIndex >= maxIndex}
                className={`p-2 rounded-full transition-colors ${
                  currentIndex >= maxIndex
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Products Row - Single line display */}
      <div className="relative overflow-hidden">
        <div className="flex space-x-4 pb-4">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-56 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
                {(() => {
                  const imageUrl = getProductImageUrl(product);
                  if (!imageUrl) {
                    return (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2"></div>
                          <p className="text-gray-500 text-sm">Pas d'image</p>
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <>
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Favorite button */}
                      <button
                        onClick={() => toggleFavorite(product)}
                        className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
                        title={favoritesService.isFavorite(product.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                      >
                        <Heart className={`w-4 h-4 ${
                          favoritesService.isFavorite(product.id) 
                            ? 'text-red-500 fill-current' 
                            : 'text-gray-600 hover:text-red-500'
                        }`} />
                      </button>
                    </>
                  );
                })()}
              </div>
              
              {/* Product Info */}
              <div className="p-4">
                {/* Category */}
                <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                  {product.categoryId ? `Catégorie ${product.categoryId}` : "Soins visage"}
                </div>

                {/* Product Name */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">(4.0)</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {product.price.toFixed(2)}€
                    </div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="text-sm text-gray-500 line-through">
                        {product.originalPrice.toFixed(2)}€
                      </div>
                    )}
                  </div>

                  {/* Stock Status */}
                  {product.stockQuantity && product.stockQuantity > 0 ? (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      En stock
                    </span>
                  ) : (
                    <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                      Rupture
                    </span>
                  )}
                </div>

                {/* Action Button */}
                <button 
                  onClick={() => handleAddToCart(product)}
                  disabled={addingToCart === product.id || (product.stockQuantity !== undefined && product.stockQuantity <= 0)}
                  className={`w-full py-2 rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center ${
                    addingToCart === product.id 
                      ? 'bg-green-600 text-white' 
                      : isInCart(product.id)
                        ? 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200'
                        : 'bg-green-500 text-white hover:bg-green-600'
                  } ${(product.stockQuantity !== undefined && product.stockQuantity <= 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {addingToCart === product.id ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Ajouté !
                    </>
                  ) : isInCart(product.id) ? (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Dans le panier ({getItemQuantity(product.id)})
                    </>
                  ) : (product.stockQuantity !== undefined && product.stockQuantity <= 0) ? (
                    <>
                      Rupture de stock
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Ajouter au panier
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* View all products link */}
      <div className="text-center">
        <a 
          href="/produits" 
          className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Voir tous les produits
          <ChevronRight className="w-4 h-4 ml-2" />
        </a>
      </div>
    </div>
  );
}
