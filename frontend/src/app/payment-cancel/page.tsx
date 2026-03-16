"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { XCircle, ArrowLeft, RefreshCw, CreditCard } from "lucide-react";
import Link from "next/link";
import { paymentIntegrationService } from "@/lib/paymentIntegrationService";

function PaymentCancelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [reason, setReason] = useState<string>("");

  useEffect(() => {
    const processPaymentCancel = async () => {
      try {
        // Récupérer les paramètres de l'URL
        const cancelReason = searchParams.get('reason') || 'Annulation par l\'utilisateur';
        const transactionId = searchParams.get('transaction_id');
        const orderId = searchParams.get('order_id');
        
        setReason(cancelReason);

        // Récupérer les données du paiement stockées localement
        const storedPaymentData = localStorage.getItem('current_payment_data');
        if (storedPaymentData) {
          const payment = JSON.parse(storedPaymentData);

          // Si nous avons un order ID, mettre à jour le statut du paiement comme annulé
          if (payment.orderId || orderId) {
            const targetOrderId = payment.orderId || orderId;
            console.log('❌ Paiement annulé, mise à jour du statut pour:', targetOrderId);

            try {
              // Mettre à jour le statut du paiement comme annulé
              const updateResult = await paymentIntegrationService.updatePaymentAfterFaroty(
                targetOrderId,
                transactionId || 'unknown',
                'CANCELLED',
                undefined,
                localStorage.getItem('faroty_access_token') || undefined
              );

              console.log('✅ Statut du paiement mis à jour comme annulé:', updateResult);

            } catch (updateError) {
              console.error('❌ Erreur lors de la mise à jour du statut d\'annulation:', updateError);
              // Ne pas bloquer l'utilisateur si la mise à jour échoue
            }
          }
        }

        // Nettoyer le localStorage
        localStorage.removeItem('current_payment_data');
        localStorage.removeItem('pending_order_id');
        localStorage.removeItem('payment_session_token');
        localStorage.removeItem('payment_session_url');

        setIsLoading(false);

      } catch (error) {
        console.error('❌ Erreur lors du traitement de l\'annulation du paiement:', error);
        setIsLoading(false);
      }
    };

    processPaymentCancel();
  }, [searchParams]);

  const handleCartClick = () => {
    router.push('/cart');
  };

  const handleRetryPayment = () => {
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onCartClick={handleCartClick} />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <Header onCartClick={handleCartClick} />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          {/* Icône d'annulation */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
          </div>

          {/* Message d'annulation */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Paiement Annulé
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
          </p>

          {/* Raison de l'annulation */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 max-w-2xl mx-auto text-left">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="w-6 h-6 text-red-600 mr-2" />
              Détails de l'annulation
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Raison:</span>
                <span className="font-medium text-gray-900">{reason}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-900">
                  {new Date().toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Statut:</span>
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  Annulé
                </span>
              </div>
            </div>

            {/* Message informatif */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Information:</strong> Votre commande n'a pas été validée et votre panier est intact. 
                Vous pouvez réessayer le paiement ou modifier votre commande si nécessaire.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRetryPayment}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Réessayer le paiement
            </button>
            
            <Link
              href="/cart"
              className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour au panier
            </Link>
            
            <Link
              href="/"
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Accueil
            </Link>
          </div>

          {/* Options supplémentaires */}
          <div className="mt-12 bg-white rounded-xl shadow-sm p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🤔 Besoin d'aide ?
            </h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <p className="text-gray-600 text-sm">
                  Vérifiez que vos informations de paiement sont correctes
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <p className="text-gray-600 text-sm">
                  Assurez-vous d'avoir des fonds suffisants sur votre compte
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <p className="text-gray-600 text-sm">
                  Contactez votre banque si le problème persiste
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600">
                Si vous continuez à rencontrer des problèmes, n'hésitez pas à contacter notre service client.
              </p>
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
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-4xl mx-auto px-4 py-12">
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
