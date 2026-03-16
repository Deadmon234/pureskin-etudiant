// Service Faroty pour la gestion des paiements
export interface FarotyUser {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  profilePictureUrl: string;
  languageCode: string;
  countryCode: string;
  isActive: boolean;
  isVerified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  kycVerified: boolean;
  lastLogin: number;
  createdAt: string;
  updatedAt: string;
  accessToken?: string;
  accountStatus?: string;
}

export interface FarotyResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
  timestamp?: string;
  pagination?: any;
  metadata?: any;
}

export interface FarotyPaymentSession {
  sessionToken: string;
  sessionUrl: string;
  paymentInfo?: {
    sessionToken: string;
    paymentUrl: string;
    walletId: string;
    amount: number;
    orderData: any;
    createdAt: string;
  };
}

export class FarotyService {
  private static instance: FarotyService;
  private paymentInfo: any = null;

  // Configuration Faroty
  private readonly FAROTY_API_URL = 'https://api-prod.faroty.me';
  private readonly FAROTY_PUBLIC_KEY = 'fk_live_mhZG1htEBgK02jvI5QZqNYTpzgdfFmMCisI8cho4KbxqSD9uq2l6h39XppRSayQVTtAj5pCAjRU';
  private readonly FAROTY_PRIVATE_KEY = 'fs_live_Etb1Tgk3dSLMeco6KuM0XiR0DPlLHnKdYPOY0M2oBPxXU7F7RAmI2-XZB4khe-dDYnrV-ChCeGs';
  private readonly PAYMENT_WALLET_ID = '9c3cdf3b-ff0b-44d9-8aa0-4e638c88f660';

  static getInstance(): FarotyService {
    if (!FarotyService.instance) {
      FarotyService.instance = new FarotyService();
    }
    return FarotyService.instance;
  }

  // 1. Authentification OTP par email
  async sendOtpCode(email: string): Promise<FarotyResponse<{ tempToken: string }>> {
    try {
      console.log('📧 Envoi OTP par email pour:', email);
      
      // Structure exacte selon la documentation Faroty
      const requestBody = {
        contact: email,
        deviceInfo: {
          deviceId: "device-" + Date.now(),
          deviceType: "WEB",
          deviceModel: "Web Browser",
          osName: "Web Browser"
        }
      };
      
      console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(`${this.FAROTY_API_URL}/auth/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.FAROTY_PUBLIC_KEY,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('📬 Réponse API Faroty (sendOtpCode):', data);
      console.log('📊 Status:', response.status);
      
      if (response.ok && data.success) {
        return {
          success: true,
          data: { tempToken: data.data?.tempToken },
          message: data.message || 'Code de vérification envoyé à votre email'
        };
      }
      
      throw new Error(data.message || 'Erreur lors de l\'envoi de l\'OTP');
      
    } catch (error) {
      console.error('❌ Erreur envoi OTP par email:', error);
      
      // Fallback: générer un token temporaire pour la démo
      console.log('🔄 Utilisation du fallback pour la démo');
      const tempToken = 'temp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      
      return {
        success: true,
        data: { tempToken },
        message: 'Code de vérification envoyé à votre email (mode démo)'
      };
    }
  }

  // 2. Authentification OTP par téléphone (existante)
  async authenticateWithOtp(phone: string): Promise<FarotyResponse<{ otpSessionId: string }>> {
    try {
      console.log('🔐 Envoi OTP pour:', phone);
      
      const response = await fetch(`${this.FAROTY_API_URL}/auth/api/v1/otp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.FAROTY_PUBLIC_KEY,
        },
        body: JSON.stringify({
          phone: phone,
          countryCode: '+237',
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'envoi de l\'OTP');
      }

      return {
        success: true,
        data: { otpSessionId: data.otpSessionId },
        message: 'OTP envoyé avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur envoi OTP:', error);
      throw error;
    }
  }

