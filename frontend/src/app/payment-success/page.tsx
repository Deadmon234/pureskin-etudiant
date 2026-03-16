"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckCircle, ArrowRight, Home, Package, CreditCard } from "lucide-react";
import Link from "next/link";
import { cartService } from "@/lib/cart";
import { paymentIntegrationService } from "@/lib/paymentIntegrationService";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const processPaymentSuccess = async () => {
      try {
        // Récupérer les paramètres de l'URL
        const transactionId = searchParams.get('transaction_id');
        const sessionId = searchParams.get('session_id');
        const orderId = searchParams.get('order_id');

        console.log('🎉 Paiement réussi, traitement des données...');
        console.log('Transaction ID:', transactionId);
        console.log('Session ID:', sessionId);
        console.log('Order ID:', orderId);

        // Récupérer les données du paiement stockées localement
        const storedPaymentData = localStorage.getItem('current_payment_data');
        if (storedPaymentData) {
          const payment = JSON.parse(storedPaymentData);
          setOrderData(payment);

          // Si nous avons un order ID, mettre à jour le statut du paiement
          if (payment.orderId || orderId) {
            const targetOrderId = payment.orderId || orderId;
            console.log('🔄 Mise à jour du statut du paiement pour:', targetOrderId);

            try {
              // Vérifier et mettre à jour le statut du paiement
              const updateResult = await paymentIntegrationService.checkAndUpdatePaymentStatus(
                targetOrderId,
                localStorage.getItem('faroty_access_token') || undefined
              );

              console.log('✅ Statut du paiement mis à jour:', updateResult);

            } catch (updateError) {
              console.error('❌ Erreur lors de la mise à jour du statut:', updateError);
              // Ne pas bloquer l'utilisateur si la mise à jour échoue
            }
          }
        }

        // Nettoyer le panier
        cartService.clearCart();

        // Nettoyer le localStorage
        localStorage.removeItem('current_payment_data');
        localStorage.removeItem('pending_order_id');
        localStorage.removeItem('payment_session_token');
        localStorage.removeItem('payment_session_url');

        setIsLoading(false);

      } catch (error) {
        console.error('❌ Erreur lors du traitement du succès du paiement:', error);
        setIsLoading(false);
      }
    };

    processPaymentSuccess();
  }, [searchParams]);

  const handleCartClick = () => {
    router.push('/cart');
  };

  if (isLoading) {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header onCartClick={handleCartClick} />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          {/* Icône de succès */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          {/* Message de succès */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 Paiement Réussi !
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Votre commande a été confirmée et sera traitée rapidement
          </p>

          {/* Détails de la commande */}
          {orderData && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-left max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Package className="w-6 h-6 text-green-600 mr-2" />
                Détails de la Commande
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Numéro de commande:</span>
                  <span className="font-semibold text-gray-900">#{orderData.orderNumber}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant total:</span>
                  <span className="font-semibold text-gray-900">{orderData.totalAmount} XAF</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Méthode de paiement:</span>
                  <span className="font-semibold text-gray-900 flex items-center">
                    <CreditCard className="w-4 h-4 mr-1" />
                    Faroty
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut:</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Payée
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date().toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {/* Articles de la commande */}
              {orderData.items && orderData.items.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium text-gray-900 mb-3">Articles commandés:</h3>
                  <div className="space-y-2">
                    {orderData.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-medium text-gray-600">
                          {(item.price * item.quantity).toLocaleString()} XAF
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Retour à l'accueil
            </Link>
            
            <Link
              href="/produits"
              className="bg-white text-green-600 border border-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors font-medium flex items-center justify-center"
            >
              <Package className="w-5 h-5 mr-2" />
              Continuer mes achats
            </Link>
          </div>

          {/* Informations supplémentaires */}
          <div className="mt-12 bg-white rounded-xl shadow-sm p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📧 Confirmation envoyée
            </h3>
            <p className="text-gray-600">
              Un email de confirmation a été envoyé à votre adresse email avec tous les détails de votre commande.
              Vous recevrez également des notifications sur l'avancement de votre livraison.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </main>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
