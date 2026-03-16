"use client";

import { useState, useEffect } from "react";
import { mockProducts } from "@/lib/mockData";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShoppingCart, Star } from "lucide-react";

export default function TestProductsPage() {
  const [products, setProducts] = useState(mockProducts);

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={() => {}} />
      <main className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Test Page - Nos produits
              <span className="text-green-600 block">spécialement étudiants</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Test d'affichage des produits avec données mock
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Nombre de produits chargés: {products.length}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🧴</div>
                      <div className="text-xs">Image placeholder</div>
                    </div>
                  </div>
                  
                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {product.badge}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* Product Name */}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>

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
                        En stock ({product.stockQuantity})
                      </span>
                    ) : (
                      <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                        Rupture
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <button className="w-full py-2 rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center bg-green-500 text-white hover:bg-green-600">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