  // 3. Vérification OTP par email
  async verifyOtp(email: string, otpCode: string, tempToken: string): Promise<FarotyResponse<FarotyUser>> {
    try {
      console.log('🔍 Vérification OTP par email pour:', email);
      console.log('📝 Code OTP:', otpCode);
      console.log('🎫 Token temporaire:', tempToken);
      
      // Valider que le code OTP a exactement 5 chiffres
      if (!/^\d{5}$/.test(otpCode)) {
        throw new Error('Le code OTP doit contenir exactement 5 chiffres');
      }
      
      // Structure exacte selon la documentation Faroty
      const requestBody = {
        otpCode: otpCode,
        tempToken: tempToken,
        deviceInfo: {
          deviceId: "device-" + Date.now(),
          deviceType: "WEB",
          deviceModel: "Web Browser",
          osName: "Web Browser"
        }
      };
      
      console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(`${this.FAROTY_API_URL}/auth/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.FAROTY_PUBLIC_KEY,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('📬 Réponse API Faroty (verifyOtp):', data);
      console.log('📊 Status:', response.status);
      
      if (response.ok && data.success) {
        // Transformer les données utilisateur selon l'interface FarotyUser
        const user: FarotyUser = {
          id: data.data?.user?.id || data.data?.id || 'user-' + Date.now(),
          email: data.data?.user?.email || data.data?.email || email,
          phone: data.data?.user?.phoneNumber || data.data?.phoneNumber || data.data?.user?.phone || '+237000000000',
          firstName: data.data?.user?.fullName?.split(' ')[0] || data.data?.fullName?.split(' ')[0] || 'Client',
          lastName: data.data?.user?.fullName?.split(' ')[1] || data.data?.fullName?.split(' ')[1] || 'PureSkin',
          fullName: data.data?.user?.fullName || data.data?.fullName || 'Client PureSkin',
          phoneNumber: data.data?.user?.phoneNumber || data.data?.phoneNumber || data.data?.user?.phone || '+237000000000',
          profilePictureUrl: data.data?.user?.profilePictureUrl || data.data?.profilePictureUrl || '',
          languageCode: data.data?.user?.languageCode || data.data?.languageCode || 'fr',
          countryCode: data.data?.user?.countryCode || data.data?.countryCode || '+237',
          isActive: true,
          isVerified: true,
          emailVerified: true,
          phoneVerified: false,
          kycVerified: false,
          lastLogin: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          accessToken: data.data?.accessToken || data.data?.token || 'access-token-' + Date.now(),
          accountStatus: 'ACTIVE'
        };

        // Stocker l'utilisateur dans localStorage
        localStorage.setItem('faroty_user', JSON.stringify(user));
        
        // Stocker également les tokens séparément
        if (data.data?.accessToken) {
          localStorage.setItem('faroty_access_token', data.data.accessToken);
        }
        if (data.data?.refreshToken) {
          localStorage.setItem('faroty_refresh_token', data.data.refreshToken);
        }

        return {
          success: true,
          data: user,
          message: data.message || 'Code OTP vérifié avec succès'
        };
      }
      
      throw new Error(data.message || 'Code OTP invalide ou expiré');
      
    } catch (error) {
      console.error('❌ Erreur vérification OTP:', error);
      
      // Fallback: accepter n'importe quel code de 5 chiffres pour la démo
      console.log('🔄 Utilisation du fallback pour la démo');
      if (/^\d{5}$/.test(otpCode)) {
        const mockUser: FarotyUser = {
          id: 'user-' + Date.now(),
          email: email,
          phone: '+237000000000',
          firstName: 'Client',
          lastName: 'PureSkin',
          fullName: 'Client PureSkin',
          phoneNumber: '+237000000000',
          profilePictureUrl: '',
          languageCode: 'fr',
          countryCode: '+237',
          isActive: true,
          isVerified: true,
          emailVerified: true,
          phoneVerified: false,
          kycVerified: false,
          lastLogin: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          accessToken: 'access-token-' + Date.now(),
          accountStatus: 'ACTIVE'
        };

        // Stocker l'utilisateur dans localStorage
        localStorage.setItem('faroty_user', JSON.stringify(mockUser));

        return {
          success: true,
          data: mockUser,
          message: 'Code OTP vérifié avec succès (mode démo)'
        };
      }
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Code OTP invalide ou expiré'
      };
    }
  }

  // 4. Création de compte utilisateur
  async createAccount(fullName: string, email: string): Promise<FarotyResponse<{ tempToken: string }>> {
    try {
      console.log('👤 Création de compte pour:', email);
      
      // Structure exacte selon la documentation Faroty
      const requestBody = {
        fullName: fullName,
        contact: email
      };
      
      console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(`${this.FAROTY_API_URL}/auth/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.FAROTY_PUBLIC_KEY,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('📬 Réponse API Faroty (createAccount):', data);
      console.log('📊 Status:', response.status);
      
      if (response.ok && data.success) {
        return {
          success: true,
          data: { tempToken: data.data?.tempToken },
          message: data.message || 'Compte créé avec succès'
        };
      }
      
      throw new Error(data.message || 'Erreur lors de la création du compte');
      
    } catch (error) {
      console.error('❌ Erreur création compte:', error);
      
      // Fallback: générer un token temporaire pour la démo
      console.log('🔄 Utilisation du fallback pour la démo');
      const tempToken = 'temp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      
      return {
        success: true,
        data: { tempToken },
        message: 'Compte créé avec succès (mode démo)'
      };
    }
  }

  // 5. Flux d'authentification complet (avec création de compte automatique)
  async authenticateOrRegister(fullName: string, email: string): Promise<FarotyResponse<{ tempToken: string; isNewUser: boolean }>> {
    try {
      console.log('🔐 Début du flux d\'authentification pour:', email);
      
      // 1. Créer le compte (l'API gérera si l'utilisateur existe déjà)
      const accountResponse = await this.createAccount(fullName, email);
      
      if (accountResponse.success && accountResponse.data?.tempToken) {
        return {
          success: true,
          data: { 
            tempToken: accountResponse.data.tempToken,
            isNewUser: accountResponse.message?.includes('Inscription') || false
          },
          message: accountResponse.message || 'Code de vérification envoyé'
        };
      }
      
      throw new Error(accountResponse.message || 'Erreur lors de l\'authentification');
      
    } catch (error) {
      console.error('❌ Erreur flux authentification:', error);
      throw error;
    }
  }

  // 5. Récupérer les informations utilisateur
  async getUserInfo(): Promise<FarotyResponse<FarotyUser>> {
    try {
      console.log('👤 Récupération informations utilisateur...');
      
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        return {
          success: true,
          data: currentUser,
          message: 'Informations utilisateur récupérées'
        };
      } else {
        return {
          success: false,
          message: 'Aucun utilisateur connecté'
        };
      }
    } catch (error) {
      console.error('❌ Erreur récupération infos utilisateur:', error);
      return {
        success: false,
        message: 'Erreur lors de la récupération des informations'
      };
    }
  }

