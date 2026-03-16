"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CreditCard, Truck, Shield, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cartService, CartItem } from "@/lib/cart";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Formulaire client
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France"
  });

  useEffect(() => {
    // Charger les données du panier
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

  const subtotal = total;
  const shipping = shippingMethod === "express" ? 9.90 : (subtotal > 25 ? 0 : 4.90);
  const finalTotal = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'];
    return required.every(field => customerInfo[field as keyof typeof customerInfo].trim() !== '');
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (cartItems.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    setIsLoading(true);

    try {
      // Simuler une commande API
      const orderData = {
        customer: customerInfo,
        items: cartItems,
        subtotal,
        shipping,
        total: finalTotal,
        paymentMethod,
        shippingMethod
      };

      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Rediriger vers la page de confirmation
      router.push('/confirmation-commande');
      
    } catch (error) {
      console.error('Erreur lors de la commande:', error);
      alert('Une erreur est survenue lors de la commande. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCartClick = () => {
    router.push('/panier');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={handleCartClick} />
      <main>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link 
              href="/panier"
              className="flex items-center text-green-600 hover:text-green-700 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour au panier
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Finaliser la commande</h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-green-600" />
                  Informations de livraison
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={customerInfo.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Marie"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={customerInfo.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Dupont"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="marie.dupont@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="06 12 34 56 78"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="123 Rue de la République"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={customerInfo.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Paris"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code postal *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={customerInfo.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="75001"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pays
                    </label>
                    <select
                      name="country"
                      value={customerInfo.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="France">France</option>
                      <option value="Belgique">Belgique</option>
                      <option value="Suisse">Suisse</option>
                      <option value="Luxembourg">Luxembourg</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-green-600" />
                  Méthode de livraison
                </h2>
                
                <div className="space-y-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingMethod === "standard"}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium">Livraison Standard</div>
                      <div className="text-sm text-gray-600">3-5 jours ouvrés - {subtotal > 25 ? 'GRATUITE' : '4.90€'}</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={shippingMethod === "express"}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium">Livraison Express</div>
                      <div className="text-sm text-gray-600">24-48h - 9.90€</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                  Méthode de paiement
                </h2>
                
                <div className="space-y-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium">Carte bancaire</div>
                      <div className="text-sm text-gray-600">Visa, Mastercard, CB</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium">PayPal</div>
                      <div className="text-sm text-gray-600">Paiement sécurisé</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Récapitulatif</h2>
                
                {/* Products */}
                <div className="space-y-3 mb-6">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-600 ml-2">x{item.quantity}</span>
                      </div>
                      <span>{(item.price * item.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span className="font-semibold text-gray-600">{subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Livraison</span>
                    <span className="font-semibold text-gray-600">{shipping === 0 ? 'GRATUITE' : `${shipping.toFixed(2)} €`}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold text-lg text-gray-900">
                      <span>Total</span>
                      <span className="font-semibold text-gray-600">{finalTotal.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button 
                  onClick={handlePlaceOrder}
                  disabled={isLoading || cartItems.length === 0}
                  className="w-full bg-green-500 text-white py-3 rounded-full hover:bg-green-600 transition-colors text-center font-medium mt-6 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Traitement...
                    </>
                  ) : (
                    <>
                      Confirmer la commande
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="mt-6 text-center text-sm text-gray-600">
                  <p className="mb-3">Satisfait ou remboursé 30 jours</p>
                  <div className="flex justify-center gap-2">
                    <Shield className="w-8 h-5 text-gray-400" />
                    <Truck className="w-8 h-5 text-gray-400" />
                    <CreditCard className="w-8 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
