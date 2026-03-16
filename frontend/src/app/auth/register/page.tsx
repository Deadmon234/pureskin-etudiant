"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock, CheckCircle, User } from "lucide-react";
import { farotyService } from "@/lib/faroty-service";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<'register' | 'otp'>('register');
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Utiliser le flux d'authentification complet pour créer un compte
      const response = await farotyService.authenticateOrRegister(fullName, email);
      
      if (response.success && response.data?.tempToken) {
        setTempToken(response.data.tempToken);
        setStep('otp');
        setSuccess("Code de vérification à 5 chiffres envoyé à votre email pour valider votre inscription");
        setShowOtp(true);
      } else {
        setError(response.message || "Erreur lors de la création du compte");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Valider que le code a exactement 5 chiffres
      if (!/^\d{5}$/.test(otpCode)) {
        setError("Le code OTP doit contenir exactement 5 chiffres");
        setIsLoading(false);
        return;
      }

      // Utiliser le service Faroty pour la vérification
      const response = await farotyService.verifyOtp(email, otpCode, tempToken);
      
      if (response.success && response.data) {
        // Stocker les informations utilisateur complètes dans localStorage
        localStorage.setItem('faroty_user', JSON.stringify(response.data));
        localStorage.setItem('faroty_user_id', response.data.id || '');
        localStorage.setItem('faroty_user_name', response.data.fullName || '');
        localStorage.setItem('faroty_user_email', response.data.email || '');
        localStorage.setItem('faroty_user_phone', response.data.phoneNumber || '');
        localStorage.setItem('faroty_user_accountStatus', response.data.accountStatus || 'ACTIVE');
        
        setSuccess("Inscription validée! Redirection...");
        
        // Vérifier si l'utilisateur doit revenir à la page admin transactions
        const returnToAdminTransactions = localStorage.getItem('return_to_admin_transactions');
        
        setTimeout(() => {
          if (returnToAdminTransactions === 'true') {
            localStorage.removeItem('return_to_admin_transactions');
            router.push('/admin/transactions');
          } else {
            router.push('/payment-checkout');
          }
        }, 1500);
      } else {
        setError(response.message || "Code OTP invalide");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError("Erreur de vérification du code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep('register');
    setFullName("");
    setOtpCode("");
    setTempToken("");
    setShowOtp(false);
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {step === 'register' ? 'Création de compte Faroty' : 'Vérification du code'}
          </h1>
          <p className="text-gray-600">
            {step === 'register' 
              ? 'Créez votre compte pour finaliser votre paiement' 
              : 'Entrez le code à 5 chiffres reçu par email pour valider votre inscription'
            }
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 text-sm">{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        )}

        {/* Register Form */}
        {step === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Votre nom complet"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !fullName || !email}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Création du compte...
                </>
              ) : (
                'Créer un compte'
              )}
            </button>
          </form>
        )}

        {/* OTP Form */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Code de vérification
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="otp"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-lg font-mono"
                  placeholder="00000"
                  maxLength={5}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Entrez le code à 5 chiffres reçu à {email}
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading || otpCode.length !== 5}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Validation...
                  </>
                ) : (
                  'Valider mon inscription'
                )}
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Modifier les informations
              </button>
            </div>
          </form>
        )}

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">🔐 Inscription sécurisée via Faroty</p>
            <p>Vos informations sont protégées et chiffrées</p>
          </div>
          
          {/* Lien vers connexion */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte?{" "}
              <Link 
                href="/auth/login" 
                className="text-green-600 hover:text-green-700 font-medium underline"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
