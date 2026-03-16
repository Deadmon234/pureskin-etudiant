"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CreditCard, Truck, Shield, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cartService, CartItem } from "@/lib/cart";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France'
  });
  const [paymentMethod, setPaymentMethod] = useState('faroty');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [total, setTotal] = useState(0);

  const handleCartClick = () => {
    // Redirect to cart page when cart is clicked
    router.push('/cart');
  };

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

  const handleContinueToPayment = async () => {
    // Validation des champs
    if (!customerInfo.email || !customerInfo.firstName || !customerInfo.lastName) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (!customerInfo.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert("Veuillez saisir un email valide");
      return;
    }

    setIsLoading(true);

    try {
      // Créer la commande en base de données
      const orderData = {
        customerId: null, // Sera mis à jour après création du compte
        shippingAddress: `${customerInfo.address}, ${customerInfo.postalCode} ${customerInfo.city}`,
        billingAddress: `${customerInfo.address}, ${customerInfo.postalCode} ${customerInfo.city}`,
        subtotal: subtotal,
        shippingCost: shipping,
        taxAmount: 0, // Pas de taxe pour l'instant
        totalAmount: finalTotal,
        notes: `Client: ${customerInfo.firstName} ${customerInfo.lastName}, Email: ${customerInfo.email}, Tel: ${customerInfo.phone}`,
        items: cartItems.map(item => ({
          productId: item.id,
          productName: item.name,
          productImage: item.imageUrl || '',
          unitPrice: item.price,
          quantity: item.quantity
        }))
      };

      console.log('Données de commande envoyées:', orderData);

      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const result = await response.json();
        
        // Sauvegarder l'ID de la commande pour la suite du processus
        localStorage.setItem('pending_order_id', result.data.orderId);
        localStorage.setItem('customer_email', customerInfo.email);
        
        // Rediriger vers la page d'authentification OTP
        router.push('/auth-checkout');
      } else {
        // Récupérer les détails de l'erreur
        const errorData = await response.json().catch(() => ({}));
        console.log('Erreur backend:', errorData);
        const errorMessage = errorData.message || `Erreur HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Erreur détaillée:', error);
      alert(`Erreur lors de la création de la commande: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={handleCartClick} />
      <main>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link 
              href="/cart"
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
                      className="w-full text-gray-600 placeholder-gray-300 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                      className="w-full text-gray-600 placeholder-gray-300 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-600 placeholder-gray-300"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-600 placeholder-gray-300"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-600 placeholder-gray-300"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-600 placeholder-gray-300"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-600 placeholder-gray-300"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-600 placeholder-gray-300"
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
                      <div className="font-semibold text-gray-600">Livraison Standard</div>
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
                      <div className="font-semibold text-gray-600">Livraison Express</div>
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
                      <div className="font-semibold text-gray-600">Faroty Pay</div>
                      <div className="text-sm text-gray-600">Paypal, Carte bancaire, Orange, Mtn</div>
                    </div>
                  </label>
                  
                  {/* <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
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
                  </label> */}
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
                        <span className="font-semibold text-gray-600">{item.name}</span>
                        <span className="fond-semibold text-green-500 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-semibold text-gray-600">{(item.price * item.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span>{subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Livraison</span>
                    <span>{shipping === 0 ? 'GRATUITE' : `${shipping.toFixed(2)} €`}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold text-lg text-gray-900">
                      <span>Total</span>
                      <span>{finalTotal.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button 
                  onClick={handleContinueToPayment}
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
                      Continuer vers le paiement
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
