"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Minus, Plus, Trash2, ShoppingBag, User, CreditCard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cartService, CartItem } from "@/lib/cart";

export default function PanierPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const updateCart = () => {
      const cart = cartService.getCart();
      setCartItems(cart.items);
      setTotal(cart.total);
    };

    updateCart();
    
    // Écouter les changements de panier
    const interval = setInterval(updateCart, 500);
    return () => clearInterval(interval);
  }, []);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      cartService.removeFromCart(id);
    } else {
      const item = cartItems.find(item => item.id === id);
      if (item) {
        cartService.updateQuantity(id, newQuantity);
      }
    }
  };

  const removeItem = (id: number) => {
    cartService.removeFromCart(id);
  };

  const clearCart = () => {
    cartService.clearCart();
  };

  const subtotal = total;
  const shipping = subtotal > 25 ? 0 : 4.90;
  const finalTotal = subtotal + shipping;

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const handlePassCommande = () => {
    router.push('/auth');
  };

  const handleCartClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={handleCartClick} />
      <main>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Panier</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Votre panier est vide</h2>
              <p className="text-gray-600 mb-8">Découvrez nos produits et commencez votre routine skincare</p>
              <Link 
                href="/produits"
                className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors inline-block"
              >
                Découvrir les produits
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg border border-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6 border-b border-gray-200 last:border-b-0">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <div className="text-gray-400 text-xs">Image</div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">{item.name}</h3>
                              <p className="text-sm text-gray-600">Catégorie: {item.categoryId}</p>
                            </div>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                              >
                                <Minus className="w-4 h-4 font-semibold text-gray-600" />
                              </button>
                              <span className="w-8 text-center font-semibold text-gray-600">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                              >
                                <Plus className="w-4 h-4 font-semibold text-gray-600" />
                              </button>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">{item.price.toFixed(2)} €</div>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <div className="text-sm text-gray-500 line-through">
                                  {item.originalPrice.toFixed(2)} €
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <div className="mt-6">
                  <Link 
                    href="/produits"
                    className="text-red-600 hover:text-green-700 font-medium inline-flex items-center gap-2"
                  >
                    ← Continuer mes achats
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Récapitulatif</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Sous-total</span>
                      <span className="font-semibold text-gray-600">{subtotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Livraison</span>
                      <span className="font-semibold text-gray-600">{shipping === 0 ? 'GRATUITE' : `${shipping.toFixed(2)} €`}</span>
                    </div>
                    {shipping === 0 && (
                      <div className="text-green-600 text-sm">
                        🎉 Livraison offerte offerte à partir de 25€ d'achat !
                      </div>
                    )}
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold text-lg text-gray-900">
                        <span className="text-gray-600">Total</span>
                        <span className="font-semibold text-gray-600">{total.toFixed(2)} €</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 font-medium"
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>Procéder au paiement</span>
                    </button>
                    
                    <button
                      onClick={handlePassCommande}
                      className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 font-medium"
                    >
                      <User className="w-5 h-5" />
                      <span>Passer la commande</span>
                    </button>
                    
                    <button
                      onClick={clearCart}
                      className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Vider le panier
                    </button>
                  </div>

                  <div className="text-center text-sm text-gray-600">
                    <p className="mb-2">Paiement sécurisé</p>
                    <div className="flex justify-center gap-2">
                      <div className="w-8 h-5 bg-gray-300 rounded"></div>
                      <div className="w-8 h-5 bg-gray-300 rounded"></div>
                      <div className="w-8 h-5 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
