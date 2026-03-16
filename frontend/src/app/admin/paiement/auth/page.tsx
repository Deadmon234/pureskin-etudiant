"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";

export default function AdminPaymentAuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otp3, setOtp3] = useState("");
  const [otp4, setOtp4] = useState("");
  const [otp5, setOtp5] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Informations du device (simulées pour le test)
  const deviceInfo = {
    deviceId: "device-1234",
    deviceType: "MOBILE",
    deviceModel: "iPhone de Mac",
    osName: "tester"
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Appel API réelle pour envoyer l'OTP
      const response = await fetch('https://api-prod.faroty.me/auth/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact: email,
          deviceInfo: deviceInfo
        })
      });

      const data = await response.json();
      console.log('🔍 Login API Response:', data);

      if (data.success && data.data?.tempToken) {
        setTempToken(data.data.tempToken);
        setShowOtp(true);
        console.log("✅ OTP envoyé à:", email);
        console.log("✅ Temp token reçu:", data.data.tempToken);
      } else {
        setError(data.message || "Erreur lors de l'envoi de l'OTP");
      }
    } catch (err) {
      console.error('❌ Error sending OTP:', err);
      setError("Erreur de connexion au serveur d'authentification");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Construire le code OTP complet à partir des 5 champs
      const fullOtp = otp1 + otp2 + otp3 + otp4 + otp5;
      
      // Appel API réelle pour vérifier l'OTP
      const response = await fetch('https://api-prod.faroty.me/auth/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otpCode: fullOtp,
          tempToken: tempToken,
          deviceInfo: deviceInfo
        })
      });

      const data = await response.json();
      console.log('🔍 Verify OTP API Response:', data);

      if (data.success && data.data?.accessToken) {
        const accessToken = data.data.accessToken;
        const userEmail = data.data.user?.email || email;
        
        // Stocker les tokens et informations utilisateur dans localStorage
        localStorage.setItem('admin_payment_token', accessToken);
        localStorage.setItem('admin_payment_refresh_token', data.data.refreshToken || '');
        localStorage.setItem('admin_payment_email', userEmail);
        localStorage.setItem('admin_payment_user', JSON.stringify(data.data.user));
        
        console.log("✅ Authentification réussie!");
        console.log("✅ Access token:", accessToken);
        console.log("✅ User:", data.data.user);
        console.log("✅ Token stocké dans localStorage");
        
        // Forcer un petit délai pour s'assurer que le hook détecte les changements
        setTimeout(() => {
          // Vérifier s'il y a une page de retour
          const returnToTransactions = localStorage.getItem('return_to_admin_transactions');
          localStorage.removeItem('return_to_admin_transactions'); // Nettoyer après utilisation
          
          if (returnToTransactions === 'true') {
            console.log('🔄 Retour vers la page transactions');
            router.push("/admin/transactions");
          } else {
            // Redirection par défaut vers la page transactions
            console.log('🔄 Redirection par défaut vers la page transactions');
            router.push("/admin/transactions");
          }
        }, 100);
      } else {
        setError(data.message || "Code OTP invalide");
      }
    } catch (err) {
      console.error('❌ Error verifying OTP:', err);
      setError("Erreur de vérification du code OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer le focus automatique entre les champs
  const handleOtpChange = (value: string, fieldIndex: number) => {
    // Nettoyer la valeur pour n'accepter que les chiffres
    const cleanValue = value.replace(/\D/g, '');
    
    // Mettre à jour le champ actuel
    if (fieldIndex === 1) setOtp1(cleanValue);
    else if (fieldIndex === 2) setOtp2(cleanValue);
    else if (fieldIndex === 3) setOtp3(cleanValue);
    else if (fieldIndex === 4) setOtp4(cleanValue);
    else if (fieldIndex === 5) setOtp5(cleanValue);
    
    // Focus automatique au champ suivant SEULEMENT si un chiffre est entré et le champ est rempli
    if (cleanValue.length === 1 && fieldIndex < 5) {
      setTimeout(() => {
        const nextField = document.getElementById(`otp${fieldIndex + 1}`);
        if (nextField) nextField.focus();
      }, 0);
    }
  };

  // Gérer le focus au champ suivant/précédent
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, fieldIndex: number) => {
    if (e.key === 'Backspace') {
      // Si le champ actuel est vide, aller au champ précédent
      const currentValue = (e.target as HTMLInputElement).value;
      if (!currentValue && fieldIndex > 1) {
        e.preventDefault();
        const prevField = document.getElementById(`otp${fieldIndex - 1}`);
        if (prevField) {
          prevField.focus();
          // Positionner le curseur à la fin
          setTimeout(() => {
            const input = prevField as HTMLInputElement;
            input.setSelectionRange(input.value.length, input.value.length);
          }, 0);
        }
      }
    } else if (e.key >= '0' && e.key <= '9') {
      // Pour les chiffres, laisser le onChange gérer le focus automatique
      return;
    } else if (e.key === 'ArrowLeft' && fieldIndex > 1) {
      // Navigation avec flèche gauche
      e.preventDefault();
      const prevField = document.getElementById(`otp${fieldIndex - 1}`);
      if (prevField) prevField.focus();
    } else if (e.key === 'ArrowRight' && fieldIndex < 5) {
      // Navigation avec flèche droite
      e.preventDefault();
      const nextField = document.getElementById(`otp${fieldIndex + 1}`);
      if (nextField) nextField.focus();
    }
  };

  // Gérer le focus quand on clique sur un champ
  const handleFocus = (fieldIndex: number) => {
    // Sélectionner tout le contenu du champ pour faciliter la modification
    setTimeout(() => {
      const field = document.getElementById(`otp${fieldIndex}`) as HTMLInputElement;
      if (field) {
        field.select();
      }
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Authentification Admin Paiements
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Accédez à la gestion des paiements sécurisée
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          {!showOtp ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email administrateur
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none text-gray-600 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="admin@pureskin.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    "Envoyer l'OTP"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-4">
                  Code OTP à 5 chiffres envoyé à {email}
                </label>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      id={`otp${index}`}
                      type="text"
                      maxLength={1}
                      value={index === 1 ? otp1 : index === 2 ? otp2 : index === 3 ? otp3 : index === 4 ? otp4 : otp5}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onFocus={() => handleFocus(index)}
                      className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-colors"
                      style={{ fontSize: '24px', lineHeight: '48px' }}
                      autoComplete="off"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOtp(false);
                      setOtp1("");
                      setOtp2("");
                      setOtp3("");
                      setOtp4("");
                      setOtp5("");
                    }}
                    className="text-sm text-green-600 hover:text-green-500"
                  >
                    Modifier l'email
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || !(otp1 && otp2 && otp3 && otp4 && otp5)}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    "Vérifier le code"
                  )}
                </button>
              </div>
            </form>
          )}

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          {/* Instructions de test */}
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <div className="text-sm text-blue-800">
              <strong>Mode production:</strong> Utilisation des vraies APIs Faroty<br/>
              <strong>Étape 1:</strong> Entrez votre email pour recevoir l'OTP<br/>
              <strong>Étape 2:</strong> Saisissez le code OTP à 5 chiffres<br/>
              <strong>Note:</strong> Le code sera envoyé à votre email réel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
