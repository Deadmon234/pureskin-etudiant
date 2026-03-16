"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminPaymentAuth } from "@/hooks/useAdminPaymentAuth";
import { farotyAuthService } from "@/lib/farotyAuthService";
import { 
  CreditCard, 
  Wallet, 
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Banknote,
  RefreshCw
} from "lucide-react";

export default function PaymentMethodsPage() {
  const router = useRouter();
  const { accessToken, email, isAuthenticated, isLoading, logout } = useAdminPaymentAuth();
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      // Rediriger vers la page d'authentification Faroty
      router.push('/admin/paiement/auth');
      return;
    }
    
    if (isAuthenticated && accessToken) {
      fetchPaymentMethods();
    }
  }, [isAuthenticated, accessToken, isLoading]);

  const fetchPaymentMethods = async () => {
    try {
      setIsLoadingData(true);
      setError(null);
      
      // Récupérer les méthodes de paiement depuis l'API Faroty avec accessToken
      const methods = await farotyAuthService.getPaymentMethods();
      setPaymentMethods(methods);
      
      console.log('✅ Méthodes de paiement chargées depuis Faroty API:', methods);
      setSuccess(`Méthodes de paiement récupérées avec succès (${methods.length} méthodes)`);
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des méthodes de paiement:', error);
      
      // Vérifier si c'est une erreur d'authentification
      if (error instanceof Error && (error.message.includes('401') || error.message.includes('403'))) {
        setError('Token Faroty expiré. Veuillez vous réauthentifier.');
      } else {
        setError('Erreur lors de la récupération des méthodes de paiement. Veuillez réessayer.');
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  const getMethodIcon = (technicalName: string) => {
    switch(technicalName) {
      case 'stripe': case 'card': return <CreditCard className="h-8 w-8" />;
      case 'orange_money_cm': case 'mtn_mobile_money_cm': return <Smartphone className="h-8 w-8" />;
      case 'bank_transfer': return <Banknote className="h-8 w-8" />;
      default: return <Wallet className="h-8 w-8" />;
    }
  };

  const getMethodColor = (technicalName: string) => {
    switch(technicalName) {
      case 'stripe': case 'card': return 'text-blue-600 bg-blue-50';
      case 'orange_money_cm': return 'text-orange-600 bg-orange-50';
      case 'mtn_mobile_money_cm': return 'text-yellow-600 bg-yellow-50';
      case 'bank_transfer': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getMethodText = (technicalName: string) => {
    switch(technicalName) {
      case 'stripe': return 'Carte bancaire';
      case 'orange_money_cm': return 'Orange Money';
      case 'mtn_mobile_money_cm': return 'MTN Mobile Money';
      case 'bank_transfer': return 'Virement bancaire';
      default: return technicalName;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de l'authentification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </button>
              <h1 className="text-xl font-bold text-gray-900">
                Méthodes de Paiement Faroty
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Connecté en tant que: <span className="font-medium">{email}</span>
              </div>
              <button
                onClick={logout}
                className="text-red-600 hover:text-red-700"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 text-sm">{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        )}

        {/* Bouton de rafraîchissement */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Méthodes de paiement disponibles
          </h2>
          <button
            onClick={fetchPaymentMethods}
            disabled={isLoadingData}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingData ? 'animate-spin' : ''}`} />
            Rafraîchir
          </button>
        </div>

        {/* Liste des méthodes de paiement */}
        {isLoadingData ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Chargement des méthodes de paiement...</p>
          </div>
        ) : paymentMethods.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <CreditCard className="h-16 w-16 mx-auto" />
            </div>
            <p className="text-gray-500 text-lg">Aucune méthode de paiement trouvée</p>
            <p className="text-gray-400 text-sm mt-2">
              Vérifiez votre connexion ou réessayez plus tard
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentMethods.map((method) => (
              <div key={method.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${getMethodColor(method.technicalName)}`}>
                    {getMethodIcon(method.technicalName)}
                  </div>
                  {method.active ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Actif
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                      Inactif
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {method.name}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium">{getMethodText(method.technicalName)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Frais de dépôt:</span>
                    <span className="font-medium">
                      {method.depositFeeRate ? `${(method.depositFeeRate * 100).toFixed(2)}%` : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Frais de retrait:</span>
                    <span className="font-medium">
                      {method.withdrawalFeeRate ? `${(method.withdrawalFeeRate * 100).toFixed(2)}%` : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Max transaction:</span>
                    <span className="font-medium">
                      {method.maxTransactionAmount ? `${method.maxTransactionAmount.toLocaleString()} XAF` : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Transactions:</span>
                    <span className="font-medium">{method.transactionsCount || 0}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Multi-devise:</span>
                    <span className="font-medium">
                      {method.supportsMultiCurrency ? 'Oui' : 'Non'}
                    </span>
                  </div>
                </div>
                
                {method.logoUrl && (
                  <div className="mt-4 pt-4 border-t">
                    <img 
                      src={method.logoUrl} 
                      alt={method.name}
                      className="h-8 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Informations supplémentaires */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            ℹ️ Informations sur les méthodes de paiement
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">🔐 Sécurité</h4>
              <p>Toutes les transactions sont sécurisées et chiffrées via l'API Faroty.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">💰 Frais</h4>
              <p>Les frais de transaction varient selon la méthode de paiement choisie.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">⏱️ Temps de traitement</h4>
              <p>Les temps de traitement varient de quelques minutes à 24 heures selon la méthode.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">🌍 Support</h4>
              <p>Support multidevise disponible pour certaines méthodes de paiement.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
