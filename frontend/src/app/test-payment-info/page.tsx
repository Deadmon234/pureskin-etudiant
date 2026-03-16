"use client";

import { useState, useEffect } from "react";
import { farotyService } from "@/lib/faroty-service";
import { CreditCard, Check, AlertCircle, RefreshCw, Eye, Trash2, Bug } from "lucide-react";

export default function TestPaymentInfoPage() {
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    // Charger les informations de paiement au chargement de la page
    loadPaymentInfo();
  }, []);

  const loadPaymentInfo = () => {
    const info = farotyService.getPaymentInfo();
    setPaymentInfo(info);
    console.log('📋 Informations de paiement chargées:', info);
  };

  const testCreateSession = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      console.log('🧪 TEST CRÉATION SESSION COMPLÈTE');
      
      const response = await farotyService.createPaymentSession(
        7500,
        {
          orderNumber: 'PS-TEST-' + Date.now(),
          customerEmail: 'test@example.com',
          items: [
            { name: 'Sérum Hydratant Premium', quantity: 2, price: 3000 },
            { name: 'Crème Solaire SPF50', quantity: 1, price: 1500 }
          ]
        }
      );
      
      setResult({
        success: true,
        type: 'session_created',
        response: response,
        timestamp: new Date().toISOString()
      });
      
      // Recharger les informations de paiement
      loadPaymentInfo();
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setResult({
        success: false,
        type: 'session_error',
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testLaunchPaymentUrl = async () => {
    console.log('🚀 TEST LANCEMENT SESSION URL');
    
    // Récupérer les informations de paiement actuelles
    const paymentInfo = farotyService.getPaymentInfo();
    
    if (!paymentInfo) {
      console.error('❌ Aucune information de paiement trouvée');
      setResult({
        success: false,
        type: 'no_payment_info',
        error: 'Aucune information de paiement trouvée. Veuillez d\'abord créer une session.',
        timestamp: new Date().toISOString()
      });
      return;
    }
    
    console.log('📋 INFORMATIONS DE PAIEMENT TROUVÉES:');
    console.log('Session Token:', paymentInfo.sessionToken);
    console.log('Payment URL:', paymentInfo.paymentUrl);
    console.log('Order Data:', paymentInfo.orderData);
    console.log('Dynamic Content Data:', paymentInfo.dynamicContentData);
    console.log('Metadata:', paymentInfo.metadata);
    
    // Vérifier que toutes les informations requises sont présentes
    const requiredFields = ['sessionToken', 'paymentUrl', 'orderData'];
    const missingFields = requiredFields.filter(field => !paymentInfo[field]);
    
    if (missingFields.length > 0) {
      console.error('❌ Champs manquants:', missingFields);
      setResult({
        success: false,
        type: 'missing_fields',
        error: `Champs manquants: ${missingFields.join(', ')}`,
        timestamp: new Date().toISOString()
      });
      return;
    }
    
    try {
      // Tester la vérification de session avec l'API Faroty
      console.log('🔍 VÉRIFICATION DE LA SESSION AVEC L\'API FAROTY...');
      
      const isVerified = await farotyService.verifyPaymentSession(paymentInfo.sessionToken);
      
      if (isVerified) {
        console.log('✅ Session vérifiée avec succès');
        setResult({
          success: true,
          type: 'session_verified',
          message: 'Session vérifiée avec succès. Les informations de paiement sont bien récupérées.',
          paymentInfo: paymentInfo,
          timestamp: new Date().toISOString()
        });
        
        // Lancer la redirection après 2 secondes
        setTimeout(() => {
          console.log('🚀 Lancement de la redirection vers Faroty...');
          farotyService.redirectToPayment(paymentInfo.paymentUrl);
        }, 2000);
        
      } else {
        console.error('❌ Échec de la vérification de la session');
        setResult({
          success: false,
          type: 'session_verification_failed',
          error: 'La session n\'a pas pu être vérifiée auprès de Faroty',
          timestamp: new Date().toISOString()
        });
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('❌ Erreur lors de la vérification de la session:', errorMessage);
      setResult({
        success: false,
        type: 'verification_error',
        error: `Erreur lors de la vérification: ${errorMessage}`,
        timestamp: new Date().toISOString()
      });
    }
  };

  const testUpdateStatus = (status: string) => {
    farotyService.updatePaymentStatus(status, {
      updatedAt: new Date().toISOString(),
      updatedBy: 'test'
    });
    
    loadPaymentInfo();
    
    setResult({
      success: true,
      type: 'status_updated',
      message: `Statut mis à jour: ${status}`,
      timestamp: new Date().toISOString()
    });
  };

  const testClearPayment = () => {
    farotyService.clearPaymentInfo();
    setPaymentInfo(null);
    
    setResult({
      success: true,
      type: 'payment_cleared',
      message: 'Informations de paiement effacées',
      timestamp: new Date().toISOString()
    });
  };

  const testLogDetails = () => {
    farotyService.logPaymentDetails();
    
    setResult({
      success: true,
      type: 'details_logged',
      message: 'Détails affichés dans la console',
      timestamp: new Date().toISOString()
    });
  };

  const testCurrentUrl = () => {
    const url = farotyService.getCurrentPaymentUrl();
    
    setResult({
      success: true,
      type: 'current_url',
      url: url,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Informations Paiement</h1>
        
        <div className="mb-6">
          <a 
            href="/test-session-verification" 
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Bug className="w-4 h-4 mr-2" />
            Test Complet de Vérification
          </a>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                Actions de Test
              </h2>
              
              <div className="space-y-4">
                <button
                  onClick={testCreateSession}
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Création...' : 'Créer Session Test'}
                </button>
                
                <button
                  onClick={testLaunchPaymentUrl}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  <Eye className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Test...' : 'Tester Lancement Session URL'}
                </button>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => testUpdateStatus('PENDING')}
                    className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 text-sm"
                  >
                    Statut: PENDING
                  </button>
                  <button
                    onClick={() => testUpdateStatus('COMPLETED')}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-sm"
                  >
                    Statut: COMPLETED
                  </button>
                  <button
                    onClick={() => testUpdateStatus('FAILED')}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 text-sm"
                  >
                    Statut: FAILED
                  </button>
                  <button
                    onClick={() => testUpdateStatus('CANCELLED')}
                    className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 text-sm"
                  >
                    Statut: CANCELLED
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={testLogDetails}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Voir Détails
                  </button>
                  <button
                    onClick={testCurrentUrl}
                    className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 text-sm"
                  >
                    URL Actuelle
                  </button>
                </div>
                
                <button
                  onClick={testClearPayment}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Effacer Paiement
                </button>
              </div>
            </div>

            {/* Résultats */}
            {result && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Résultat du Test
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {result.success ? 'Succès' : 'Échec'}
                  </span>
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="ml-2 font-medium">{result.type}</span>
                  </div>
                  
                  {result.message && (
                    <div>
                      <span className="text-sm text-gray-600">Message:</span>
                      <span className="ml-2">{result.message}</span>
                    </div>
                  )}
                  
                  {result.url && (
                    <div>
                      <span className="text-sm text-gray-600">URL:</span>
                      <div className="mt-1 p-2 bg-gray-100 rounded text-xs break-all">
                        {result.url}
                      </div>
                    </div>
                  )}
                  
                  {result.response && (
                    <div>
                      <span className="text-sm text-gray-600">Réponse:</span>
                      <pre className="mt-1 bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-32">
                        {JSON.stringify(result.response, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {result.error && (
                    <div>
                      <span className="text-sm text-red-600">Erreur:</span>
                      <div className="mt-1 p-2 bg-red-50 rounded text-red-700 text-sm">
                        {result.error}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    Timestamp: {result.timestamp}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Informations actuelles */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Check className="w-5 h-5 mr-2 text-green-600" />
                Informations Actuelles
              </h2>
              
              {paymentInfo ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Session Token:</span>
                      <div className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">
                        {paymentInfo.sessionToken}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Session ID:</span>
                      <div className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">
                        {paymentInfo.sessionId || 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Wallet ID:</span>
                      <div className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">
                        {paymentInfo.walletId}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Montant:</span>
                      <div className="font-medium bg-gray-100 p-2 rounded mt-1">
                        {paymentInfo.amount} {paymentInfo.currency}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">Statut:</span>
                    <div className={`mt-1 inline-block px-3 py-1 rounded text-sm font-medium ${
                      paymentInfo.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      paymentInfo.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      paymentInfo.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {paymentInfo.status}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">URL Paiement:</span>
                    <div className="font-mono text-xs bg-blue-50 p-2 rounded mt-1 break-all">
                      {paymentInfo.paymentUrl}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">Commande:</span>
                    <div className="bg-gray-100 p-2 rounded mt-1">
                      <div className="font-medium">{paymentInfo.orderData.orderNumber}</div>
                      <div className="text-xs text-gray-600">{paymentInfo.orderData.customerEmail}</div>
                      <div className="text-xs text-gray-600">{paymentInfo.orderData.items.length} articles</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Créé le:</span>
                      <div className="text-xs bg-gray-100 p-2 rounded mt-1">
                        {new Date(paymentInfo.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Mis à jour:</span>
                      <div className="text-xs bg-gray-100 p-2 rounded mt-1">
                        {paymentInfo.updatedAt ? new Date(paymentInfo.updatedAt).toLocaleString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">Session Active:</span>
                    <div className="mt-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        farotyService.isPaymentSessionActive() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {farotyService.isPaymentSessionActive() ? 'OUI' : 'NON'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Aucune information de paiement trouvée</p>
                  <p className="text-sm mt-2">Créez une session de paiement pour commencer</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
