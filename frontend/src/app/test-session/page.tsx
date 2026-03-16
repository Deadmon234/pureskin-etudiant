"use client";

import { useState } from "react";
import { farotyService } from "@/lib/faroty-service";
import { Play, AlertCircle, Check, ExternalLink, Code } from "lucide-react";

export default function TestSessionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [walletId, setWalletId] = useState("wallet-test-123");
  const [amount, setAmount] = useState(5000);

  const testSessionCreation = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      console.log('🧪 TEST CRÉATION SESSION FAROTY');
      
      const response = await farotyService.createPaymentSession(
        amount,
        {
          orderNumber: 'PS-TEST-' + Date.now(),
          customerEmail: 'test@example.com',
          items: [
            { name: 'Sérum Hydratant', quantity: 2, price: 2500 },
            { name: 'Crème Solaire', quantity: 1, price: 1500 }
          ]
        }
      );
      
      setResult({
        success: true,
        response: response,
        timestamp: new Date().toISOString()
      });
      
      console.log('✅ Session créée:', response);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setResult({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
      
      console.error('❌ Erreur création session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testDirectUrl = () => {
    const testUrl = `https://pay.faroty.me/payment?sessionToken=PlIgutc6O4cNe9AeETyCgyf-nBn3WGD`;
    console.log('🧪 TEST URL DIRECT FAROTY');
    console.log('URL:', testUrl);
    
    // Ouvrir dans un nouvel onglet pour tester
    window.open(testUrl, '_blank');
    
    setResult({
      success: true,
      message: 'URL directe ouverte',
      url: testUrl,
      timestamp: new Date().toISOString()
    });
  };

  const validateSessionUrl = (sessionUrl: string) => {
    console.log('🔍 VALIDATION URL SESSION');
    
    const issues = [];
    
    // Vérifier le format de l'URL
    if (!sessionUrl.includes('pay.faroty.me/payment')) {
      issues.push('URL ne contient pas pay.faroty.me/payment');
    }
    
    if (!sessionUrl.includes('sessionToken=')) {
      issues.push('URL ne contient pas sessionToken=');
    }
    
    // Extraire le token
    const tokenMatch = sessionUrl.match(/sessionToken=([^&]+)/);
    if (!tokenMatch) {
      issues.push('Impossible d\'extraire le sessionToken');
    } else {
      const token = tokenMatch[1];
      if (token.length < 10) {
        issues.push('SessionToken trop court');
      }
      console.log('Token extrait:', token);
    }
    
    console.log('Validation result:', issues.length === 0 ? '✅ Valid' : '❌ Issues found');
    
    return {
      isValid: issues.length === 0,
      issues: issues,
      token: tokenMatch ? tokenMatch[1] : null
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Session Faroty</h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Code className="w-5 h-5 mr-2 text-blue-600" />
                Configuration Test
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wallet ID
                  </label>
                  <input
                    type="text"
                    value={walletId}
                    onChange={(e) => setWalletId(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="wallet-test-123"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant (XAF)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg"
                    placeholder="5000"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Actions de Test</h2>
              
              <div className="space-y-4">
                <button
                  onClick={testSessionCreation}
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isLoading ? 'Création...' : 'Créer Session'}
                </button>
                
                <button
                  onClick={testDirectUrl}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Tester URL Directe
                </button>
              </div>
            </div>
          </div>

          {/* Résultats */}
          <div className="space-y-6">
            {result && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Résultat du Test
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {result.success ? 'Succès' : 'Échec'}
                  </span>
                </h2>
                
                <div className="space-y-4">
                  {result.response && (
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Réponse API:</h3>
                      <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto max-h-64">
                        {JSON.stringify(result.response, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {result.url && (
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">URL de paiement:</h3>
                      <div className="bg-gray-100 p-3 rounded">
                        <code className="text-xs break-all">{result.url}</code>
                      </div>
                      
                      <button
                        onClick={() => window.open(result.url, '_blank')}
                        className="mt-2 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 flex items-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ouvrir cette URL
                      </button>
                    </div>
                  )}
                  
                  {result.error && (
                    <div>
                      <h3 className="font-medium text-red-700 mb-2">Erreur:</h3>
                      <div className="bg-red-50 p-3 rounded text-red-700">
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

            {/* Validation URL */}
            {result?.response?.data?.sessionUrl && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Validation URL</h2>
                
                {(() => {
                  const validation = validateSessionUrl(result.response.data.sessionUrl);
                  return (
                    <div className="space-y-3">
                      <div className={`p-3 rounded ${
                        validation.isValid ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                      }`}>
                        {validation.isValid ? '✅ URL valide' : '❌ URL invalide'}
                      </div>
                      
                      {validation.issues.length > 0 && (
                        <div>
                          <h4 className="font-medium text-red-700 mb-2">Problèmes:</h4>
                          <ul className="list-disc list-inside text-red-600 text-sm">
                            {validation.issues.map((issue, index) => (
                              <li key={index}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {validation.token && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">Token extrait:</h4>
                          <code className="bg-gray-100 p-2 rounded text-sm">{validation.token}</code>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Documentation */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Débogage Session Faroty</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-700 mb-2">Causes possibles de chargement infini:</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-600 text-sm">
                <li>SessionToken invalide ou expiré</li>
                <li>Structure de requête incorrecte</li>
                <li>Type de contenu non supporté</li>
                <li>Montant invalide (doit être nombre)</li>
                <li>WalletId non existant</li>
                <li>URL de callback incorrecte</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-blue-700 mb-2">Corrections apportées:</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-600 text-sm">
                <li>Type changé de 'DEPOSIT' à 'PAYMENT'</li>
                <li>ContentType changé en 'PRODUCT'</li>
                <li>Ajout de metadata structurée</li>
                <li>CustomData séparé de dynamicContentData</li>
                <li>Header Accept ajouté</li>
                <li>Logs détaillés pour debugging</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
