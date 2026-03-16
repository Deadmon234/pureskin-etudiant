"use client";

import { useState, useEffect } from "react";
import { farotyService } from "@/lib/faroty-service";
import { CreditCard, Check, AlertCircle, RefreshCw, Eye, Play, Info, Bug, Zap } from "lucide-react";

export default function TestSessionVerificationPage() {
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testSteps, setTestSteps] = useState<any[]>([]);

  useEffect(() => {
    loadPaymentInfo();
  }, []);

  const loadPaymentInfo = () => {
    const info = farotyService.getPaymentInfo();
    setPaymentInfo(info);
    console.log('📋 Informations de paiement chargées:', info);
  };

  const addTestStep = (step: any) => {
    setTestSteps(prev => [...prev, { ...step, timestamp: new Date().toISOString() }]);
  };

  const runCompleteTest = async () => {
    setIsLoading(true);
    setTestSteps([]);
    setVerificationResult(null);

    try {
      // Étape 1: Vérification des informations locales
      addTestStep({
        type: 'info',
        title: '🔍 Vérification des informations locales',
        message: 'Vérification que les informations de paiement sont présentes localement...'
      });

      const localInfo = farotyService.getPaymentInfo();
      
      if (!localInfo) {
        addTestStep({
          type: 'error',
          title: '❌ Aucune information locale',
          message: 'Aucune information de paiement trouvée dans localStorage'
        });
        return;
      }

      addTestStep({
        type: 'success',
        title: '✅ Informations locales trouvées',
        message: `Session: ${localInfo.sessionToken?.substring(0, 20)}... | Wallet: ${localInfo.walletId} | Montant: ${localInfo.amount} XAF`
      });

      // Étape 2: Validation des champs requis
      addTestStep({
        type: 'info',
        title: '📋 Validation des champs requis',
        message: 'Vérification que tous les champs nécessaires sont présents...'
      });

      const requiredFields = ['sessionToken', 'paymentUrl', 'orderData', 'walletId', 'amount'];
      const missingFields = requiredFields.filter(field => !localInfo[field]);

      if (missingFields.length > 0) {
        addTestStep({
          type: 'error',
          title: '❌ Champs manquants',
          message: `Champs requis manquants: ${missingFields.join(', ')}`
        });
        return;
      }

      addTestStep({
        type: 'success',
        title: '✅ Tous les champs présents',
        message: 'Toutes les informations requises sont disponibles'
      });

      // Étape 3: Test de l'API Faroty
      addTestStep({
        type: 'info',
        title: '🌐 Test de l\'API Faroty',
        message: 'Vérification de la session avec l\'API Faroty...'
      });

      const isVerified = await farotyService.verifyPaymentSession(localInfo.sessionToken);

      if (isVerified) {
        addTestStep({
          type: 'success',
          title: '✅ Session vérifiée',
          message: 'La session est correctement enregistrée chez Faroty'
        });

        // Étape 4: Test de l'URL de paiement
        addTestStep({
          type: 'info',
          title: '🔗 Test de l\'URL de paiement',
          message: 'Validation de l\'URL de paiement Faroty...'
        });

        if (localInfo.paymentUrl && localInfo.paymentUrl.includes('pay.faroty.me')) {
          addTestStep({
            type: 'success',
            title: '✅ URL valide',
            message: `URL de paiement correcte: ${localInfo.paymentUrl}`
          });

          setVerificationResult({
            success: true,
            message: 'Tous les tests sont passés avec succès !',
            details: {
              sessionToken: localInfo.sessionToken,
              paymentUrl: localInfo.paymentUrl,
              walletId: localInfo.walletId,
              orderData: localInfo.orderData
            }
          });
        } else {
          addTestStep({
            type: 'error',
            title: '❌ URL invalide',
            message: `URL incorrecte: ${localInfo.paymentUrl}`
          });
        }
      } else {
        addTestStep({
          type: 'error',
          title: '❌ Échec de la vérification',
          message: 'La session n\'a pas pu être vérifiée auprès de Faroty'
        });
      }

    } catch (error) {
      addTestStep({
        type: 'error',
        title: '❌ Erreur inattendue',
        message: `Erreur: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testUrlRedirection = () => {
    if (!paymentInfo?.paymentUrl) {
      alert('Aucune URL de paiement disponible');
      return;
    }

    // Ouvrir l'URL dans un nouvel onglet pour test
    window.open(paymentInfo.paymentUrl, '_blank');
  };

  const clearAllData = () => {
    farotyService.clearPaymentInfo();
    setPaymentInfo(null);
    setVerificationResult(null);
    setTestSteps([]);
    addTestStep({
      type: 'info',
      title: '🗑️ Données effacées',
      message: 'Toutes les informations de paiement ont été effacées'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test de Vérification de Session</h1>
          <p className="text-gray-600">Test complet du processus de récupération des informations de paiement Faroty</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Panneau de contrôle */}
          <div className="space-y-6">
            {/* Actions principales */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                Actions de Test
              </h2>
              
              <div className="space-y-4">
                <button
                  onClick={runCompleteTest}
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                >
                  <Play className={`w-4 h-4 mr-2 ${isLoading ? 'animate-pulse' : ''}`} />
                  {isLoading ? 'Test en cours...' : 'Lancer Test Complet'}
                </button>
                
                <button
                  onClick={testUrlRedirection}
                  disabled={!paymentInfo?.paymentUrl}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ouvrir URL de Paiement
                </button>
                
                <button
                  onClick={clearAllData}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Effacer Données
                </button>
              </div>
            </div>

            {/* Résultat de la vérification */}
            {verificationResult && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-600" />
                  Résultat du Test
                </h3>
                
                <div className={`p-4 rounded-lg ${
                  verificationResult.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <p className={`font-medium ${
                    verificationResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {verificationResult.message}
                  </p>
                </div>

                {verificationResult.details && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-gray-700">Détails techniques:</h4>
                    <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                      <p><strong>Session Token:</strong> {verificationResult.details.sessionToken?.substring(0, 30)}...</p>
                      <p><strong>Payment URL:</strong> {verificationResult.details.paymentUrl}</p>
                      <p><strong>Wallet ID:</strong> {verificationResult.details.walletId}</p>
                      <p><strong>Order Number:</strong> {verificationResult.details.orderData?.orderNumber}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Journal des étapes */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Bug className="w-5 h-5 mr-2 text-purple-600" />
                Journal des Étapes
              </h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {testSteps.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Info className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Aucun test lancé</p>
                    <p className="text-sm mt-2">Cliquez sur "Lancer Test Complet" pour commencer</p>
                  </div>
                ) : (
                  testSteps.map((step, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      step.type === 'success' ? 'bg-green-50 border-green-200' :
                      step.type === 'error' ? 'bg-red-50 border-red-200' :
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`font-medium ${
                            step.type === 'success' ? 'text-green-800' :
                            step.type === 'error' ? 'text-red-800' :
                            'text-blue-800'
                          }`}>
                            {step.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{step.message}</p>
                        </div>
                        <div className="text-xs text-gray-500 ml-2">
                          {new Date(step.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Informations actuelles */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                Informations Actuelles
              </h2>
              
              {paymentInfo ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <span className="text-sm text-gray-600">Session Token:</span>
                      <div className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 break-all">
                        {paymentInfo.sessionToken}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Payment URL:</span>
                      <div className="font-mono text-xs bg-blue-50 p-2 rounded mt-1 break-all">
                        {paymentInfo.paymentUrl}
                      </div>
                    </div>
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
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Aucune information de paiement trouvée</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
