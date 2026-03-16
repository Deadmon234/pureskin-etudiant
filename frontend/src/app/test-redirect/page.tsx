"use client";

import { useState } from "react";
import { farotyService } from "@/lib/faroty-service";
import { ExternalLink, Play, AlertCircle, Check } from "lucide-react";

export default function TestRedirectPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [testUrl, setTestUrl] = useState("https://pay.faroty.me/payment?sessionToken=PlIgutc6O4cNe9AeETyCgyf-nBn3WGD");
  const [result, setResult] = useState<any>(null);

  const testRedirect = () => {
    setIsLoading(true);
    setResult(null);
    
    console.log('🧪 TEST DE REDIRECTION');
    console.log('URL de test:', testUrl);
    
    try {
      // Tester la redirection avec l'URL de test
      farotyService.redirectToPayment(testUrl);
      
      setResult({
        success: true,
        message: 'Redirection initiée',
        url: testUrl,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testSessionCreation = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      console.log('🧪 TEST CRÉATION SESSION + REDIRECTION');
      
      // Simuler une session de paiement
      const mockResponse = {
        success: true,
        data: {
          sessionToken: 'PlIgutc6O4cNe9AeETyCgyf-nBn3WGD',
          sessionUrl: 'https://pay.faroty.me/payment?sessionToken=PlIgutc6O4cNe9AeETyCgyf-nBn3WGD'
        },
        timestamp: new Date().toISOString()
      };
      
      console.log('Réponse simulée:', mockResponse);
      
      if (mockResponse.success && mockResponse.data) {
        const sessionUrl = mockResponse.data.sessionUrl;
        console.log('Session URL:', sessionUrl);
        
        // Rediriger vers Faroty
        farotyService.redirectToPayment(sessionUrl);
        
        setResult({
          success: true,
          message: 'Session créée et redirection initiée',
          sessionUrl: sessionUrl,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearModal = () => {
    const modal = document.getElementById('faroty-redirect-modal');
    if (modal) {
      modal.remove();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Redirection Faroty</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Test URL direct */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ExternalLink className="w-5 h-5 mr-2 text-blue-600" />
              Test URL Direct
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de paiement Faroty
                </label>
                <input
                  type="text"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="https://pay.faroty.me/payment?sessionToken=..."
                />
              </div>
              
              <button
                onClick={testRedirect}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
              >
                <Play className="w-4 h-4 mr-2" />
                {isLoading ? 'Test...' : 'Tester Redirection'}
              </button>
            </div>
          </div>

          {/* Test Session + Redirect */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Check className="w-5 h-5 mr-2 text-green-600" />
              Test Session + Redirection
            </h2>
            
            <p className="text-gray-600 mb-4">
              Simule la création d'une session de paiement puis la redirection vers Faroty
            </p>
            
            <button
              onClick={testSessionCreation}
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
            >
              <Play className="w-4 h-4 mr-2" />
              {isLoading ? 'Test...' : 'Session + Redirection'}
            </button>
          </div>
        </div>

        {/* Résultats */}
        {result && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">
              Résultat du Test
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {result.success ? 'Succès' : 'Échec'}
              </span>
            </h3>
            
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {/* Actions supplémentaires */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Actions Supplémentaires</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={clearModal}
              className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700"
            >
              Nettoyer Modal
            </button>
            
            <button
              onClick={() => window.open(testUrl, '_blank')}
              className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
            >
              Ouvrir dans Nouvel Onglet
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Instructions de Test</h3>
          
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>Cliquez sur "Tester Redirection" pour tester directement l'URL</li>
            <li>Cliquez sur "Session + Redirection" pour simuler le flux complet</li>
            <li>Un modal devrait apparaître avec une barre de progression</li>
            <li>Après 2 secondes, la redirection vers Faroty devrait s'exécuter</li>
            <li>Si la redirection automatique échoue, cliquez sur "Ouvrir maintenant"</li>
            <li>Vérifiez la console pour les logs détaillés</li>
          </ol>
          
          <div className="mt-4 p-3 bg-blue-100 rounded">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Si la redirection ne fonctionne pas, vérifiez que 
              les popups ne sont pas bloqués par votre navigateur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
