"use client";

import { useState, useEffect } from "react";
import { farotyService } from "@/lib/faroty-service";
import { User, Check, AlertCircle, RefreshCw, Eye, LogOut } from "lucide-react";

export default function TestUserInfoPage() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    // Charger les informations utilisateur au chargement de la page
    loadUserInfo();
  }, []);

  const loadUserInfo = () => {
    const userStr = localStorage.getItem('faroty_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserInfo(user);
        console.log('📋 Informations utilisateur chargées:', user);
      } catch (error) {
        console.error('❌ Erreur parsing user:', error);
      }
    }
  };

  const testGetUserInfo = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      console.log('🧪 TEST RÉCUPÉRATION INFOS UTILISATEUR');
      
      const response = await farotyService.getUserInfo();
      
      setResult({
        success: true,
        type: 'user_info_retrieved',
        response: response,
        timestamp: new Date().toISOString()
      });
      
      // Recharger les informations utilisateur
      loadUserInfo();
      
    } catch (error) {
      setResult({
        success: false,
        type: 'user_info_error',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testClearUser = () => {
    farotyService.logout();
    setUserInfo(null);
    
    setResult({
      success: true,
      type: 'user_cleared',
      message: 'Informations utilisateur effacées',
      timestamp: new Date().toISOString()
    });
  };

  const testLogDetails = () => {
    if (userInfo) {
      console.log('📊 DÉTAILS COMPLETS UTILISATEUR:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🆔 ID:', userInfo.id);
      console.log('👤 Nom complet:', userInfo.fullName);
      console.log('📧 Email:', userInfo.email);
      console.log('📱 Téléphone:', userInfo.phoneNumber || 'Non défini');
      console.log('📸 Photo profil:', userInfo.profilePictureUrl || 'Non définie');
      console.log('📊 Statut compte:', userInfo.accountStatus || 'Non défini');
      console.log('✅ Email vérifié:', userInfo.emailVerified ? 'Oui' : 'Non');
      console.log('📞 Téléphone vérifié:', userInfo.phoneVerified ? 'Oui' : 'Non');
      console.log('🔍 KYC vérifié:', userInfo.kycVerified ? 'Oui' : 'Non');
      console.log('🔐 Code PIN:', userInfo.hasPinCode ? 'Oui' : 'Non');
      console.log('🕐 Dernière connexion:', userInfo.lastLogin ? new Date(userInfo.lastLogin * 1000).toLocaleString() : 'Non défini');
      console.log('📅 Créé le:', userInfo.createdAt ? new Date(userInfo.createdAt * 1000).toLocaleString() : 'Non défini');
      console.log('🔄 Mis à jour le:', userInfo.updatedAt ? new Date(userInfo.updatedAt * 1000).toLocaleString() : 'Non défini');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
    
    setResult({
      success: true,
      type: 'details_logged',
      message: 'Détails utilisateur affichés dans la console',
      timestamp: new Date().toISOString()
    });
  };

  const testAccessToken = () => {
    const token = farotyService.getAccessToken();
    
    setResult({
      success: true,
      type: 'access_token',
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : null,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Informations Utilisateur Faroty</h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Actions de Test
              </h2>
              
              <div className="space-y-4">
                <button
                  onClick={testGetUserInfo}
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Récupération...' : 'Récupérer Infos Utilisateur'}
                </button>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={testLogDetails}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Voir Détails
                  </button>
                  <button
                    onClick={testAccessToken}
                    className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 text-sm"
                  >
                    Token Access
                  </button>
                </div>
                
                <button
                  onClick={testClearUser}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion / Effacer
                </button>
              </div>
            </div>

            {/* Résultats */}
            {result && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Résultat du Test
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {result.success ? 'Succès' : 'Échec'}
                  </span>
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="ml-2 font-medium">{result.type}</span>
                  </div>
                  
                  {result.message && (
                    <div>
                      <span className="text-sm text-gray-600">Message:</span>
                      <span className="ml-2">{result.message}</span>
                    </div>
                  )}
                  
                  {result.hasToken !== undefined && (
                    <div>
                      <span className="text-sm text-gray-600">Token Access:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        result.hasToken ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {result.hasToken ? 'Présent' : 'Absent'}
                      </span>
                      {result.tokenPreview && (
                        <div className="mt-1 font-mono text-xs bg-gray-100 p-2 rounded">
                          {result.tokenPreview}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {result.response && (
                    <div>
                      <span className="text-sm text-gray-600">Réponse:</span>
                      <pre className="mt-1 bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-32">
                        {JSON.stringify(result.response, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {result.error && (
                    <div>
                      <span className="text-sm text-red-600">Erreur:</span>
                      <div className="mt-1 p-2 bg-red-50 rounded text-red-700 text-sm">
                        {result.error}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    Timestamp: {result.timestamp}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Informations actuelles */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Check className="w-5 h-5 mr-2 text-green-600" />
                Informations Utilisateur Actuelles
              </h2>
              
              {userInfo ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">ID Utilisateur:</span>
                      <div className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">
                        {userInfo.id}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Nom complet:</span>
                      <div className="font-medium bg-gray-100 p-2 rounded mt-1">
                        {userInfo.fullName}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Email:</span>
                      <div className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">
                        {userInfo.email}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Téléphone:</span>
                      <div className="font-medium bg-gray-100 p-2 rounded mt-1">
                        {userInfo.phoneNumber || 'Non défini'}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">Statut du compte:</span>
                    <div className="mt-1">
                      <span className={`px-3 py-1 rounded text-sm font-medium ${
                        userInfo.accountStatus === 'EMAIL_VERIFIED' ? 'bg-green-100 text-green-800' :
                        userInfo.accountStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {userInfo.accountStatus || 'Non défini'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <span className="text-sm text-gray-600">Vérifications:</span>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div className="text-center">
                        <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                          userInfo.emailVerified ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {userInfo.emailVerified ? '✓' : '?'}
                        </div>
                        <span className="text-xs">Email</span>
                      </div>
                      <div className="text-center">
                        <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                          userInfo.phoneVerified ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {userInfo.phoneVerified ? '✓' : '?'}
                        </div>
                        <span className="text-xs">Téléphone</span>
                      </div>
                      <div className="text-center">
                        <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                          userInfo.kycVerified ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {userInfo.kycVerified ? '✓' : '?'}
                        </div>
                        <span className="text-xs">KYC</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Code PIN:</span>
                      <div className="mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          userInfo.hasPinCode ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {userInfo.hasPinCode ? 'Configuré' : 'Non configuré'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Photo profil:</span>
                      <div className="mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          userInfo.profilePictureUrl ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {userInfo.profilePictureUrl ? 'Définie' : 'Non définie'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Dernière connexion:</span>
                      <div className="text-xs bg-gray-100 p-2 rounded mt-1">
                        {userInfo.lastLogin ? new Date(userInfo.lastLogin * 1000).toLocaleString() : 'Non défini'}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Créé le:</span>
                      <div className="text-xs bg-gray-100 p-2 rounded mt-1">
                        {userInfo.createdAt ? new Date(userInfo.createdAt * 1000).toLocaleString() : 'Non défini'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Aucune information utilisateur trouvée</p>
                  <p className="text-sm mt-2">Connectez-vous avec Faroty pour voir les informations</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
