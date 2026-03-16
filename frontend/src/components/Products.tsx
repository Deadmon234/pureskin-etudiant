"use client";

import { useEffect, useState } from "react";
import { apiService, Product } from "@/lib/api";
import { cartService } from "@/lib/cart";
import { getProductImageUrl } from "@/utils/imageUtils";
import Link from "next/link";
import { ShoppingCart, Star, ChevronLeft, ChevronRight, Check } from "lucide-react";

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [addedToCart, setAddedToCart] = useState<number[]>([]);
  const [autoPlay, setAutoPlay] = useState(true);
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await apiService.getProducts();
        setProducts(data);
      } catch (err) {
        setError("Erreur lors du chargement des produits");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (autoPlay && products.length > itemsPerPage) {
      const interval = setInterval(() => {
        handleNext();
      }, 5000); // Auto-scroll every 5 seconds
      setAutoPlayInterval(interval);
    } else {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        setAutoPlayInterval(null);
      }
    }

    return () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    };
  }, [autoPlay, currentIndex, products.length, itemsPerPage]);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth >= 1280) setItemsPerPage(4); // xl
        else if (window.innerWidth >= 1024) setItemsPerPage(3); // lg
        else if (window.innerWidth >= 768) setItemsPerPage(2); // md
        else setItemsPerPage(1); // mobile
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Loop back to beginning
      setCurrentIndex(0);
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // Go to end
      setCurrentIndex(Math.max(0, products.length - itemsPerPage));
    }
  };

  const goToPage = (index: number) => {
    setCurrentIndex(index);
  };

  const handleAddToCart = (product: Product) => {
    cartService.addToCart(product, 1);
    
    // Animation feedback
    setAddedToCart(prev => [...prev, product.id]);
    setTimeout(() => {
      setAddedToCart(prev => prev.filter(id => id !== product.id));
    }, 2000);
  };

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerPage);
  const canGoNext = currentIndex + itemsPerPage < products.length;
  const canGoPrevious = currentIndex > 0;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentPage = Math.floor(currentIndex / itemsPerPage) + 1;

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des produits...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Nos Produits
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez notre gamme de cosmétiques naturels spécialement conçus pour les étudiants
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                canGoPrevious 
                  ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              style={{ cursor: canGoPrevious ? 'pointer' : 'not-allowed' }}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Précédent
            </button>
            
            <div className="text-sm text-gray-600">
              {products.length > 0 && (
                <span>
                  {currentIndex + 1}-{Math.min(currentIndex + itemsPerPage, products.length)} sur {products.length} produits
                </span>
              )}
            </div>
            
            <button
              onClick={handleNext}
              disabled={!canGoNext}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                canGoNext 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              style={{ cursor: canGoNext ? 'pointer' : 'not-allowed' }}
            >
              Suivant
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          {/* Products Carousel */}
          <div className="relative">
            <div 
              className="overflow-hidden rounded-lg"
              onMouseEnter={() => setAutoPlay(false)}
              onMouseLeave={() => setAutoPlay(true)}
            >
              <div className="flex transition-transform duration-500 ease-in-out">
                {visibleProducts.map((product) => (
                  <div key={product.id} className="w-full flex-shrink-0 px-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group block"
                    >
                      {/* Product Image */}
                      <div className="relative h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                        {product.badge && (
                          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            {product.badge}
                          </div>
                        )}
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
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          );
                        })()}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>

                        {/* Price */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-green-600">
                              {product.price.toFixed(2)}€
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-400 line-through">
                                {product.originalPrice.toFixed(2)}€
                              </span>
                            )}
                          </div>
                          {product.stockQuantity > 0 ? (
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
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                          className={`w-full py-2 rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center ${
                          addedToCart.includes(product.id)
                            ? 'bg-green-600 text-white'
                            : 'bg-green-500 text-white hover:bg-green-600 hover:shadow-lg transform hover:scale-105'
                        }`}
                          style={{ cursor: 'pointer' }}
                        >
                          {addedToCart.includes(product.id) ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Ajouté au panier
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Ajouter au panier
                            </>
                          )}
                        </button>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Indicators */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToPage(index * itemsPerPage)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentPage - 1
                        ? 'bg-green-500'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link 
            href="/produits"
            className="inline-flex items-center bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 transition-colors"
            style={{ cursor: 'pointer' }}
          >
            Voir tous les produits
          </Link>
          <p className="text-sm text-gray-600 mt-4">
            Livraison offerte à partir de 25€ • Retour gratuit sous 30j
          </p>
        </div>
      </div>
    </section>
  );
}
