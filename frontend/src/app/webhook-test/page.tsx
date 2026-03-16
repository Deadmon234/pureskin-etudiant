"use client";

import { useState } from "react";
import { ExternalLink, Check, AlertCircle, Copy } from "lucide-react";

export default function WebhookTestPage() {
  const [webhookUrl, setWebhookUrl] = useState("http://localhost:8080/api/webhooks/faroty/payment");
  const [webhookSecret] = useState("whs_mGj5QgRlqgrFL8puchO-ZMk7QrXNbT1TYSxYAg");
  const [webhookId] = useState("d4c411c0-fc50-4d56-a3a5-21c47a26cc66");
  const [testPayload, setTestPayload] = useState(`{
  "eventType": "payment.completed",
  "data": {
    "payment": {
      "id": "pay_123456789",
      "walletId": "wallet_test_123",
      "status": "COMPLETED",
      "amount": 5000,
      "currency": "XAF",
      "createdAt": "2024-03-02T19:30:00Z"
    },
    "session": {
      "sessionToken": "PlIgutc6O4cNe9AeETyCgyf-nBn3WGD",
      "sessionId": "session_123456"
    }
  }
}`);

  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testWebhook = async (eventType: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      const payload = JSON.parse(testPayload);
      payload.eventType = eventType;

      // Simuler la signature Faroty (pour le test)
      const signature = `sha256=b64_${Math.random().toString(36).substring(2)}`;

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Faroty-Signature': signature,
          'X-Faroty-Webhook-ID': webhookId
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      setResult({
        status: response.status,
        success: response.ok,
        data: data,
        payload: payload,
        headers: {
          'Content-Type': 'application/json',
          'X-Faroty-Signature': signature,
          'X-Faroty-Webhook-ID': webhookId
        }
      });
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Webhook Faroty</h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Configuration Webhook</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Webhook
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="flex-1 p-2 border rounded-l-lg"
                      readOnly
                    />
                    <button
                      onClick={() => copyToClipboard(webhookUrl)}
                      className="px-3 py-2 bg-gray-100 border rounded-r-lg hover:bg-gray-200"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Webhook Secret
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={webhookSecret}
                      className="flex-1 p-2 border rounded-l-lg"
                      readOnly
                    />
                    <button
                      onClick={() => copyToClipboard(webhookSecret)}
                      className="px-3 py-2 bg-gray-100 border rounded-r-lg hover:bg-gray-200"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Webhook ID
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={webhookId}
                      className="flex-1 p-2 border rounded-l-lg"
                      readOnly
                    />
                    <button
                      onClick={() => copyToClipboard(webhookId)}
                      className="px-3 py-2 bg-gray-100 border rounded-r-lg hover:bg-gray-200"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Payload Test */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Payload de Test</h2>
              <textarea
                value={testPayload}
                onChange={(e) => setTestPayload(e.target.value)}
                className="w-full h-64 p-3 border rounded-lg font-mono text-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Actions de Test</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => testWebhook("payment.completed")}
                  disabled={isLoading}
                  className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {isLoading ? "Test..." : "Paiement Complété"}
                </button>

                <button
                  onClick={() => testWebhook("payment.failed")}
                  disabled={isLoading}
                  className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {isLoading ? "Test..." : "Paiement Échoué"}
                </button>

                <button
                  onClick={() => testWebhook("payment.cancelled")}
                  disabled={isLoading}
                  className="bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                >
                  {isLoading ? "Test..." : "Paiement Annulé"}
                </button>

                <button
                  onClick={() => testWebhook("payment.pending")}
                  disabled={isLoading}
                  className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? "Test..." : "Paiement En Attente"}
                </button>
              </div>
            </div>

            {/* Résultats */}
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
                  <div>
                    <h3 className="font-medium text-gray-700">Status HTTP:</h3>
                    <p className="text-sm text-gray-600">{result.status}</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700">Réponse Backend:</h3>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700">Payload Envoyé:</h3>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                      {JSON.stringify(result.payload, null, 2)}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700">Headers:</h3>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                      {JSON.stringify(result.headers, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Documentation */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Documentation Webhook</h3>
          
          <div className="space-y-4 text-blue-700">
            <div>
              <h4 className="font-medium">URL du Webhook:</h4>
              <code className="block bg-white p-2 rounded text-sm">
                {webhookUrl}
              </code>
            </div>

            <div>
              <h4 className="font-medium">Méthode:</h4>
              <p>POST</p>
            </div>

            <div>
              <h4 className="font-medium">Headers requis:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><code>X-Faroty-Signature</code>: Signature HMAC-SHA256 du payload</li>
                <li><code>X-Faroty-Webhook-ID</code>: ID du webhook</li>
                <li><code>Content-Type</code>: application/json</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium">Types d'événements:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><code>payment.completed</code> - Paiement réussi</li>
                <li><code>payment.failed</code> - Paiement échoué</li>
                <li><code>payment.cancelled</code> - Paiement annulé</li>
                <li><code>payment.pending</code> - Paiement en attente</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium">Flux de traitement:</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Vérification de la signature webhook</li>
                <li>Identification du type d'événement</li>
                <li>Mise à jour du statut de la commande</li>
                <li>Envoi de la réponse à Faroty</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
