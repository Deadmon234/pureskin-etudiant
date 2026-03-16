"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Check, Package, Truck, Mail, Phone, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { cartService } from "@/lib/cart";

export default function OrderConfirmationPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Générer un numéro de commande aléatoire
    const generateOrderNumber = () => {
      const prefix = "PS";
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
      return `${prefix}${timestamp}${random}`;
    };

    // Simuler les détails de commande (en réalité, viendraient du backend)
    const mockOrderDetails = {
      orderNumber: generateOrderNumber(),
      orderDate: new Date().toLocaleDateString('fr-FR'),
      estimatedDelivery: "3-5 jours ouvrés",
      items: [
        { name: "Gel Nettoyant Doux", price: 12.90, quantity: 2 },
        { name: "Sérum Anti-Imperfections", price: 18.90, quantity: 1 },
        { name: "Crème Hydratante Légère", price: 15.90, quantity: 1 }
      ],
      subtotal: 60.60,
      shipping: 0,
      total: 60.60,
      shippingAddress: {
        name: "Marie Dupont",
        address: "123 Rue de la République",
        city: "75001 Paris",
        phone: "06 12 34 56 78",
        email: "marie.dupont@email.com"
      },
      paymentMethod: "Carte bancaire"
    };

    setOrderNumber(mockOrderDetails.orderNumber);
    setOrderDetails(mockOrderDetails);

    // Vider le panier après confirmation
    cartService.clearCart();
  }, []);

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={() => {}} />
      <main>
        <div className="container mx-auto px-4 py-12">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Commande confirmée !
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Merci pour votre commande #{orderNumber}
            </p>
            <p className="text-gray-600">
              Un email de confirmation a été envoyé à {orderDetails.shippingAddress.email}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Info */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-green-600" />
                  Détails de la commande
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Numéro de commande</h3>
                    <p className="text-lg font-semibold text-gray-900">{orderNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Date de commande</h3>
                    <p className="text-lg font-semibold text-gray-900">{orderDetails.orderDate}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Méthode de paiement</h3>
                    <p className="text-lg font-semibold text-gray-900">{orderDetails.paymentMethod}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Livraison estimée</h3>
                    <p className="text-lg font-semibold text-gray-900">{orderDetails.estimatedDelivery}</p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Articles commandés</h2>
                
                <div className="space-y-4">
                  {orderDetails.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{(item.price * item.quantity).toFixed(2)} €</p>
                        <p className="text-sm text-gray-600">{item.price.toFixed(2)} € / pièce</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-green-600" />
                  Adresse de livraison
                </h2>
                
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{orderDetails.shippingAddress.name}</p>
                  <p className="text-gray-600">{orderDetails.shippingAddress.address}</p>
                  <p className="text-gray-600">{orderDetails.shippingAddress.city}</p>
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {orderDetails.shippingAddress.phone}
                    </span>
                    <span className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {orderDetails.shippingAddress.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Récapitulatif</h2>
                
                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span>{orderDetails.subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Livraison</span>
                    <span>{orderDetails.shipping === 0 ? 'GRATUITE' : `${orderDetails.shipping.toFixed(2)} €`}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold text-lg text-gray-900">
                      <span>Total</span>
                      <span className="text-green-600">{orderDetails.total.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>

                {/* Order Status */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Commande confirmée</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Votre commande est en cours de préparation
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link 
                    href="/compte/commandes"
                    className="block w-full bg-green-500 text-white py-3 rounded-full hover:bg-green-600 transition-colors text-center font-medium"
                  >
                    Suivre ma commande
                  </Link>
                  
                  <Link 
                    href="/produits"
                    className="block w-full border border-green-500 text-green-600 py-3 rounded-full hover:bg-green-50 transition-colors text-center font-medium"
                  >
                    Continuer mes achats
                  </Link>
                </div>

                {/* Customer Service */}
                <div className="mt-6 text-center text-sm text-gray-600">
                  <p className="mb-2">Besoin d'aide ?</p>
                  <div className="space-y-1">
                    <p>Contactez-nous au 0800 123 456</p>
                    <p>ou par email : contact@pureskin.fr</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-12 bg-blue-50 rounded-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Que se passe-t-il maintenant ?</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Préparation</h3>
                <p className="text-sm text-gray-600">Votre commande est préparée dans nos entrepôts</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Expédition</h3>
                <p className="text-sm text-gray-600">Envoi sous 24-48h avec suivi</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Notification</h3>
                <p className="text-sm text-gray-600">Email de suivi envoyé à l'expédition</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Livraison</h3>
                <p className="text-sm text-gray-600">Réception à votre adresse</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
