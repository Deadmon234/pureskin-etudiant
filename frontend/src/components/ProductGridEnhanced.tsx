"use client";

import { useEffect, useState } from "react";
import { apiService, Product } from "@/lib/api";
import { cartService, CartItem } from "@/lib/cart";
import { favoritesService } from "@/lib/favoritesService";
import { getProductImageUrl } from "@/utils/imageUtils";
import { ShoppingCart, Star, Heart, Check, ChevronLeft, ChevronRight } from "lucide-react";

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const productsPerPage = viewMode === 'grid' ? 12 : 8; // 4x3 pour grid, 8 pour liste

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
        setError(null);
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
      await new Promise(resolve => setTimeout(resolve, 300));
      cartService.addToCart(product, 1);
      
      const cart = cartService.getCart();
      setCartItems(cart.items);
      
      setTimeout(() => {
        setAddingToCart(null);
      }, 1000);
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      setAddingToCart(null);
      
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

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
    <div>
      {/* Header with view toggle and favorites */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Nos produits <span className="text-green-600">spécialement étudiants</span>
          </h2>
          
          {/* View mode toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Grille
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Liste
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          {favorites.length > 0 && (
            <span className="flex items-center">
              <Heart className="w-4 h-4 mr-1 text-red-500 fill-current" />
              {favorites.length} favori{favorites.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Products Grid/List */}
      <div className={`${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-4'
      }`}>
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className={`${
              viewMode === 'grid' 
                ? 'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 group' 
                : 'bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-300'
            }`}
          >
            {/* Product Image */}
            <div className={`${
              viewMode === 'grid' ? 'relative h-48 bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden' : 'flex space-x-4'
            }`}>
              {(() => {
                const imageUrl = getProductImageUrl(product);
                if (!imageUrl) {
                  return (
                    <div className={`${
                      viewMode === 'grid' 
                        ? 'w-full h-full flex items-center justify-center bg-gray-100' 
                        : 'w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0'
                      }`}>
                      <div className="text-center">
                        <div className={`${
                          viewMode === 'grid' ? 'w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2' : 'w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2'
                        }`}></div>
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
                      className={`${
                        viewMode === 'grid' 
                          ? 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' 
                          : 'w-24 h-24 object-cover rounded-lg'
                        }`}
                    />
                    
                    {/* Favorite button */}
                    <button
                      onClick={() => toggleFavorite(product)}
                      className={`absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors ${
                        viewMode === 'list' ? 'top-2 right-2' : ''
                      }`}
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
            <div className={`${
              viewMode === 'grid' ? 'p-4' : 'flex-1 space-y-3'
            }`}>
              {/* Category */}
              <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                {product.categoryId ? `Catégorie ${product.categoryId}` : "Soins visage"}
              </div>

              {/* Product Name */}
              <h3 className={`${
                viewMode === 'grid' 
                  ? 'font-semibold text-gray-900 mb-2 line-clamp-2' 
                  : 'font-semibold text-gray-900 mb-2'
              }`}>
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
              <div className={`${
                viewMode === 'grid' ? 'flex items-center justify-between mb-4' : 'flex items-center justify-between'
              }`}>
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

              {/* Action Buttons */}
              <div className="flex space-x-2">
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
          </div>
        ))}
      </div>

      {/* Pagination */}
      {products.length > productsPerPage && (
        <div className="mt-12 flex flex-col items-center">
          <div className="flex items-center space-x-2 mb-4">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Précédent
            </button>
            
            <div className="flex space-x-1">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`w-10 h-10 rounded-lg transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-green-500 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return (
                    <span key={pageNumber} className="w-10 h-10 flex items-center justify-center text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>
            
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              Suivant
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            Affichage de {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, products.length)} sur {products.length} produits
          </div>
        </div>
      )}
    </div>
  );
}
