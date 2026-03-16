"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, Lock, ArrowLeft, Check, Shield, User } from "lucide-react";
import Link from "next/link";
import { FarotyAuthService } from "@/lib/auth";
import { cartService, CartItem } from "@/lib/cart";

export default function AuthPage() {
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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  // Charger les données du panier
  useState(() => {
    const cart = cartService.getCart();
    setCartItems(cart.items);
    setTotal(cart.total);
  });

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
      const response = await FarotyAuthService.sendOtp(email);
      
      if (response.success) {
        setSuccess('Code de vérification envoyé à votre email');
        setStep('otp');
      } else {
        setError(response.message || 'Erreur lors de l\'envoi du code');
      }
    } catch (error: any) {
      console.error('Erreur OTP:', error);
      setError(error.message || 'Erreur lors de l\'envoi du code');
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

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await FarotyAuthService.verifyOtp(otpCode);
      
      if (response.success) {
        setSuccess('Authentification réussie ! Redirection...');
        
        // Rediriger vers la page de paiement après 2 secondes
        setTimeout(() => {
          router.push('/payment');
        }, 2000);
      } else {
        setError(response.message || 'Code invalide');
      }
    } catch (error: any) {
      console.error('Erreur vérification OTP:', error);
      setError(error.message || 'Code invalide');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtpData({
      otp1: "",
      otp2: "",
      otp3: "",
      otp4: "",
      otp5: ""
    });
    setError(null);
    setSuccess(null);
  };

  const handleCartClick = () => {
    router.push('/panier');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={handleCartClick} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
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
              {step === 'email' ? 'Connexion sécurisée' : 'Vérification du code'}
            </h1>
            <p className="text-gray-600">
              {step === 'email' 
                ? 'Connectez-vous pour finaliser votre commande'
                : 'Entrez le code reçu par email'
              }
            </p>
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif de la commande</h2>
              <div className="space-y-2 mb-4 font-semibold text-gray-500">
                {cartItems.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
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
                <div className="flex justify-between font-semibold text-gray-600">
                  <span>Total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          )}

          {/* Auth Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            {step === 'email' ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 text-gray-600 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Security Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">Connexion sécurisée</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Nous allons vous envoyer un code de vérification à 6 chiffres par email.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:bg-gray-300 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      Envoyer le code de vérification
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* Code OTP - 5 champs séparés */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code de vérification
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
                        className="w-12 h-12 text-center text-gray-600 text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Entrez le code à 5 chiffres envoyé à {email}
                  </p>
                </div>

                {/* Back Button */}
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  ← Changer d'adresse email
                </button>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:bg-gray-300 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Vérification...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Vérifier le code
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Success Message */}
            {success && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <p className="text-green-800">{success}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </div>

          {/* Lien inscription */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Vous n'avez pas de compte ?{" "}
              <Link href="/register" className="font-medium text-green-600 hover:text-green-500">
                Créer un compte
              </Link>
            </p>
          </div>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Besoin d'aide ? Contactez notre support client
            </p>
            <div className="flex justify-center space-x-4">
              <a href="mailto:support@pureskin.fr" className="text-green-600 hover:text-green-700">
                support@pureskin.fr
              </a>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">01 23 45 67 89</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
