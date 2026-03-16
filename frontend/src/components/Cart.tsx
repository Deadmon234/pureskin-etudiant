"use client";

import { useState, useEffect } from "react";
import { cartService, CartItem } from "@/lib/cart";
import { getProductImageUrl } from "@/utils/imageUtils";
import { ShoppingCart, Plus, Minus, X, ArrowRight, CreditCard, Truck, Shield, User } from "lucide-react";
import { useRouter } from "next/navigation";

export function Cart({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const updateCart = () => {
      const cart = cartService.getCart();
      setCartItems(cart.items);
      setTotal(cart.total);
      setItemCount(cart.itemCount);
    };

    updateCart();
    
    // Écouter les changements de panier
    const interval = setInterval(updateCart, 500);
    return () => clearInterval(interval);
  }, []);

  const updateQuantity = (productId: number, quantity: number) => {
    cartService.updateQuantity(productId, quantity);
  };

  const removeFromCart = (productId: number) => {
    cartService.removeFromCart(productId);
  };

  const clearCart = () => {
    cartService.clearCart();
  };

  const handleCheckout = () => {
    // Fermer le panier et naviguer vers la page de commande
    onClose();
    router.push('/checkout');
  };

  const shipping = total > 25 ? 0 : 4.99;
  const finalTotal = total + shipping;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        style={{ cursor: 'pointer' }}
      />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-6 h-6 text-green-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Mon Panier</h2>
                <p className="text-sm text-gray-600">{itemCount} article{itemCount > 1 ? 's' : ''}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white hover:shadow-md transition-all"
              style={{ cursor: 'pointer' }}
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Votre panier est vide</h3>
                <p className="text-gray-600 mb-6">Découvrez nos produits et ajoutez-les à votre panier</p>
                <button
                  onClick={onClose}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                  style={{ cursor: 'pointer' }}
                >
                  Continuer mes achats
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {getProductImageUrl(item) ? (
                          <img
                            src={getProductImageUrl(item)!}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <div className="text-gray-400 text-xs text-center">No image</div>
                          </div>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                        
                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-green-600">{item.price.toFixed(2)}€</span>
                            <span className="text-sm text-gray-500">x {item.quantity}</span>
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                              style={{ cursor: 'pointer' }}
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="w-8 text-center font-medium text-gray-600">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                              style={{ cursor: 'pointer' }}
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="w-8 h-8 rounded-lg border border-red-300 flex items-center justify-center hover:bg-red-50 transition-colors ml-2"
                              style={{ cursor: 'pointer' }}
                            >
                              <X className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Subtotal */}
                        <div className="mt-2 text-right">
                          <span className="text-sm text-gray-500">Sous-total:</span>
                          <span className="text-sm font-semibold text-gray-900 ml-2">
                            {(item.price * item.quantity).toFixed(2)}€
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t bg-gray-50 p-6">
              {/* Summary */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-semibold text-gray-600">{total.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-semibold text-gray-600">
                    {shipping === 0 ? 'Gratuite' : shipping.toFixed(2) + '€'}
                  </span>
                </div>
                {total < 25 && (
                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                    🎁 Plus que {(25 - total).toFixed(2)}€ pour la livraison gratuite !
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span className="text-gray-600">Total</span>
                  <span className="text-green-600">{finalTotal.toFixed(2)}€</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 font-medium"
                  style={{ cursor: 'pointer' }}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Procéder au paiement</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => {
                    onClose();
                    router.push('/auth');
                  }}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 font-medium"
                  style={{ cursor: 'pointer' }}
                >
                  <User className="w-5 h-5" />
                  <span>Passer la commande</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <div className="flex space-x-3">
                  <button
                    onClick={clearCart}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    style={{ cursor: 'pointer' }}
                  >
                    Vider le panier
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 border border-green-500 text-green-600 py-2 rounded-lg hover:bg-green-50 transition-colors text-sm"
                    style={{ cursor: 'pointer' }}
                  >
                    Continuer mes achats
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t">
                <div className="flex items-center space-x-1 text-xs text-gray-600">
                  <Truck className="w-4 h-4" />
                  <span>Livraison offerte</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>Paiement sécurisé</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;
