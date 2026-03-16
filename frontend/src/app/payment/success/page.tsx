"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Check, ArrowLeft, ShoppingBag, Truck, Printer } from "lucide-react";
import Link from "next/link";
import { cartService } from "@/lib/cart";
import { clientPaymentService } from "@/lib/clientPaymentService";
import { farotyService } from "@/lib/farotyService";
import { paymentIntegrationService } from "@/lib/paymentIntegrationService";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processPaymentSuccess = async () => {
      try {
        // Récupérer les paramètres de l'URL
        const urlParams = new URLSearchParams(searchParams.toString());
        const orderId = urlParams.get('orderId');
        const sessionToken = urlParams.get('sessionToken');
        
        console.log('🔍 Paramètres de succès de paiement:', {
          orderId,
          sessionToken,
          transactionId: urlParams.get('transactionId'),
          status: urlParams.get('status')
        });

        // Traiter le paiement avec le nouveau système d'intégration
        if (orderId) {
          try {
            // Vérifier le statut de la session Faroty si disponible
            if (sessionToken) {
              const sessionStatus = await farotyService.checkSessionStatus(sessionToken);
              console.log('Faroty session status:', sessionStatus);
              
              if (sessionStatus.success && sessionStatus.data?.status === 'COMPLETED') {
                // Mettre à jour le paiement comme réussi
                await paymentIntegrationService.updatePaymentAfterFaroty(
                  orderId,
                  sessionStatus.data.transactionId || sessionToken,
                  'SUCCESS',
                  sessionStatus.data.reference
                );
              }
            } else {
              // Mettre à jour manuellement si pas de sessionToken
              await paymentIntegrationService.updatePaymentAfterFaroty(
                orderId,
                'MANUAL_SUCCESS_' + Date.now(),
                'SUCCESS'
              );
            }
          } catch (error) {
            console.error('Error processing Faroty payment:', error);
          }
        }

        // Garder le traitement existant pour compatibilité
        const payment = clientPaymentService.processPaymentSuccess(urlParams);
        
        if (payment) {
          // Sauvegarder pour synchronisation admin
          await clientPaymentService.savePaymentForAdmin(payment);
          
          console.log('✅ Paiement réussi traité et sauvegardé pour l\'admin:', payment);
        } else {
          console.log('ℹ️ Pas de paramètres de paiement valides, utilisation du mode démo');
        }

        // Récupérer les détails de la commande depuis le localStorage
        const getOrderDetails = () => {
          // Essayer de récupérer les données de commande sauvegardées
          const savedOrderData = localStorage.getItem('current_payment_data');
          const savedPaymentInfo = localStorage.getItem('payment_session_info');
          
          // Déterminer la méthode de paiement
          let paymentMethod = "Faroty Wallet"; // Par défaut
          
          // 1. Essayer depuis les données de commande sauvegardées
          if (savedOrderData) {
            const orderData = JSON.parse(savedOrderData);
            paymentMethod = orderData.paymentMethod || paymentMethod;
            console.log('📦 Données de commande récupérées:', orderData);
          }
          
          // 2. Essayer depuis les infos de paiement Faroty
          if (savedPaymentInfo) {
            const paymentInfo = JSON.parse(savedPaymentInfo);
            if (paymentInfo.paymentMethod) {
              paymentMethod = paymentInfo.paymentMethod;
              console.log('💳 Méthode de paiement depuis infos Faroty:', paymentMethod);
            }
          }
          
          // 3. Essayer depuis le paiement traité
          if (payment && payment.paymentMethod) {
            paymentMethod = payment.paymentMethod;
            console.log('💳 Méthode de paiement depuis paiement traité:', paymentMethod);
          }
          
          // 4. Essayer de récupérer depuis le service Faroty
          try {
            // TODO: Implement getPaymentInfo method in FarotyService
            // const farotyPaymentInfo = farotyService.getPaymentInfo();
            // if (farotyPaymentInfo && farotyPaymentInfo.paymentMethod) {
            //   paymentMethod = farotyPaymentInfo.paymentMethod;
            //   console.log('💳 Méthode de paiement depuis service Faroty:', paymentMethod);
            // }
          } catch (error) {
            console.log('ℹ️ Impossible de récupérer le service Faroty:', error);
          }
          
          console.log('💰 Méthode de paiement finale:', paymentMethod);
          
          if (savedOrderData) {
            const orderData = JSON.parse(savedOrderData);
            setOrderDetails({
              orderNumber: orderData.orderId || payment?.orderId || `PS${Date.now()}`,
              amount: orderData.amount || payment?.amount || 0,
              paymentMethod: paymentMethod,
              status: "PAYÉ",
              date: new Date().toLocaleDateString('fr-FR'),
              transactionId: payment?.transactionId || urlParams.get('transactionId') || 'N/A',
              sessionToken: payment?.sessionToken || urlParams.get('sessionToken') || 'N/A',
              customerEmail: orderData.customerEmail || payment?.customerEmail || '',
              customerName: orderData.customerName || payment?.customerName || '',
              items: orderData.items || [
                { name: "Gel Nettoyant Doux", quantity: 2, price: 12.90 },
                { name: "Sérum Anti-Imperfections", quantity: 1, price: 18.90 },
                { name: "Crème Hydratante Légère", quantity: 1, price: 15.90 }
              ]
            });
          } else {
            // Mode démo si aucune donnée sauvegardée
            setOrderDetails({
              orderNumber: payment?.orderId || `PS${Date.now()}`,
              amount: payment?.amount || 47.70,
              paymentMethod: paymentMethod,
              status: "PAYÉ",
              date: new Date().toLocaleDateString('fr-FR'),
              transactionId: payment?.transactionId || urlParams.get('transactionId') || 'N/A',
              sessionToken: payment?.sessionToken || urlParams.get('sessionToken') || 'N/A',
              customerEmail: payment?.customerEmail || '',
              customerName: payment?.customerName || '',
              items: [
                { name: "Gel Nettoyant Doux", quantity: 2, price: 12.90 },
                { name: "Sérum Anti-Imperfections", quantity: 1, price: 18.90 },
                { name: "Crème Hydratante Légère", quantity: 1, price: 15.90 }
              ]
            });
          }
          
          setIsLoading(false);
        };

        getOrderDetails();
      } catch (error) {
        console.error('❌ Erreur traitement succès paiement:', error);
        // Continuer avec le mode normal même en cas d'erreur
        const loadOrderDetails = () => {
          setTimeout(() => {
            setOrderDetails({
              orderNumber: `PS${Date.now()}`,
              amount: 47.70,
              paymentMethod: "Faroty Wallet",
              status: "PAYÉ",
              date: new Date().toLocaleDateString('fr-FR'),
              items: [
                { name: "Gel Nettoyant Doux", quantity: 2, price: 12.90 },
                { name: "Sérum Anti-Imperfections", quantity: 1, price: 18.90 },
                { name: "Crème Hydratante Légère", quantity: 1, price: 15.90 }
              ]
            });
            setIsLoading(false);
          }, 1000);
        };
        loadOrderDetails();
      }
    };

    processPaymentSuccess();
  }, [searchParams]);

  useEffect(() => {
    // Vider le panier après un paiement réussi
    cartService.clearCart();
  }, []);

  const handleReturnToProducts = () => {
    router.push('/produits');
  };

  const handleCartClick = () => {
    router.push('/panier');
  };

  const handlePrintReceipt = () => {
    // Créer une fenêtre d'impression avec le reçu
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Veuillez autoriser les fenêtres popup pour imprimer le reçu');
      return;
    }

    // Générer le contenu HTML du reçu
    const receiptContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reçu de Paiement - PureSkin</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #10b981;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #10b981;
            margin-bottom: 5px;
          }
          .receipt-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .order-info {
            margin-bottom: 20px;
          }
          .order-info div {
            margin-bottom: 5px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .items-table th,
          .items-table td {
            border-bottom: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          .items-table th {
            background-color: #f8f9fa;
            font-weight: bold;
          }
          .total-section {
            border-top: 2px solid #333;
            padding-top: 10px;
            margin-top: 20px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
          }
          .thank-you {
            font-size: 16px;
            font-weight: bold;
            color: #10b981;
            margin-bottom: 10px;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">PureSkin</div>
          <div class="receipt-title">REÇU DE PAIEMENT</div>
        </div>
        
        <div class="order-info">
          <div><strong>Numéro de commande:</strong> ${orderDetails.orderNumber}</div>
          <div><strong>Date:</strong> ${orderDetails.date}</div>
          <div><strong>Statut:</strong> <span style="color: #10b981; font-weight: bold;">${orderDetails.status}</span></div>
          <div><strong>Méthode de paiement:</strong> ${orderDetails.paymentMethod}</div>
        </div>
        
        <table class="items-table">
          <thead>
            <tr>
              <th>Article</th>
              <th>Qté</th>
              <th>Prix</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${orderDetails.items.map((item: any) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price.toFixed(2)} €</td>
                <td>${(item.price * item.quantity).toFixed(2)} €</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total-section">
          <div class="total-row">
            <span>Sous-total:</span>
            <span>${orderDetails.amount.toFixed(2)} €</span>
          </div>
          <div class="total-row">
            <span>Livraison:</span>
            <span>GRATUITE</span>
          </div>
          <div class="total-row" style="font-size: 18px; color: #10b981;">
            <span>Total payé:</span>
            <span>${orderDetails.amount.toFixed(2)} €</span>
          </div>
        </div>
        
        <div class="footer">
          <div class="thank-you">Merci pour votre commande !</div>
          <div>PureSkin - Soins naturels pour votre peau</div>
          <div>www.pureskin.com</div>
          <div style="margin-top: 10px;">Reçu généré le ${new Date().toLocaleString('fr-FR')}</div>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            window.close();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(receiptContent);
    printWindow.document.close();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header onCartClick={handleCartClick} />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des détails de votre commande...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={handleCartClick} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Paiement réussi !
            </h1>
            <p className="text-gray-600">
              Votre commande a été validée et sera traitée dans les plus brefs délais.
            </p>
          </div>

          {/* Order Details */}
          {orderDetails && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Détails de la commande</h2>
              
              {/* Order Number */}
              <div className="bg-white rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Numéro de commande</p>
                    <p className="text-lg font-bold text-gray-900">{orderDetails.orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Statut</p>
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {orderDetails.status}
                    </span>
                  </div>
                </div>
                
                {/* Client Information */}
                {(orderDetails.customerEmail || orderDetails.customerName) && (
                  <div className="bg-white rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Informations client</h3>
                    <div className="space-y-2 text-sm">
                      {orderDetails.customerName && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nom:</span>
                          <span className="font-semibold text-gray-900">{orderDetails.customerName}</span>
                        </div>
                      )}
                      {orderDetails.customerEmail && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-semibold text-gray-900">{orderDetails.customerEmail}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Afficher les détails de transaction Faroty si disponibles */}
                {(orderDetails.transactionId || orderDetails.sessionToken) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-900 mb-2">Détails de transaction Faroty</p>
                    <div className="space-y-1 text-sm">
                      {orderDetails.transactionId && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transaction ID:</span>
                          <span className="font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {orderDetails.transactionId}
                          </span>
                        </div>
                      )}
                      {orderDetails.sessionToken && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Session:</span>
                          <span className="font-mono text-green-600 bg-green-50 px-2 py-1 rounded text-xs">
                            {orderDetails.sessionToken.substring(0, 20)}...
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Articles commandés</h3>
                <div className="space-y-2">
                  {orderDetails.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm bg-white p-3 rounded">
                      <span className="text-gray-600">{item.name} x{item.quantity}</span>
                      <span className="font-semibold text-gray-600">{(item.price * item.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-semibold text-gray-600">{orderDetails.amount.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Livraison</span>
                    <span className="font-semibold text-gray-600">GRATUITE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Méthode de paiement</span>
                    <span className="font-semibold text-gray-600">{orderDetails.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span className="text-gray-600">Total payé</span>
                    <span className="font-semibold text-green-600">{orderDetails.amount.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-4">Prochaines étapes</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="text-blue-900 font-medium">Confirmation de commande</p>
                  <p className="text-blue-700 text-sm">Un email de confirmation vous a été envoyé</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="text-blue-900 font-medium">Préparation de votre commande</p>
                  <p className="text-blue-700 text-sm">Nos équipes préparent vos produits avec soin</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="text-blue-900 font-medium">Expédition</p>
                  <p className="text-blue-700 text-sm">Livraison prévue sous 3-5 jours ouvrés</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={handlePrintReceipt}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center"
            >
              <Printer className="w-5 h-5 mr-2" />
              Imprimer le reçu
            </button>
            
            <button
              onClick={handleReturnToProducts}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Retour aux produits
            </button>
            
            <Link
              href="/"
              className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
            >
              Retour à l'accueil
            </Link>
          </div>

          {/* Support */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Une question sur votre commande ?
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