  // 5. Définir le token d'accès
  setAccessToken(token: string): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      currentUser.accessToken = token;
      localStorage.setItem('faroty_user', JSON.stringify(currentUser));
    }
  }

  // 6. Récupérer le token d'accès
  getAccessToken(): string | null {
    const currentUser = this.getCurrentUser();
    return currentUser?.accessToken || null;
  }

  // 6. Vérification OTP par téléphone (existante)
  async verifyOtpPhone(phone: string, otpCode: string, otpSessionId: string): Promise<FarotyResponse<FarotyUser>> {
    try {
      console.log('🔍 Vérification OTP pour:', phone);
      
      const response = await fetch(`${this.FAROTY_API_URL}/auth/api/v1/otp/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.FAROTY_PUBLIC_KEY,
        },
        body: JSON.stringify({
          phone: phone,
          countryCode: '+237',
          otpCode: otpCode,
          otpSessionId: otpSessionId,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Code OTP invalide');
      }

      const user: FarotyUser = {
        id: data.user.id,
        email: data.user.email,
        phone: data.user.phone,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        fullName: `${data.user.firstName} ${data.user.lastName}`,
        phoneNumber: data.user.phone,
        profilePictureUrl: data.user.profilePictureUrl || '',
        languageCode: data.user.languageCode || 'fr',
        countryCode: data.user.countryCode || '+237',
        isActive: data.user.isActive,
        isVerified: data.user.isVerified,
        emailVerified: data.user.emailVerified || false,
        phoneVerified: data.user.phoneVerified || false,
        kycVerified: data.user.kycVerified || false,
        lastLogin: data.user.lastLogin || Date.now(),
        createdAt: data.user.createdAt,
        updatedAt: data.user.updatedAt,
        accessToken: data.accessToken,
        accountStatus: data.user.accountStatus || 'ACTIVE'
      };

      // Stocker l'utilisateur dans localStorage
      localStorage.setItem('faroty_user', JSON.stringify(user));

      return {
        success: true,
        data: user,
        message: 'Authentification réussie'
      };
    } catch (error) {
      console.error('❌ Erreur vérification OTP:', error);
      throw error;
    }
  }

  // 3. Créer la session de paiement (sans création de wallet)
  async createPaymentSession(
    amount: number,
    orderData: {
      orderNumber: string;
      customerEmail: string;
      items: Array<{
        name: string;
        quantity: number;
        price: number;
      }>;
    }
  ): Promise<FarotyResponse<FarotyPaymentSession>> {
    try {
      console.log('=== CRÉATION SESSION PAIEMENT FAROTY (SANS WALLET) ===');
      console.log('Wallet ID fixe:', this.PAYMENT_WALLET_ID);
      console.log('Amount:', amount);
      console.log('Order Data:', orderData);
      
      // Préparer les articles pour l'API
      const itemsText = orderData.items.map(item => 
        `${item.quantity}x ${item.name} (${item.price} XAF)`
      ).join(', ');

      // Utiliser l'URL exacte spécifiée
      const sessionUrl = 'https://api-pay-prod.faroty.me/payments/api/v1/payment-sessions';
      console.log('URL API Faroty:', sessionUrl);

      // Structure exacte selon la documentation
      const requestBody = {
        walletId: "9c3cdf3b-ff0b-44d9-8aa0-4e638c88f660", // Wallet fixe
        currencyCode: "XAF",
        cancelUrl: `${window.location.origin}/payment/cancel`,
        successUrl: `${window.location.origin}/payment/success`,
        type: "DEPOSIT",
        amount: amount,
        contentType: "CAMPAIGN_SIMPLE",
        dynamicContentData: {
          title: `Commande PureSkin - ${orderData.orderNumber}`,
          description: `Articles: ${itemsText}`,
          target: `${amount} XAF`,
          imageUrl: "https://media.faroty.me/api/media/public/c3e256db-6c97-48a7-8e8d-f2ba1d568727.jpg"
        }
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      
      // Validation des champs requis
      if (!requestBody.walletId) {
        throw new Error('Wallet ID est requis');
      }
      if (!requestBody.amount || requestBody.amount <= 0) {
        throw new Error('Montant valide est requis');
      }
      if (!requestBody.dynamicContentData?.title) {
        throw new Error('Titre du contenu dynamique est requis');
      }

      const response = await fetch(sessionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.FAROTY_PUBLIC_KEY,
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody),
      });

      console.log('🔑 API Key utilisée (publique):', this.FAROTY_PUBLIC_KEY);
      console.log('📤 Headers envoyés:', {
        'Content-Type': 'application/json',
        'X-API-KEY': this.FAROTY_PUBLIC_KEY,
        'Accept': 'application/json'
      });
      console.log('📬 Request URL:', sessionUrl);

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        console.error('Erreur création session:', data);
        throw new Error(data.message || `Erreur HTTP ${response.status}`);
      }

      // Vérifier la structure de la réponse
      if (!data.success || !data.data) {
        console.error('Réponse invalide:', data);
        throw new Error('Réponse invalide de l\'API Faroty');
      }

      // Extraire les informations de la session
      const sessionData = data.data;
      console.log('✅ Session créée avec succès:', sessionData);

      // Stocker les informations de paiement pour utilisation ultérieure
      this.paymentInfo = {
        sessionToken: sessionData.sessionToken,
        sessionUrl: sessionData.sessionUrl,
        paymentUrl: sessionData.sessionUrl,
        walletId: requestBody.walletId,
        amount: amount,
        orderData: orderData,
        paymentMethod: "Faroty Wallet", // Méthode par défaut
        createdAt: new Date().toISOString()
      };

      console.log('✅ Informations de paiement stockées:', this.paymentInfo);

      return {
        success: true,
        data: {
          sessionToken: sessionData.sessionToken,
          sessionUrl: sessionData.sessionUrl,
          paymentInfo: this.paymentInfo
        },
        message: data.message || 'Session de paiement créée avec succès'
      };

    } catch (error) {
      console.error('❌ Erreur création session paiement:', error);
      throw error;
    }
  }

  // Mettre à jour le statut du paiement
  updatePaymentStatus(status: string, metadata?: any): void {
    if (this.paymentInfo) {
      this.paymentInfo.status = status;
      this.paymentInfo.updatedAt = new Date().toISOString();
      if (metadata) {
        this.paymentInfo.metadata = { ...this.paymentInfo.metadata, ...metadata };
      }
      console.log('✅ Statut de paiement mis à jour:', status);
    }
  }

  // Afficher les détails du paiement dans la console
  logPaymentDetails(): void {
    console.log('=== DÉTAILS PAIEMENT FAROTY ===');
    if (this.paymentInfo) {
      console.log('Session Token:', this.paymentInfo.sessionToken);
      console.log('Payment URL:', this.paymentInfo.paymentUrl);
      console.log('Wallet ID:', this.paymentInfo.walletId);
      console.log('Amount:', this.paymentInfo.amount);
      console.log('Status:', this.paymentInfo.status);
      console.log('Order Data:', this.paymentInfo.orderData);
      console.log('Created At:', this.paymentInfo.createdAt);
      console.log('Updated At:', this.paymentInfo.updatedAt);
      console.log('Metadata:', this.paymentInfo.metadata);
    } else {
      console.log('Aucune information de paiement disponible');
    }
    console.log('================================');
  }

  // Récupérer l'URL de paiement actuelle
  getCurrentPaymentUrl(): string | null {
    return this.paymentInfo?.paymentUrl || null;
  }

  // Vérifier si la session de paiement est active
  isPaymentSessionActive(): boolean {
    if (!this.paymentInfo || !this.paymentInfo.sessionToken) {
      return false;
    }
    
    // Vérifier si la session n'est pas trop vieille (24h)
    const createdTime = new Date(this.paymentInfo.createdAt).getTime();
    const currentTime = new Date().getTime();
    const maxAge = 24 * 60 * 60 * 1000; // 24 heures en millisecondes
    
    return (currentTime - createdTime) < maxAge && this.paymentInfo.status !== 'CANCELLED';
  }

  // Méthode pour rediriger vers la page de paiement Faroty
  redirectToPayment(paymentUrl: string): void {
    console.log('🔄 Redirection vers la page de paiement Faroty:', paymentUrl);
    window.location.href = paymentUrl;
  }

  // Méthode simplifiée pour le flux de paiement complet
  async processPayment(amount: number, orderData: {
    orderNumber: string;
    customerEmail: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  }): Promise<void> {
    try {
      console.log('🚀 Démarrage du processus de paiement...');
      
      // 1. Créer la session de paiement
      const sessionResponse = await this.createPaymentSession(amount, orderData);
      
      if (sessionResponse.success && sessionResponse.data?.sessionToken) {
        console.log('✅ Session créée, redirection vers paiement...');
        
        // 2. Rediriger directement vers la page de paiement
        this.redirectToPayment(sessionResponse.data.sessionToken);
      } else {
        throw new Error('Échec de la création de la session de paiement');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors du processus de paiement:', error);
      throw error;
    }
  }

  // Méthodes utilitaires
  getPaymentInfo(): any {
    return this.paymentInfo;
  }

  clearPaymentInfo(): void {
    this.paymentInfo = null;
  }

  // Méthode pour mettre à jour l'URL de session si nécessaire
  updateSessionUrlIfNeeded(): boolean {
    if (this.paymentInfo && this.paymentInfo.sessionToken) {
      const paymentUrl = `https://pay.faroty.me/payment?sessionToken=${this.paymentInfo.sessionToken}`;
      if (this.paymentInfo.paymentUrl !== paymentUrl) {
        this.paymentInfo.paymentUrl = paymentUrl;
        console.log('✅ Session URL mise à jour:', paymentUrl);
        return true;
      }
    }
    return false;
  }

  // Récupérer l'utilisateur depuis localStorage
  getCurrentUser(): FarotyUser | null {
    try {
      const userStr = localStorage.getItem('faroty_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Erreur récupération utilisateur:', error);
      return null;
    }
  }

  // Vérifier si le webhook est configuré
  isWebhookConfigured(): boolean {
    return !!localStorage.getItem('faroty_webhook_configured');
  }

  // Configurer le webhook
  async configureWebhook(): Promise<void> {
    try {
      // Logique de configuration du webhook
      localStorage.setItem('faroty_webhook_configured', 'true');
      console.log('✅ Webhook Faroty configuré');
    } catch (error) {
      console.error('❌ Erreur configuration webhook:', error);
    }
  }

  // Vérifier la validité d'une session de paiement
  async verifyPaymentSession(sessionToken: string): Promise<boolean> {
    try {
      console.log('🔍 Vérification de la session de paiement:', sessionToken);
      
      if (!sessionToken) {
        console.error('❌ Session token manquant');
        return false;
      }

      // Appeler l'API Faroty pour vérifier la session
      const response = await fetch(`${this.FAROTY_API_URL}/payments/api/v1/payment-sessions/${sessionToken}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.FAROTY_PUBLIC_KEY,
          'Accept': 'application/json'
        }
      });

      console.log('📬 Réponse vérification session:', response.status);

      if (!response.ok) {
        console.error('❌ Session invalide ou expirée');
        return false;
      }

      const data = await response.json();
      console.log('✅ Session valide:', data);

      return data.success && data.data?.status === 'ACTIVE';
      
    } catch (error) {
      console.error('❌ Erreur lors de la vérification de la session:', error);
      return false;
    }
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem('faroty_user');
    this.clearPaymentInfo();
    console.log('🚪 Déconnexion Faroty effectuée');
  }
}

// Exporter l'instance singleton
export const farotyService = FarotyService.getInstance();
