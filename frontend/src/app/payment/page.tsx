"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CreditCard, Shield, ArrowRight, ArrowLeft, Check, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { farotyService, FarotyUser } from "@/lib/faroty-service";
import { cartService, CartItem } from "@/lib/cart";

export default function PaymentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<FarotyUser | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  useEffect(() => {
    const initializePayment = async () => {
      // Vérifier si l'utilisateur est authentifié avec Faroty
      const farotyAccessToken = localStorage.getItem('faroty_access_token');
      const farotyUserStr = localStorage.getItem('faroty_user');
      
      if (!farotyAccessToken || !farotyUserStr) {
        router.push('/auth');
        return;
      }

      try {
        const user = JSON.parse(farotyUserStr);
        setUserInfo(user);
        
        // Charger le panier
        const cart = cartService.getCart();
        setCartItems(cart.items);
        setTotal(cart.total);
        
        // Charger les informations de paiement si elles existent
        const currentPaymentInfo = farotyService.getPaymentInfo();
        if (currentPaymentInfo) {
          // Mettre à jour automatiquement la session URL si nécessaire
          const urlUpdated = farotyService.updateSessionUrlIfNeeded();
          if (urlUpdated) {
            console.log('✅ Session URL mise à jour automatiquement au chargement');
          }
          
          setPaymentInfo(currentPaymentInfo);
          console.log('📋 Informations de paiement chargées:', currentPaymentInfo);
        }
      } catch (error) {
        console.error('Erreur parsing utilisateur Faroty:', error);
        router.push('/auth');
        return;
      }
      
      setIsLoading(false);
    };

    initializePayment();
  }, [router]);

  const handleCreatePaymentSession = async () => {
    if (cartItems.length === 0 || !userInfo) return;

    setIsCreatingSession(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('🚀 Démarrage du processus de paiement simplifié...');
      console.log('📦 Panier:', cartItems);
      console.log('👤 Utilisateur:', userInfo);

      // Préparer les données de commande
      const orderData = {
        orderNumber: `CMD-${Date.now()}`,
        customerEmail: userInfo.email,
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };

      // Utiliser la méthode simplifiée qui gère tout le flux
      await farotyService.processPayment(total, orderData);

      // Cette ligne ne sera jamais atteinte car la redirection se fait dans processPayment
      setSuccess('Redirection vers la page de paiement...');

    } catch (error) {
      console.error('❌ Erreur lors du processus de paiement:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la création de la session de paiement');
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleCartClick = () => {
    router.push('/panier');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header onCartClick={handleCartClick} />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">Chargement des informations de paiement...</p>
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link 
              href="/panier"
              className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour au panier
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Finalisation du Paiement
            </h1>
            <p className="text-gray-600">
              Complétez les informations pour finaliser votre commande avec Faroty
            </p>
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif de la commande</h2>
              <div className="space-y-2 mb-4">
                {cartItems.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex justify-between font-semibold text-blue-600 text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{(item.price * item.quantity).toFixed(2)} €</span>
                  </div>
                ))}
                {cartItems.length > 3 && (
                  <div className="text-sm text-gray-600">
                    +{cartItems.length - 3} autre(s) article(s)
                  </div>
                )}
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-gray-600 font-semibold">
                  <span>Total (EUR)</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 font-semibold mt-1">
                  <span>Total (XAF)</span>
                  <span>{Math.round(total * 655.95)} XAF</span>
                </div>
              </div>
            </div>
          )}

          {/* User Info */}
          {userInfo && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-medium">
                    {userInfo.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{userInfo.fullName}</h3>
                  <p className="text-sm text-gray-600">{userInfo.email}</p>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">ID Utilisateur:</span>
                <span className="font-medium text-sm text-gray-600">{userInfo?.id}</span>
              </div>
                
              {/* Informations supplémentaires de l'API Faroty */}
              {userInfo?.accountStatus && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut du compte:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    userInfo.accountStatus === 'EMAIL_VERIFIED' ? 'bg-green-100 text-green-800' :
                    userInfo.accountStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {userInfo.accountStatus}
                  </span>
                </div>
              )}
                
              {userInfo?.phoneNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Téléphone:</span>
                  <span className="font-medium text-gray-600">{userInfo.phoneNumber}</span>
                </div>
              )}
                
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Vérifications</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <span className="text-xs text-gray-500 block">Email</span>
                    <span className={`text-sm font-medium ${
                      userInfo?.emailVerified ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {userInfo?.emailVerified ? '✓ Vérifié' : 'Non vérifié'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Téléphone</span>
                    <span className={`text-sm font-medium ${
                      userInfo?.phoneVerified ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {userInfo?.phoneVerified ? '✓ Vérifié' : 'Non vérifié'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">KYC</span>
                    <span className={`text-sm font-medium ${
                      userInfo?.kycVerified ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {userInfo?.kycVerified ? '✓ Vérifié' : 'Non vérifié'}
                    </span>
                  </div>
                </div>
              </div>
                
              {userInfo?.lastLogin && (
                <div className="pt-3 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dernière connexion:</span>
                    <span className="text-xs text-gray-600">
                      {new Date(userInfo.lastLogin * 1000).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bouton de paiement Faroty - Affiché directement après authentification */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <CreditCard className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">
                Paiement Sécurisé avec Faroty
              </h2>
            </div>
            
            <div className="text-center py-4">
              <p className="text-gray-600 mb-6">
                Cliquez sur le bouton ci-dessous pour créer votre session de paiement et être redirigé vers la page de paiement sécurisée Faroty.
              </p>
              
              <button
                onClick={handleCreatePaymentSession}
                disabled={isCreatingSession}
                className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg font-semibold"
              >
                {isCreatingSession ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Création de la session de paiement...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-6 h-6 mr-3" />
                    Payer avec Faroty
                  </>
                )}
              </button>
              
              <div className="mt-4 text-sm text-gray-500">
                <p>💡 Paiement 100% sécurisé via Faroty</p>
                <p>🔒 Wallet prédéfini : 9c3cdf3b-ff0b-44d9-8aa0-4e638c88f660</p>
              </div>
            </div>

            {error && (
              <div className="mt-4 flex items-center text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 flex items-center text-green-600 text-sm">
                <Check className="w-4 h-4 mr-2" />
                {success}
              </div>
            )}
          </div>

          {/* Informations de paiement actuelles */}
          {paymentInfo && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                Session de Paiement Active
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Statut:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    paymentInfo.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    paymentInfo.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {paymentInfo.status}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Session Token:</span>
                  <span className="font-mono text-xs text-gray-600">{paymentInfo.sessionToken.substring(0, 12)}...</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant:</span>
                  <span className="font-medium text-gray-600">{paymentInfo.amount} {paymentInfo.currency}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Commande:</span>
                  <span className="font-medium text-gray-600">{paymentInfo.orderData.orderNumber}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Créée le:</span>
                  <span className="text-xs text-gray-600">{new Date(paymentInfo.createdAt).toLocaleString()}</span>
                </div>
                
                <div className="pt-3 border-t">
                  <button
                    onClick={() => window.open(paymentInfo.paymentUrl, '_blank')}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Ouvrir la page de paiement
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Info */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Paiement sécurisé via Faroty</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
