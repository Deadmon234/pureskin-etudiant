"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, Lock, ArrowLeft, Check, Shield, User, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { farotyService, FarotyUser } from "@/lib/faroty-service";

export default function AuthCheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otpData, setOtpData] = useState({
    otp1: "",
    otp2: "",
    otp3: "",
    otp4: "",
    otp5: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const [user, setUser] = useState<FarotyUser | null>(null);
  const [tempToken, setTempToken] = useState<string | null>(null);

  const handleCartClick = () => {
    // Redirect to cart page when cart is clicked
    router.push('/cart');
  };

  useEffect(() => {
    // Récupérer l'email et l'ID de commande depuis le localStorage
    const savedEmail = localStorage.getItem('customer_email');
    const savedOrderId = localStorage.getItem('pending_order_id');
    
    if (savedEmail) {
      setEmail(savedEmail);
      setCustomerEmail(savedEmail);
    }
    
    if (savedOrderId) {
      setOrderId(savedOrderId);
    }
    
    // Si pas de commande en attente, rediriger vers le panier
    if (!savedOrderId) {
      router.push('/cart');
    }
  }, [router]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Veuillez saisir votre email');
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Veuillez saisir un email valide');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await farotyService.sendOtpCode(email);
      
      if (response.success && response.data) {
        setSuccess('Code de vérification envoyé à votre email');
        setStep('otp');
        setTempToken(response.data.tempToken);
        localStorage.setItem('customer_email', email);
      } else {
        setError(response.message || "Échec de l'envoi du code OTP");
      }
    } catch (error) {
      setError('Erreur de connexion au service Faroty');
      console.error('Erreur OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    // N'accepter que les chiffres
    if (value && !/^\d$/.test(value)) return;
    
    setOtpData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Passer au champ suivant automatiquement
    if (value && field !== "otp5") {
      const nextField = "otp" + (parseInt(field.slice(3)) + 1);
      const nextInput = document.getElementById(nextField) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: string) => {
    // Revenir au champ précédent avec Backspace
    if (e.key === "Backspace" && !otpData[field as keyof typeof otpData] && field !== "otp1") {
      const prevField = "otp" + (parseInt(field.slice(3)) - 1);
      const prevInput = document.getElementById(prevField) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpCode = otpData.otp1 + otpData.otp2 + otpData.otp3 + otpData.otp4 + otpData.otp5;
    
    if (!otpCode || otpCode.length !== 5) {
      setError('Veuillez saisir le code de vérification à 5 chiffres');
      return;
    }

    if (!tempToken) {
      setError('Session expirée. Veuillez demander un nouveau code.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await farotyService.verifyOtp(email, otpCode, tempToken);
      
      if (response.success && response.data) {
        // Utiliser les informations utilisateur directement depuis la réponse OTP
        const userData = response.data;
        const accessToken = (userData as any).accessToken;
        
        // Sauvegarder l'accessToken
        if (accessToken) {
          farotyService.setAccessToken(accessToken);
        }
        
        // Récupérer les informations utilisateur complètes depuis l'API Faroty
        try {
          console.log('🔍 Récupération informations utilisateur complètes...');
          const userInfoResponse = await farotyService.getUserInfo();
          
          if (userInfoResponse.success && userInfoResponse.data) {
            const completeUserInfo = userInfoResponse.data;
            console.log('✅ Informations utilisateur complètes:', completeUserInfo);
            
            setUser(completeUserInfo);
            localStorage.setItem('faroty_user', JSON.stringify(completeUserInfo));
            setSuccess('Authentification réussie ! Redirection vers le paiement...');
            
            // Rediriger vers la page de paiement après 2 secondes
            setTimeout(() => {
              router.push('/payment-checkout');
            }, 2000);
          } else {
            // Si la récupération des infos complètes échoue, utiliser les données de base
            console.warn('⚠️ Utilisation des informations utilisateur de base');
            setUser(userData);
            localStorage.setItem('faroty_user', JSON.stringify(userData));
            setSuccess('Authentification réussie ! Redirection vers le paiement...');
            
            setTimeout(() => {
              router.push('/payment-checkout');
            }, 2000);
          }
        } catch (userInfoError) {
          console.error('❌ Erreur récupération infos utilisateur:', userInfoError);
          // Utiliser les données de base en cas d'erreur
          setUser(userData);
          localStorage.setItem('faroty_user', JSON.stringify(userData));
          setSuccess('Authentification réussie ! Redirection vers le paiement...');
          
          setTimeout(() => {
            router.push('/payment-checkout');
          }, 2000);
        }
        } else {
          setError(response.message || "Code OTP invalide");
        }
    } catch (error) {
      setError('Erreur de vérification du code OTP');
      console.error('Erreur vérification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCartClick={handleCartClick} />
      
      <main className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {step === 'email' ? 'Authentification Faroty' : 'Vérification du Code'}
            </h1>
            <p className="text-gray-600">
              {step === 'email' 
                ? 'Entrez votre email pour recevoir un code de vérification'
                : 'Entrez le code à 5 chiffres reçu par email'
              }
            </p>
          </div>

          {/* Formulaire Email */}
          {step === 'email' && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-gray-600 pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-300"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}

              {success && (
                <div className="flex items-center text-green-600 text-sm">
                  <Check className="w-4 h-4 mr-2" />
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Envoyer le code OTP
                    <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Formulaire OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* Code OTP - 5 champs séparés */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code OTP *
                </label>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      id={`otp${index}`}
                      type="text"
                      maxLength={1}
                      required
                      value={otpData[`otp${index}` as keyof typeof otpData]}
                      onChange={(e) => handleOtpChange(e, `otp${index}`)}
                      onKeyDown={(e) => handleOtpKeyDown(e, `otp${index}`)}
                      className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Code envoyé à : {email}
                </p>
              </div>

              {error && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}

              {success && (
                <div className="flex items-center text-green-600 text-sm">
                  <Check className="w-4 h-4 mr-2" />
                  {success}
                </div>
              )}

              {user && (
                <div className="flex items-center text-green-600 text-sm">
                  <Check className="w-4 h-4 mr-2" />
                  Authentification réussie ! Redirection...
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || user !== null}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Vérification...
                  </>
                ) : user !== null ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Authentifié
                  </>
                ) : (
                  <>
                    Vérifier le code
                    <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors"
              >
                Modifier l'email
              </button>
            </form>
          )}

          {/* Lien inscription */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Vous n'avez pas de compte ?{" "}
              <Link href="/register" className="font-medium text-green-600 hover:text-green-500">
                Créer un compte
              </Link>
            </p>
          </div>

          {/* Informations de sécurité */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Sécurité garantie</p>
                <ul className="space-y-1">
                  <li>• Code OTP à usage unique (5 chiffres)</li>
                  <li>• Validité de 10 minutes</li>
                  <li>• Chiffrement bout-en-bout</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
