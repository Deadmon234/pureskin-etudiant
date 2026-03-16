"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartButton } from "@/components/CartButton";
import Cart from "@/components/Cart";
import { getProductImageUrl } from "@/utils/imageUtils";
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { apiService, Product, Category } from "@/lib/api";
import { cartService } from "@/lib/cart";
import { favoritesService } from "@/lib/favorites";
import { shareService } from "@/lib/share";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productId = parseInt(params.id as string);
        const products = await apiService.getProducts();
        const foundProduct = products.find(p => p.id === productId);
        
        if (foundProduct) {
          setProduct(foundProduct);
          
          // Vérifier si le produit est dans les favoris
          setIsFavorite(favoritesService.isFavorite(foundProduct.id));
          
          // Load category if categoryId exists
          if (foundProduct.categoryId) {
            try {
              const categoryData = await apiService.getCategory(foundProduct.categoryId);
              setCategory(categoryData);
            } catch (categoryError) {
              console.error("Failed to load category:", categoryError);
              // Continue without category - not a critical error
            }
          }
        } else {
          setError("Produit non trouvé");
        }
      } catch (err) {
        setError("Erreur lors du chargement du produit");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    
    try {
      // Ajouter le produit au panier
      cartService.addToCart(product, selectedQuantity);
      
      // Ouvrir le panier pour montrer l'ajout
      setIsCartOpen(true);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = () => {
    if (!product) return;

    if (isFavorite) {
      // Retirer des favoris
      const success = favoritesService.removeFromFavorites(product.id);
      if (success) {
        setIsFavorite(false);
        showNotification("Produit retiré des favoris");
      }
    } else {
      // Ajouter aux favoris
      const success = favoritesService.addToFavorites(product);
      if (success) {
        setIsFavorite(true);
        showNotification("Produit ajouté aux favoris");
      }
    }
  };

  const handleShareOnWhatsApp = () => {
    if (!product) return;
    
    shareService.shareOnWhatsApp(product, window.location.href);
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header onCartClick={() => setIsCartOpen(true)} />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Header onCartClick={() => setIsCartOpen(true)} />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || "Produit non trouvé"}
            </h1>
            <Link 
              href="/products"
              className="inline-flex items-center text-green-600 hover:text-green-700"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour aux produits
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={() => setIsCartOpen(true)} />
      
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform">
          <div className="flex items-center">
            <Check className="w-5 h-5 mr-2" />
            {notification}
          </div>
        </div>
      )}
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-green-600">Accueil</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-green-600">Produits</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {(() => {
                const imageUrl = getProductImageUrl(product);
                if (!imageUrl) {
                  return (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-500">Pas d'image disponible</p>
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
            
            {/* Thumbnail Gallery */}
            {(() => {
              const imageUrl = getProductImageUrl(product);
              if (!imageUrl) return null;
              
              return (
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-green-500">
                      <img
                        src={imageUrl}
                        alt={`${product.name} - Vue ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600">{product.description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-gray-600">4.8 (124 avis)</span>
              <Link href="#reviews" className="text-green-600 hover:text-green-700">
                Voir tous les avis
              </Link>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-bold text-gray-900">{product.price.toFixed(2)} €</span>
              <span className="text-lg text-gray-500 line-through">{(product.price * 1.2).toFixed(2)} €</span>
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
                -20%
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Quantité:</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x text-gray-600 border-gray-300">{selectedQuantity}</span>
                <button
                  onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center disabled:bg-gray-300"
            >
              {isAddingToCart ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Ajout en cours...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Ajouter au panier
                </>
              )}
            </button>

            {/* Quick Actions */}
            <div className="flex space-x-4">
              <button 
                onClick={handleToggleFavorite}
                className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center ${
                  isFavorite 
                    ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              </button>
              <button 
                onClick={handleShareOnWhatsApp}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Partager
              </button>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Livraison gratuite dès 25€ d'achat</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Satisfait ou remboursé 30 jours</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Produits testés dermatologiquement</span>
              </div>
            </div>

            {/* Category */}
            <div className="pt-4 border-t">
              <span className="text-sm text-gray-600">Catégorie:</span>
              <span className="ml-2 text-sm font-medium text-gray-900">
                {category ? category.name : "Non spécifiée"}
              </span>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-16 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-4">
                Découvrez notre produit {product.name}, spécialement formulé pour répondre aux besoins des étudiants. 
                Sa texture légère et non grasse pénètre rapidement sans laisser de film résiduel.
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Ingrédients principaux</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Eau thermale apaisante</li>
                <li>Acide hyaluronique hydratant</li>
                <li>Vitamine C antioxydante</li>
                <li>Niacinamide unifiant</li>
                <li>Filtres solaires SPF 30</li>
              </ul>
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Mode d'emploi</h3>
              <p className="text-gray-700">
                Appliquer matin et soir sur une peau propre et sèche. Masser délicatement jusqu'à absorption complète.
                Éviter le contour des yeux.
              </p>
            </div>
          </div>

          {/* Customer Reviews Preview */}
          <div id="reviews">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Avis clients</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">Il y a 2 jours</span>
                  </div>
                  <p className="text-gray-700">
                    "Excellent produit ! Ma peau est beaucoup plus douce et lumineuse. Je recommande vivement."
                  </p>
                  <p className="text-sm text-gray-600 mt-2">- Marie L., 21 ans</p>
                </div>
              ))}
            </div>
            <Link 
              href="/avis"
              className="inline-block mt-4 text-green-600 hover:text-green-700 font-medium"
            >
              Voir tous les avis →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Cart */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
