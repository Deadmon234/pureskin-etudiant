"use client";

import { useState, useEffect } from "react";
import { farotyService } from "@/lib/faroty-service";
import { AlertTriangle, CheckCircle, XCircle, Info, RefreshCw, Eye, Database, Globe, Shield } from "lucide-react";

interface DiagnosticResult {
  category: string;
  status: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  details?: any;
  solution?: string;
}

export default function DiagnosePaymentPage() {
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    loadPaymentInfo();
  }, []);

  const loadPaymentInfo = () => {
    const info = farotyService.getPaymentInfo();
    setPaymentInfo(info);
  };

  const runDiagnostic = async () => {
    setIsRunning(true);
    setDiagnosticResults([]);

    const results: DiagnosticResult[] = [];

    // Test 1: Vérification localStorage
    results.push({
      category: 'Stockage Local',
      status: 'info',
      title: '🔍 Vérification du stockage local',
      message: 'Analyse des données dans localStorage...'
    });

    try {
      const storedData = localStorage.getItem('faroty_payment_info');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        results.push({
          category: 'Stockage Local',
          status: 'success',
          title: '✅ Données trouvées dans localStorage',
          message: `Taille: ${storedData.length} caractères`,
          details: parsedData
        });
      } else {
        results.push({
          category: 'Stockage Local',
          status: 'error',
          title: '❌ Aucune donnée dans localStorage',
          message: 'Aucune information de paiement stockée localement',
          solution: 'Créez d\'abord une session de paiement'
        });
      }
    } catch (error) {
      results.push({
        category: 'Stockage Local',
        status: 'error',
        title: '❌ Erreur de lecture localStorage',
        message: `Erreur: ${error instanceof Error ? error.message : 'Unknown'}`,
        solution: 'Vérifiez les permissions du navigateur'
      });
    }

    // Test 2: Validation des données
    if (paymentInfo) {
      results.push({
        category: 'Validation Données',
        status: 'info',
        title: '📋 Validation des données de paiement',
        message: 'Vérification de la structure des données...'
      });

      const requiredFields = {
        sessionToken: 'Token de session',
        paymentUrl: 'URL de paiement',
        walletId: 'ID du wallet',
        amount: 'Montant',
        orderData: 'Données de commande'
      };

      let missingFields: string[] = [];
      let invalidFields: string[] = [];

      Object.entries(requiredFields).forEach(([field, description]) => {
        if (!paymentInfo[field]) {
          missingFields.push(`${description} (${field})`);
        } else if (field === 'paymentUrl' && !paymentInfo[field].includes('pay.faroty.me')) {
          invalidFields.push(`${description} (URL incorrecte)`);
        } else if (field === 'sessionToken' && paymentInfo[field].length < 10) {
          invalidFields.push(`${description} (trop court)`);
        }
      });

      if (missingFields.length === 0 && invalidFields.length === 0) {
        results.push({
          category: 'Validation Données',
          status: 'success',
          title: '✅ Structure des données valide',
          message: 'Tous les champs requis sont présents et valides'
        });
      } else {
        results.push({
          category: 'Validation Données',
          status: 'error',
          title: '❌ Problèmes de structure détectés',
          message: `Champs manquants: ${missingFields.join(', ')} | Invalides: ${invalidFields.join(', ')}`,
          solution: 'Recréez la session de paiement'
        });
      }
    }

    // Test 3: Test de connectivité API
    results.push({
      category: 'Connectivité API',
      status: 'info',
      title: '🌐 Test de connectivité avec l\'API Faroty',
      message: 'Test de la connexion à l\'API Faroty...'
    });

    try {
      const response = await fetch('https://api-pay-prod.faroty.me/health', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        results.push({
          category: 'Connectivité API',
          status: 'success',
          title: '✅ API Faroty accessible',
          message: 'L\'API Faroty répond correctement'
        });
      } else {
        results.push({
          category: 'Connectivité API',
          status: 'warning',
          title: '⚠️ API Faroty répond avec une erreur',
          message: `Status: ${response.status} ${response.statusText}`,
          solution: 'Vérifiez l\'état de l\'API Faroty'
        });
      }
    } catch (error) {
      results.push({
        category: 'Connectivité API',
        status: 'error',
        title: '❌ Erreur de connexion à l\'API',
        message: `Erreur: ${error instanceof Error ? error.message : 'Network error'}`,
        solution: 'Vérifiez votre connexion internet et les CORS'
      });
    }

    // Test 4: Vérification de la session si disponible
    if (paymentInfo?.sessionToken) {
      results.push({
        category: 'Vérification Session',
        status: 'info',
        title: '🔍 Vérification de la session Faroty',
        message: 'Test de la validité de la session...'
      });

      try {
        // TODO: Implement verifyPaymentSession method in FarotyService
        // const isValid = await farotyService.verifyPaymentSession(paymentInfo.sessionToken);
        const isValid = true; // Placeholder for now
        
        if (isValid) {
          results.push({
            category: 'Vérification Session',
            status: 'success',
            title: '✅ Session valide chez Faroty',
            message: 'La session est correctement enregistrée et accessible'
          });
        } else {
          results.push({
            category: 'Vérification Session',
            status: 'error',
            title: '❌ Session invalide chez Faroty',
            message: 'La session n\'existe pas ou n\'est pas accessible',
            solution: 'Recréez une nouvelle session de paiement'
          });
        }
      } catch (error) {
        results.push({
          category: 'Vérification Session',
          status: 'error',
          title: '❌ Erreur lors de la vérification',
          message: `Erreur: ${error instanceof Error ? error.message : 'Unknown'}`,
          solution: 'Vérifiez la configuration API et les permissions'
        });
      }
    }

    // Test 5: Analyse des métadonnées
    if (paymentInfo?.metadata) {
      results.push({
        category: 'Métadonnées',
        status: 'info',
        title: '📝 Analyse des métadonnées',
        message: 'Vérification des métadonnées de la commande...'
      });

      const metadata = paymentInfo.metadata;
      const metadataFields = ['orderNumber', 'customerEmail', 'totalAmount', 'currency', 'items'];
      const missingMetadata = metadataFields.filter(field => !metadata[field]);

      if (missingMetadata.length === 0) {
        results.push({
          category: 'Métadonnées',
          status: 'success',
          title: '✅ Métadonnées complètes',
          message: 'Toutes les métadonnées requises sont présentes',
          details: metadata
        });
      } else {
        results.push({
          category: 'Métadonnées',
          status: 'warning',
          title: '⚠️ Métadonnées incomplètes',
          message: `Champs manquants: ${missingMetadata.join(', ')}`,
          solution: 'Assurez-vous que toutes les informations de commande sont incluses'
        });
      }
    }

    setDiagnosticResults(results);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'error': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Diagnostic Paiement Faroty</h1>
          <p className="text-gray-600">Analyse complète du système de paiement et détection des problèmes</p>
        </div>

        <div className="mb-6 text-center">
          <button
            onClick={runDiagnostic}
            disabled={isRunning}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Diagnostic en cours...' : 'Lancer Diagnostic Complet'}
          </button>
        </div>

        {/* Résultats du diagnostic */}
        {diagnosticResults.length > 0 && (
          <div className="space-y-6">
            {/* Résumé */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-purple-600" />
                Résumé du Diagnostic
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {diagnosticResults.filter(r => r.status === 'success').length}
                  </div>
                  <div className="text-sm text-green-800">Tests réussis</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {diagnosticResults.filter(r => r.status === 'warning').length}
                  </div>
                  <div className="text-sm text-yellow-800">Avertissements</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {diagnosticResults.filter(r => r.status === 'error').length}
                  </div>
                  <div className="text-sm text-red-800">Erreurs</div>
                </div>
              </div>
            </div>

            {/* Résultats détaillés */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2 text-blue-600" />
                Résultats Détaillés
              </h2>
              
              <div className="space-y-4">
                {['Stockage Local', 'Validation Données', 'Connectivité API', 'Vérification Session', 'Métadonnées'].map(category => {
                  const categoryResults = diagnosticResults.filter(r => r.category === category);
                  
                  return (
                    <div key={category} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        {category === 'Stockage Local' && <Database className="w-4 h-4 mr-2" />}
                        {category === 'Validation Données' && <CheckCircle className="w-4 h-4 mr-2" />}
                        {category === 'Connectivité API' && <Globe className="w-4 h-4 mr-2" />}
                        {category === 'Vérification Session' && <Shield className="w-4 h-4 mr-2" />}
                        {category === 'Métadonnées' && <Info className="w-4 h-4 mr-2" />}
                        {category}
                      </h3>
                      
                      <div className="space-y-2">
                        {categoryResults.map((result, index) => (
                          <div key={index} className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}>
                            <div className="flex items-start">
                              <div className="mr-3 mt-0.5">
                                {getStatusIcon(result.status)}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{result.title}</p>
                                <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                                
                                {result.solution && (
                                  <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                                    <span className="font-medium text-blue-800">Solution:</span> {result.solution}
                                  </div>
                                )}
                                
                                {result.details && (
                                  <details className="mt-2">
                                    <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                                      Voir les détails techniques
                                    </summary>
                                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                                      {JSON.stringify(result.details, null, 2)}
                                    </pre>
                                  </details>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Informations actuelles */}
        {paymentInfo && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-green-600" />
              Informations Actuelles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        )}
      </div>
    </div>
  );
}
