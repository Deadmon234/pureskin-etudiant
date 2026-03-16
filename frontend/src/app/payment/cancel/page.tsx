"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { X, ArrowLeft, CreditCard, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { paymentIntegrationService } from "@/lib/paymentIntegrationService";

function PaymentCancelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const processPaymentCancel = async () => {
      try {
        // Récupérer les paramètres de l'URL
        const orderId = searchParams.get('orderId');
        const sessionToken = searchParams.get('sessionToken');
        
        console.log('🔍 Paramètres d\'annulation de paiement:', {
          orderId,
          sessionToken
        });

        // Mettre à jour le paiement comme annulé
        if (orderId) {
          try {
            await paymentIntegrationService.updatePaymentAfterFaroty(
              orderId,
              sessionToken || 'CANCELLED_' + Date.now(),
              'CANCELLED'
            );
            
            console.log('✅ Paiement annulé et mis à jour:', orderId);
          } catch (error) {
            console.error('Error updating cancelled payment:', error);
          }
        }
      } catch (error) {
        console.error('Error processing payment cancel:', error);
      }

      // Rediriger automatiquement vers le panier après 5 secondes
      const timer = setTimeout(() => {
        router.push('/panier');
      }, 5000);

      return () => clearTimeout(timer);
    };

    processPaymentCancel();
  }, [router, searchParams]);

  const handleRetryPayment = () => {
    router.push('/payment');
  };

  const handleReturnToCart = () => {
    router.push('/panier');
  };

  const handleCartClick = () => {
    router.push('/panier');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={handleCartClick} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Cancel Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="w-10 h-10 text-red-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Paiement annulé
            </h1>
            <p className="text-gray-600">
              Votre paiement a été annulé. Vous pouvez réessayer ou modifier votre commande.
            </p>
          </div>

          {/* Message Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-yellow-600 text-xs">!</span>
              </div>
              <div>
                <h3 className="font-medium text-yellow-900 mb-2">Que s'est-il passé ?</h3>
                <p className="text-yellow-800 text-sm">
                  Le paiement a été interrompu avant son terme. Votre commande n'a pas été validée 
                  et aucun montant n'a été débité de votre compte.
                </p>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Que souhaitez-vous faire ?</h3>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-start space-x-3">
                  <CreditCard className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Réessayer le paiement</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Relancer le processus de paiement avec la même commande
                    </p>
                    <button
                      onClick={handleRetryPayment}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                      Réessayer le paiement
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-start space-x-3">
                  <ShoppingBag className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Modifier votre commande</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Retourner au panier pour ajouter, supprimer ou modifier des articles
                    </p>
                    <button
                      onClick={handleReturnToCart}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      Voir mon panier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Auto-redirect Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <p className="text-blue-800 text-sm">
                Vous serez redirigé automatiquement vers votre panier dans 5 secondes...
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={handleRetryPayment}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Réessayer le paiement
            </button>
            
            <Link
              href="/products"
              className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
            >
              Continuer mes achats
            </Link>
          </div>

          {/* Support */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Besoin d'aide pour finaliser votre commande ?
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <a href="mailto:support@pureskin.fr" className="text-green-600 hover:text-green-700">
                support@pureskin.fr
              </a>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">01 23 45 67 89</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        </main>
      </div>
    }>
      <PaymentCancelContent />
    </Suspense>
  );
}
