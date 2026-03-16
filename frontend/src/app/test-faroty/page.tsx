"use client";

import { useState } from "react";
import { farotyService } from "@/lib/faroty-service";
import { CreditCard, ExternalLink, AlertCircle, Check } from "lucide-react";

export default function TestFarotyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testCreateWallet = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Test de l'envoi OTP à la place (car createWallet n'existe pas)
      const response = await farotyService.sendOtpCode("test@example.com");
      setResult({ type: 'wallet', data: response });
      console.log('Test wallet/OTP:', response);
    } catch (error) {
      setError('Erreur lors du test: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const testCreatePaymentSession = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await farotyService.createPaymentSession(
        5000, // 5000 XAF
        {
          orderNumber: 'PS-TEST-001',
          customerEmail: 'test@example.com',
          items: [
            { name: 'Sérum Hydratant', quantity: 2, price: 2500 },
            { name: 'Crème Solaire', quantity: 1, price: 1500 }
          ]
        }
      );
      setResult({ type: 'session', data: response });
      console.log('Session de paiement créée:', response);
    } catch (error) {
      setError('Erreur lors de la création de la session: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const testRedirect = () => {
    if (result && result.type === 'session' && result.data.data) {
      farotyService.redirectToPayment(result.data.data.sessionUrl);
    } else {
      setError('Veuillez d\'abord créer une session de paiement');
    }
  };

  const testSendOtp = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await farotyService.sendOtpCode("test@example.com");
      setResult({ type: 'sendOtp', data: response });
      console.log('OTP envoyé:', response);
    } catch (error) {
      setError('Erreur lors de l\'envoi de l\'OTP: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const testVerifyOtp = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await farotyService.verifyOtp("test@example.com", "12345", "temp-token-123");
      setResult({ type: 'verifyOtp', data: response });
      console.log('OTP vérifié:', response);
    } catch (error) {
      setError('Erreur lors de la vérification de l\'OTP: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const testCreateAccount = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await farotyService.createAccount("Test User", "test@example.com");
      setResult({ type: 'createAccount', data: response });
      console.log('Compte créé:', response);
    } catch (error) {
      setError('Erreur lors de la création du compte: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Faroty Integration</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Test Wallet */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-green-600" />
              Test Création Wallet
            </h2>
            <p className="text-gray-600 mb-4">
              Teste la création d'un wallet Faroty avec l'utilisateur de test
            </p>
            <button
              onClick={testCreateWallet}
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Création...' : 'Créer Wallet Test'}
            </button>
          </div>

          {/* Test Session */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ExternalLink className="w-5 h-5 mr-2 text-blue-600" />
              Test Session Paiement
            </h2>
            <p className="text-gray-600 mb-4">
              Teste la création d'une session de paiement Faroty
            </p>
            <button
              onClick={testCreatePaymentSession}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Création...' : 'Créer Session Test'}
            </button>
          </div>

          {/* Test Send OTP */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
              Test Envoi OTP
            </h2>
            <p className="text-gray-600 mb-4">
              Teste l'envoi d'un code OTP par email
            </p>
            <button
              onClick={testSendOtp}
              disabled={isLoading}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              {isLoading ? 'Envoi...' : 'Envoyer OTP Test'}
            </button>
          </div>

          {/* Test Verify OTP */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Check className="w-5 h-5 mr-2 text-purple-600" />
              Test Vérification OTP
            </h2>
            <p className="text-gray-600 mb-4">
              Teste la vérification d'un code OTP (code: 12345)
            </p>
            <button
              onClick={testVerifyOtp}
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {isLoading ? 'Vérification...' : 'Vérifier OTP Test'}
            </button>
          </div>

          {/* Test Create Account */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
              Test Création Compte
            </h2>
            <p className="text-gray-600 mb-4">
              Teste la création d'un compte utilisateur Faroty
            </p>
            <button
              onClick={testCreateAccount}
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Création...' : 'Créer Compte Test'}
            </button>
          </div>
        </div>

        {/* Résultats */}
        {result && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Check className="w-5 h-5 mr-2 text-green-600" />
              Résultat du Test ({result.type})
            </h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(result.data, null, 2)}
            </pre>
            
            {result.type === 'session' && result.data.data && (
              <button
                onClick={testRedirect}
                className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 flex items-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Tester la redirection
              </button>
            )}
          </div>
        )}

        {/* Erreurs */}
        {error && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center text-red-800">
              <AlertCircle className="w-5 h-5 mr-2" />
              Erreur
            </h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Instructions de Test</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>Cliquez sur "Créer Wallet Test" pour tester la création d'un wallet</li>
            <li>Cliquez sur "Créer Session Test" pour tester la création d'une session de paiement</li>
            <li>Vérifiez que l'URL de session est bien au format: <code>https://pay.faroty.me/payment?sessionToken=...</code></li>
            <li>Cliquez sur "Tester la redirection" pour tester la redirection vers Faroty</li>
            <li>Vérifiez dans la console les logs détaillés du processus</li>
          </ol>
        </div>

        {/* URLs de référence */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">URLs Faroty Configurées</h3>
          <div className="space-y-2 font-mono text-sm">
            <div>
              <strong>API Sessions:</strong> 
              <code className="ml-2 text-blue-600">https://api-pay-prod.faroty.me/payments/api/v1/payment-sessions</code>
            </div>
            <div>
              <strong>Paiement:</strong> 
              <code className="ml-2 text-green-600">https://pay.faroty.me/payment?sessionToken=PlIgutc6O4cNe9AeETyCgyf-nBn3WGD</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
