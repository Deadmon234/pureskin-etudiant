"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, Check, AlertCircle, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    contact: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpData, setOtpData] = useState({
    otp1: "",
    otp2: "",
    otp3: "",
    otp4: "",
    otp5: "",
    tempToken: ""
  });
  const [showOtpPassword, setShowOtpPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log('🔐 Tentative d\'inscription Faroty...');
      console.log('Données:', formData);

      const response = await fetch("https://api-prod.faroty.me/auth/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          contact: formData.contact
        }),
      });

      const data = await response.json();
      console.log('Réponse inscription:', data);

      if (response.ok && data.success) {
        console.log('✅ Inscription réussie, tempToken:', data.data.tempToken);
        setSuccess("Inscription réussie ! Un code de vérification a été envoyé.");
        setIsOtpSent(true);
        setOtpData(prev => ({
          ...prev,
          tempToken: data.data.tempToken
        }));
      } else {
        setError(data.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error('❌ Erreur inscription:', error);
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log('🔍 Vérification OTP...');
      const otpCode = otpData.otp1 + otpData.otp2 + otpData.otp3 + otpData.otp4 + otpData.otp5;
      console.log('Code OTP:', otpCode);
      console.log('TempToken:', otpData.tempToken);

      const response = await fetch("https://api-prod.faroty.me/auth/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otpCode: otpCode,
          tempToken: otpData.tempToken,
          deviceInfo: {
            deviceId: "device-1234",
            deviceType: "WEB",
            deviceModel: "Web Browser",
            osName: "Web Browser",
            manufacturer: null,
            pushNotificationToken: null,
            userAgent: navigator.userAgent,
            ipAddress: "127.0.0.1",
            location: null,
            isPhysicalDevice: false
          }
        }),
      });

      const data = await response.json();
      console.log('Réponse vérification OTP:', data);

      if (response.ok && data.success) {
        console.log('✅ Vérification OTP réussie !');
        console.log('AccessToken:', data.data.accessToken);
        
        // Stocker les tokens dans localStorage
        localStorage.setItem("faroty_access_token", data.data.accessToken);
        localStorage.setItem("faroty_refresh_token", data.data.refreshToken);
        localStorage.setItem("faroty_user", JSON.stringify(data.data.user));

        setSuccess("Authentification réussie ! Redirection...");
        
        // Rediriger vers la page de paiement ou dashboard
        setTimeout(() => {
          router.push("/payment-checkout");
        }, 1500);
      } else {
        setError(data.message || "Code OTP invalide");
      }
    } catch (error) {
      console.error('❌ Erreur vérification OTP:', error);
      setError("Erreur de vérification. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isOtpSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Vérification du Code</h2>
            <p className="mt-2 text-sm text-gray-600">
              Un code de vérification a été envoyé à votre email/numéro
            </p>
          </div>

          {/* Formulaire OTP */}
          <div className="bg-white rounded-xl shadow-lg p-8">
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
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Entrez le code à 5 chiffres reçu par email
                </p>
              </div>

              {/* Message de succès */}
              {success && (
                <div className="flex items-center text-green-600 text-sm mb-4">
                  <Check className="w-4 h-4 mr-2" />
                  {success}
                </div>
              )}

              {/* Message d'erreur */}
              {error && (
                <div className="flex items-center text-red-600 text-sm mb-4">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}

              {/* Boutons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg font-semibold"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Vérification en cours...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Vérifier le code
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsOtpSent(false)}
                  className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à l'inscription
                </button>
              </div>
            </form>
          </div>

          {/* Lien vers connexion */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{" "}
              <Link href="/auth-checkout" className="font-medium text-green-600 hover:text-green-500">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">PS</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Créer un compte</h2>
          <p className="mt-2 text-sm text-gray-600">
            Rejoignez PureSkin pour une expérience personnalisée
          </p>
        </div>

        {/* Formulaire d'inscription */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Nom complet */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Entrez votre nom complet"
                  className="w-full pl-10 text-gray-600 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Contact (Email/Téléphone) */}
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                Email ou Téléphone
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="contact"
                  name="contact"
                  type="text"
                  required
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Entrez votre email ou numéro de téléphone"
                  className="w-full pl-10 text-gray-600 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Message de succès */}
            {success && (
              <div className="flex items-center text-green-600 text-sm mb-4">
                <Check className="w-4 h-4 mr-2" />
                {success}
              </div>
            )}

            {/* Message d'erreur */}
            {error && (
              <div className="flex items-center text-red-600 text-sm mb-4">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}

            {/* Bouton d'inscription */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg font-semibold"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Inscription en cours...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Créer mon compte
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Lien vers connexion */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Vous avez déjà un compte ?{" "}
            <Link href="/auth-checkout" className="font-medium text-green-600 hover:text-green-500">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
