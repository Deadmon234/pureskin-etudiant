"use client";

import { useState } from "react";
import { Shield, ArrowRight, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export default function AdminWithdrawalPage() {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Veuillez entrer un montant valide");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Pour l'instant, simuler une réponse car les retraits nécessitent une intégration bancaire
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(`Demande de retrait de ${amount} XAF enregistrée avec succès! Un administrateur vous contactera.`);
      setAmount("");
    } catch (error) {
      console.error('Erreur lors du retrait:', error);
      setError('Erreur lors du retrait. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Retrait Admin
          </h1>
          <p className="text-gray-600">
            Effectuez une demande de retrait depuis votre compte
          </p>
        </div>

        {/* Messages d'erreur et de succès */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-green-800 text-sm">{success}</span>
          </div>
        )}

        {/* Formulaire de retrait */}
        <div className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Montant à retirer (XAF)
            </label>
            <div className="relative">
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Entrez le montant"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 text-sm">XAF</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleWithdraw}
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              <>
                <ArrowRight className="w-5 h-5" />
                Effectuer le retrait
              </>
            )}
          </button>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Note:</strong> Les demandes de retrait sont traitées manuellement par l'administrateur système. 
            Vous serez contacté dans les 24-48 heures pour finaliser la transaction.
          </div>
        </div>
      </div>
    </div>
  );
}
