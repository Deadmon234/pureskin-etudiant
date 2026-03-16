"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CreditCard, Shield, ArrowRight, ArrowLeft, Check, Loader2, User, Truck, AlertCircle } from "lucide-react";
import Link from "next/link";
import { farotyAuthService, FarotyUser } from "@/lib/farotyAuthService";
import { farotyService } from "@/lib/farotyService";
import { CartItem, cartService } from "@/lib/cart";
import { paymentIntegrationService } from "@/lib/paymentIntegrationService";
import { productService } from "@/lib/productService";

export default function PaymentCheckoutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<FarotyUser | null>(null);
  const [orderId, setOrderId] = useState<string>('');
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [orderData, setOrderData] = useState<{
    orderNumber: string;
    totalAmount: number;
    items: CartItem[];
    customerEmail: string;
    subtotal?: number;
    shippingCost?: number;
    taxAmount?: number;
  } | null>(null);
  const [existingSessionToken, setExistingSessionToken] = useState<string | null>(null);

  // Get cart items from order data
  const cartItems: CartItem[] = orderData?.items || [];

  useEffect(() => {
    const initializePayment = async () => {
      // Vérifier si l'utilisateur est authentifié avec Faroty
      if (!farotyAuthService.isAuthenticated()) {
        router.push('/auth/user-payment');
        return;
      }

      try {
        // Récupérer les infos utilisateur complètes depuis le service d'authentification Faroty
        const userInfo = farotyAuthService.getUserInfo();
        
        if (userInfo) {
          setUserInfo(userInfo);
          console.log('✅ Informations utilisateur récupérées:', userInfo);
        } else {
          // Fallback: récupérer depuis localStorage si le service échoue
          const user = {
            id: localStorage.getItem('faroty_user_id') || '',
            fullName: localStorage.getItem('faroty_user_name') || '',
            email: localStorage.getItem('faroty_user_email') || '',
            phoneNumber: localStorage.getItem('faroty_user_phone') || '',
            accountStatus: localStorage.getItem('faroty_user_accountStatus') || undefined
          };
          setUserInfo(user);
          console.log('⚠️ Utilisation fallback localStorage pour utilisateur:', user);
        }
        
        const savedOrderId = localStorage.getItem('pending_order_id');
        const savedSessionToken = localStorage.getItem('payment_session_token');
        
        if (savedOrderId) {
          setOrderId(savedOrderId);
          
          // Vérifier s'il existe déjà une session de paiement
          if (savedSessionToken) {
            setExistingSessionToken(savedSessionToken);
            console.log('🔄 Session de paiement existante trouvée:', savedSessionToken);
          }
          
          // Récupérer les détails de la commande
          await fetchOrderDetails(savedOrderId);
        } else {
          // Créer une commande depuis le panier si aucune n'existe
          await createOrderFromCart();
        }
      } catch (error) {
        console.error('Erreur récupération informations:', error);
        setError('Erreur lors de la récupération de vos informations. Veuillez vous reconnecter.');
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
        return;
      }
      
      setIsLoading(false);
    };

    initializePayment();
  }, [router]);

  const fetchOrderDetails = async (orderId: string) => {
    console.log('📦 Récupération détails commande pour ID:', orderId);
    try {
      // Essayer l'API backend d'abord
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Détails commande reçus du backend:', data);
        if (data.success && data.data) {
          setOrderData(data.data);
          console.log('📋 OrderData mis à jour:', data.data);
          return;
        }
      } else {
        console.warn('⚠️ Backend non disponible, essai fallback:', response.status);
      }
    } catch (error) {
      console.warn('⚠️ Erreur backend, utilisation fallback:', error);
    }
    
    // Fallback: créer des données de commande depuis cartService
    try {
      // Utiliser cartService pour récupérer les articles avec les bons prix
      const cartState = cartService.getCart();
      const cartItems = cartState.items;
      
      // Vérifier et corriger les prix si nécessaire
      const validCartItems = cartItems.map(item => {
        if (!item.price || item.price <= 0) {
          console.warn(`⚠️ Prix invalide pour ${item.name}: ${item.price}, assignation prix par défaut`);
          return { ...item, price: 1000 }; // Prix par défaut
        }
        return item;
      });
      
      const totalAmount = validCartItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
      
      const fallbackOrderData = {
        orderNumber: orderId,
        totalAmount: totalAmount,
        items: validCartItems,
        customerEmail: userInfo?.email || '',
        subtotal: totalAmount,
        shippingCost: 0,
        taxAmount: 0,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      setOrderData(fallbackOrderData);
      console.log('🔄 OrderData créé depuis cartService:', fallbackOrderData);
      
    } catch (fallbackError) {
      console.error('❌ Erreur fallback commande:', fallbackError);
      setError('Impossible de récupérer les détails de votre commande. Veuillez réessayer.');
    }
  };

  const createOrderFromCart = async () => {
    console.log('🛒 Création commande depuis le panier');
    try {
      // Étape 1: Mettre à jour les prix depuis le backend
      await productService.updateCartPrices();
      
      // Étape 2: Utiliser cartService pour récupérer les articles avec les prix mis à jour
      const cartState = cartService.getCart();
      const cartItems = cartState.items;
      
      console.log('📦 CartItems from cartService après mise à jour:', cartItems);
      
      if (cartItems.length === 0) {
        setError('Votre panier est vide. Veuillez ajouter des produits avant de continuer.');
        return;
      }

      // Vérifier et corriger les prix si nécessaire (dernière sécurité)
      const validCartItems = cartItems.map(item => {
        if (!item.price || item.price <= 0) {
          console.warn(`⚠️ Prix invalide pour ${item.name}: ${item.price}, assignation prix par défaut`);
          return { ...item, price: 1000 }; // Prix par défaut
        }
        return item;
      });

      console.log('📦 CartItems après validation finale des prix:', validCartItems);

      const totalAmount = validCartItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
      const orderId = 'order-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      
      const orderData = {
        orderNumber: orderId,
        totalAmount: totalAmount,
        items: validCartItems,
        customerEmail: userInfo?.email || '',
        subtotal: totalAmount,
        shippingCost: 0,
        taxAmount: 0,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Essayer de créer la commande dans le backend
      try {
        const response = await fetch('http://localhost:8080/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderNumber: orderData.orderNumber,
            totalAmount: orderData.totalAmount,
            items: orderData.items,
            customerInfo: {
              email: userInfo?.email || orderData.customerEmail,
              firstName: userInfo?.fullName?.split(' ')[0] || 'Client',
              lastName: userInfo?.fullName?.split(' ').slice(1).join(' ') || '',
              phone: userInfo?.phoneNumber || '',
              address: 'Adresse par défaut',
              city: 'Ville par défaut',
              postalCode: '00000',
              country: 'Cameroun'
            },
            shippingAddress: {
              street: 'Adresse par défaut',
              city: 'Ville par défaut',
              postalCode: '00000',
              country: 'Cameroun'
            },
            billingAddress: {
              street: 'Adresse par défaut',
              city: 'Ville par défaut',
              postalCode: '00000',
              country: 'Cameroun'
            },
            subtotal: orderData.subtotal,
            shippingCost: orderData.shippingCost,
            taxAmount: orderData.taxAmount,
            notes: 'Commande créée via PureSkin'
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // Utiliser l'ID numérique retourné par le backend
            const backendOrderId = data.data.orderId;
            setOrderId(backendOrderId.toString());
            localStorage.setItem('pending_order_id', backendOrderId.toString());
            setOrderData({
              ...orderData,
              orderNumber: data.data.orderNumber
            });
            console.log('✅ Commande créée dans le backend:', data.data);
            return;
          }
        } else {
          console.warn('⚠️ Backend response non OK:', response.status);
        }
      } catch (backendError) {
        console.warn('⚠️ Backend non disponible, création locale:', backendError);
      }

      // Fallback: créer la commande localement
      setOrderId(orderId);
      localStorage.setItem('pending_order_id', orderId);
      setOrderData(orderData);
      console.log('🔄 Commande créée localement:', orderData);

    } catch (error) {
      console.error('❌ Erreur création commande:', error);
      setError('Erreur lors de la création de votre commande. Veuillez réessayer.');
    }
  };

  const handleCreatePaymentSession = async () => {
    if (!orderData || !userInfo) return;

    // Vérifier si une session existe déjà
    if (existingSessionToken) {
      const shouldContinue = window.confirm(
        'Une session de paiement existe déjà. Voulez-vous créer une nouvelle session ?'
      );
      if (!shouldContinue) {
        // Rediriger vers la session existante
        const existingUrl = localStorage.getItem('payment_session_url');
        if (existingUrl) {
          window.location.href = existingUrl;
        }
        return;
      }
    }

    setIsCreatingSession(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('🚀 Démarrage du processus de paiement avec enregistrement...');
      console.log('📦 Données commande:', orderData);
      console.log('👤 Utilisateur:', userInfo);

      // Étape 1: Créer l'enregistrement de paiement dans la base du projet
      console.log('🔍 Debug - userInfo complet:', userInfo);
      console.log('🔍 Debug - userInfo.email:', userInfo.email);
      console.log('🔍 Debug - userInfo.fullName:', userInfo.fullName);
      
      const customerInfo = {
        name: userInfo.fullName || userInfo.email?.split('@')[0] || 'Client',
        email: userInfo.email || orderData.customerEmail,
        phone: userInfo.phoneNumber || undefined
      };
      
      console.log('🔍 Debug - customerInfo final:', customerInfo);

      const paymentIntegrationResult = await paymentIntegrationService.createPrePayment(
        customerInfo,
        orderData.items,
        'faroty_wallet' // Méthode par défaut
      );

      if (!paymentIntegrationResult.success) {
        throw new Error('Failed to create payment record');
      }

      console.log('✅ Paiement enregistré dans la base du projet:', paymentIntegrationResult);

      // Étape 2: Processus complet de paiement avec Faroty
      const fullPaymentResult = await paymentIntegrationService.processFullPayment(
        customerInfo,
        orderData.items,
        'faroty_wallet', // Utiliser faroty_wallet comme méthode
        localStorage.getItem('faroty_access_token') || undefined
      );

      if (!fullPaymentResult.success) {
        throw new Error('Failed to process payment');
      }

      console.log('✅ Processus de paiement complet:', fullPaymentResult);

      // Étape 3: Redirection vers la page de paiement Faroty
      if (fullPaymentResult.farotySessionUrl) {
        window.location.href = fullPaymentResult.farotySessionUrl;
      } else {
        throw new Error('Payment session URL not received');
      }

    } catch (error) {
      console.error('❌ Erreur lors du processus de paiement:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la création de la session de paiement');
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleCartClick = () => {
    // Redirect back to checkout page when cart is clicked
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onCartClick={handleCartClick} />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCartClick={handleCartClick} />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2">
            {/* En-tête */}
            <div className="mb-6">
              <Link
                href="/checkout"
                className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour à la finalisation
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Finalisation du Paiement
              </h1>
              <p className="text-gray-600">
                Complétez les informations pour finaliser votre commande avec Faroty
              </p>
            </div>

            {/* Informations utilisateur */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <User className="w-5 h-5 text-green-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Informations du Compte
                </h2>
              </div>
              
              <div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-green-600" />
                  </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{userInfo?.fullName || 'Utilisateur'}</p>
                  <p className="text-xs text-gray-500">{userInfo?.email || 'Non spécifié'}</p>
                                  </div>
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
                
                {/* Indicateur de session existante */}
                {existingSessionToken && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Une session de paiement existe déjà. Vous pouvez la réutiliser ou en créer une nouvelle.
                    </p>
                  </div>
                )}
                
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
                      {existingSessionToken ? 'Recréer la session de paiement' : 'Payer avec Faroty'}
                    </>
                  )}
                </button>
                
                {/* Bouton de redirection manuelle si session existe */}
                {existingSessionToken && (
                  <button
                    onClick={() => {
                      const existingUrl = localStorage.getItem('payment_session_url');
                      if (existingUrl) {
                        console.log('🔗 Redirection vers session existante:', existingUrl);
                        window.location.href = existingUrl;
                      } else {
                        setError('URL de session non trouvée. Veuillez recréer la session.');
                      }
                    }}
                    className="w-full mt-3 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Continuer la session existante
                  </button>
                )}
                
                <div className="mt-4 text-sm text-gray-500">
                  <p>💡 Paiement 100% sécurisé via Faroty</p>
                  <p>🔒 Wallet prédéfini : 9c3cdf3b-ff0b-44d9-8aa0-4e638c88f660</p>
                  {existingSessionToken && (
                    <p>🔄 Session existante : {existingSessionToken.slice(0, 12)}...</p>
                  )}
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
          </div>

          {/* Colonne latérale - Récapitulatif commande */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Truck className="w-5 h-5 text-blue-600 mr-2" />
                Récapitulatif Commande
              </h3>
              
              {orderData ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commande #{orderData.orderNumber}</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Articles ({cartItems.length})</h4>
                    <div className="space-y-2">
                      {cartItems.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-semibold text-gray-600">
                            {(item.price * item.quantity).toLocaleString()} XAF
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sous-total:</span>
                      <span className="font-semibold text-gray-600">
                        {orderData.subtotal?.toLocaleString() || orderData.totalAmount.toLocaleString()} XAF
                      </span>
                    </div>
                    {orderData.shippingCost && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Livraison:</span>
                        <span className="font-semibold text-gray-600">
                          {orderData.shippingCost.toLocaleString()} XAF
                        </span>
                      </div>
                    )}
                    {orderData.taxAmount && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxes:</span>
                        <span className="font-semibold text-gray-600">
                          {orderData.taxAmount.toLocaleString()} XAF
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                      <span>Total:</span>
                      <span>{orderData.totalAmount.toLocaleString()} XAF</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Chargement des détails de la commande...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
