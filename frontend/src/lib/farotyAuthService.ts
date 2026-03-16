// Service pour gérer l'authentification Faroty et les paiements

export interface FarotyUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePictureUrl?: string;
  accountStatus?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  kycVerified?: boolean;
  lastLogin?: number;
}

export interface FarotyDeviceInfo {
  deviceId: string;
  deviceType: string;
  deviceModel: string;
  osName: string;
}

export interface FarotyLoginResponse {
  success: boolean;
  message: string;
  data: {
    tempToken: string;
    contact: string;
    channel: string;
    message: string;
    newUser: boolean;
  };
}

export interface FarotyVerifyOtpResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string | null;
    expiresIn: number;
    user: FarotyUser;
    device: FarotyDeviceInfo;
    session: {
      id: string;
      sessionToken: string;
      loginTime: number;
      lastActivityTime: number;
      ipAddress: string;
      location: string | null;
      current: boolean;
    };
  };
}

export interface PaymentMethod {
  id: string;
  name: string;
  slug: string;
  technicalName: string;
  logoUrl: string;
  depositFeeRate: number;
  withdrawalFeeRate: number;
  maxTransactionAmount: number;
  transactionCooldown: number;
  referenceCurrency: string;
  supportsMultiCurrency: boolean;
  active: boolean;
  transactionsCount: number;
}

export interface PaymentSessionRequest {
  walletId: string;
  currencyCode: string;
  cancelUrl: string;
  successUrl: string;
  type: string;
  amount: number;
  contentType: string;
  dynamicContentData: {
    title: string;
    description: string;
    target: string;
    imageUrl: string;
  };
}

export interface PaymentSessionResponse {
  success: boolean;
  message: string;
  data: {
    sessionToken: string;
    sessionUrl: string;
  };
}

export const farotyAuthService = {
  // Générer les infos du device
  getDeviceInfo(): FarotyDeviceInfo {
    return {
      deviceId: "device-" + Math.random().toString(36).substr(2, 9),
      deviceType: navigator.userAgent.includes('Mobile') ? "MOBILE" : "WEB",
      deviceModel: navigator.userAgent.includes('Mobile') ? "Mobile Web" : "Desktop Web",
      osName: navigator.platform
    };
  },

  // Connexion via email
  async loginWithEmail(email: string): Promise<FarotyLoginResponse> {
    const deviceInfo = this.getDeviceInfo();
    
    const response = await fetch("https://api-prod.faroty.me/auth/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contact: email,
        deviceInfo: deviceInfo
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Vérification OTP
  async verifyOtp(otpCode: string, tempToken: string): Promise<FarotyVerifyOtpResponse> {
    const deviceInfo = this.getDeviceInfo();
    
    const response = await fetch("https://api-prod.faroty.me/auth/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otpCode: otpCode,
        tempToken: tempToken,
        deviceInfo: deviceInfo
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Stocker les tokens si succès
    if (data.success) {
      localStorage.setItem('faroty_access_token', data.data.accessToken);
      localStorage.setItem('faroty_refresh_token', data.data.refreshToken);
      localStorage.setItem('faroty_user_email', data.data.user.email);
      localStorage.setItem('faroty_user_name', data.data.user.fullName);
      localStorage.setItem('faroty_user_id', data.data.user.id);
      localStorage.setItem('faroty_user_accountStatus', data.data.user.accountStatus || 'ACTIVE');
    }
    
    return data;
  },

  // Récupérer les méthodes de paiement
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const accessToken = localStorage.getItem('faroty_access_token');
    
    if (!accessToken) {
      throw new Error('Non authentifié');
    }

    const response = await fetch("https://api-pay-prod.faroty.me/payments/api/v1/payment-methods", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data.content;
  },

  // Créer une session de paiement
  async createPaymentSession(paymentData: PaymentSessionRequest): Promise<PaymentSessionResponse> {
    const API_KEY = "fk_live_mhZG1htEBgK02jvI5QZqNYTpzgdfFmMCisI8cho4KbxqSD9uq2l6h39XppRSayQVTtAj5pCAjRU";
    
    const response = await fetch("https://api-pay-prod.faroty.me/payments/api/v1/payment-sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return !!localStorage.getItem('faroty_access_token');
  },

  // Obtenir les infos utilisateur
  getUserInfo(): FarotyUser | null {
    // Essayer d'abord depuis l'objet complet
    const user = localStorage.getItem('faroty_user');
    if (user) {
      const parsedUser = JSON.parse(user);
      // S'assurer que l'email est présent
      if (parsedUser.email) {
        return parsedUser;
      }
    }
    
    // Fallback: reconstruire depuis les clés séparées
    const fallbackUser = {
      id: localStorage.getItem('faroty_user_id') || '',
      fullName: localStorage.getItem('faroty_user_name') || '',
      email: localStorage.getItem('faroty_user_email') || '',
      phoneNumber: localStorage.getItem('faroty_user_phone') || '',
      accountStatus: localStorage.getItem('faroty_user_accountStatus') || 'ACTIVE'
    };
    
    // Si l'email est disponible, retourner l'utilisateur reconstruit
    if (fallbackUser.email) {
      return fallbackUser;
    }
    
    return null;
  },

  // Déconnexion
  logout(): void {
    localStorage.removeItem('faroty_access_token');
    localStorage.removeItem('faroty_refresh_token');
    localStorage.removeItem('faroty_user_email');
    localStorage.removeItem('faroty_user_name');
    localStorage.removeItem('faroty_user_id');
    localStorage.removeItem('faroty_user_accountStatus');
  },

  // Rafraîchir le token si nécessaire
  async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('faroty_refresh_token');
    
    if (!refreshToken) {
      return false;
    }

    try {
      const deviceInfo = this.getDeviceInfo();
      
      const response = await fetch("https://api-prod.faroty.me/auth/api/auth/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: refreshToken,
          deviceInfo: deviceInfo
        }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('faroty_access_token', data.data.accessToken);
        localStorage.setItem('faroty_refresh_token', data.data.refreshToken);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      return false;
    }
  }
};
