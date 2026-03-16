"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cartService, CartItem, CartState } from "@/lib/cart";
import { getProductImageUrl } from "@/utils/imageUtils";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartState>({ items: [], total: 0, itemCount: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    const loadCart = () => {
      const cartData = cartService.getCart();
      setCart(cartData);
      setLoading(false);
    };

    loadCart();
    
    // Update cart every 500ms to sync with other components
    const interval = setInterval(loadCart, 500);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    setUpdating(productId);
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const updatedCart = cartService.updateQuantity(productId, newQuantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (productId: number) => {
    setUpdating(productId);
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const updatedCart = cartService.removeFromCart(productId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleClearCart = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const updatedCart = cartService.clearCart();
      setCart(updatedCart);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    // Check for out of stock items
    const outOfStockItems = cartService.getOutOfStockItems();
    if (outOfStockItems.length > 0) {
      const outOfStockNames = outOfStockItems.map(item => item.name).join(', ');
      alert(`❌ Les produits suivants sont en rupture de stock: ${outOfStockNames}`);
      return;
    }

    try {
      setLoading(true);
      
      // Prepare order data
      const orderData = {
        items: cart.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          stockQuantity: item.stockQuantity
        })),
        customerInfo: {
          name: 'Client',
          email: 'client@example.com'
        }
      };

      // Create order first to get order ID
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Order created:', result);
        
        // Store order ID for payment processing
        localStorage.setItem('pending_order_id', result.order.id.toString());
        
        // Redirect to Faroty authentication instead of completing the order
        router.push('/auth/user-payment');
      } else {
        const error = await response.text();
        console.error('Order creation failed:', error);
        alert('❌ Erreur lors de la création de la commande. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('❌ Erreur lors de la commande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleCartClick = () => {
    // Since we're already on the cart page, we can just scroll to top or do nothing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onCartClick={handleCartClick} />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCartClick={handleCartClick} />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/produits"
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continuer mes achats
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mon panier
          </h1>
          <p className="text-gray-600">
            {cart.itemCount} {cart.itemCount === 1 ? 'article' : 'articles'} dans votre panier
          </p>
        </div>

        {cart.items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Votre panier est vide
            </h2>
            <p className="text-gray-600 mb-6">
              Découvrez nos produits et ajoutez vos articles préférés
            </p>
            <Link
              href="/produits"
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors inline-flex items-center"
            >
              Voir les produits
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Articles
                  </h2>
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Vider le panier
                  </button>
                </div>

                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={getProductImageUrl(item) || '/placeholder-product.jpg'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900">
                            {item.name}
                          </h3>
                          {/* Stock Status */}
                          {item.stockQuantity !== undefined && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              item.stockQuantity > 0 
                                ? 'text-green-600 bg-green-50' 
                                : 'text-red-600 bg-red-50'
                            }`}>
                              {item.stockQuantity > 0 ? `${item.stockQuantity} en stock` : 'Rupture'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {item.price.toFixed(2)} € par unité
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={updating === item.id || item.quantity <= 1}
                          className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-4 h-4 font-semibold text-gray-700" />
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-600">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={updating === item.id}
                          className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4 font-semibold text-gray-700" />
                        </button>
                      </div>

                      {/* Item Total and Remove */}
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {(item.price * item.quantity).toFixed(2)} €
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={updating === item.id}
                          className="text-red-600 hover:text-red-700 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Récapitulatif
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-semibold text-gray-600">{cart.total.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Livraison</span>
                    <span className="font-semibold text-gray-600">Gratuite</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">TVA</span>
                    <span className="font-semibold text-gray-600">Incluse</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span className="text-gray-600">Total</span>
                      <span className="text-green-600">{cart.total.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading || cart.items.length === 0}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Traitement...
                    </>
                  ) : (
                    <>
                      Finaliser la commande
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>

                <div className="mt-4 text-center">
                  <Link
                    href="/produits"
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Continuer mes achats
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
