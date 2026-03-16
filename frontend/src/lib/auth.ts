// Service d'authentification Faroty

export interface DeviceInfo {
  deviceId: string;
  deviceType: "MOBILE" | "DESKTOP" | "TABLET";
  deviceModel: string;
  osName: string;
}

export interface LoginRequest {
  contact: string;
  deviceInfo: DeviceInfo;
}

export interface VerifyOtpRequest {
  otpCode: string;
  tempToken: string;
  deviceInfo: DeviceInfo;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    tempToken: string;
    contact: string;
    channel: string;
    message: string;
    newUser: boolean;
  };
  error: null;
  timestamp: number[];
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: null;
    expiresIn: number;
    user: {
      id: string;
      fullName: string;
      email: string;
      phoneNumber: string;
      profilePictureUrl: string;
      languageCode: string;
      countryCode: null;
      guest: boolean;
    };
    device: DeviceInfo & {
      osVersion: null;
      manufacturer: null;
      pushNotificationToken: null;
      userAgent: null;
      ipAddress: string;
      location: null;
      isPhysicalDevice: boolean;
    };
    session: {
      id: string;
      sessionToken: string;
      loginTime: number;
      lastActivityTime: number;
      ipAddress: string;
      location: null;
      current: boolean;
    };
  };
  error: null;
  timestamp: number[];
}

export class FarotyAuthService {
  private static readonly BASE_URL = "https://api-prod.faroty.me/auth/api/auth";
  
  // Génération d'ID de device unique
  private static getDeviceId(): string {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  }

  // Obtenir les informations du device
  private static getDeviceInfo(): DeviceInfo {
    return {
      deviceId: this.getDeviceId(),
      deviceType: this.getDeviceType(),
      deviceModel: this.getDeviceModel(),
      osName: this.getOsName()
    };
  }

  // Détecter le type de device
  private static getDeviceType(): "MOBILE" | "DESKTOP" | "TABLET" {
    const width = window.innerWidth;
    if (width < 768) return "MOBILE";
    if (width < 1024) return "TABLET";
    return "DESKTOP";
  }

  // Obtenir le modèle du device
  private static getDeviceModel(): string {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('iPhone')) return 'iPhone';
    if (userAgent.includes('iPad')) return 'iPad';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('Windows')) return 'Windows PC';
    if (userAgent.includes('Mac')) return 'Mac';
    if (userAgent.includes('Linux')) return 'Linux';
    
    return 'Unknown Device';
  }

  // Obtenir le nom du système d'exploitation
  private static getOsName(): string {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    
    return 'Unknown OS';
  }

  // Envoyer le code OTP
  static async sendOtp(email: string): Promise<LoginResponse> {
    try {
      const deviceInfo = this.getDeviceInfo();
      const request: LoginRequest = {
        contact: email,
        deviceInfo
      };

      console.log('Envoi OTP avec:', request);

      const response = await fetch(`${this.BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data: LoginResponse = await response.json();
      
      console.log('Réponse OTP:', data);
      
      if (!data.success) {
        throw new Error(data.message || 'Erreur lors de l\'envoi du code');
      }

      // Sauvegarder le temp token
      localStorage.setItem('temp_token', data.data.tempToken);
      
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi OTP:', error);
      throw error;
    }
  }

  // Vérifier le code OTP
  static async verifyOtp(otpCode: string): Promise<VerifyOtpResponse> {
    try {
      const tempToken = localStorage.getItem('temp_token');
      if (!tempToken) {
        throw new Error('Token temporaire non trouvé');
      }

      const deviceInfo = this.getDeviceInfo();
      const request: VerifyOtpRequest = {
        otpCode,
        tempToken,
        deviceInfo
      };

      console.log('Vérification OTP avec:', request);

      const response = await fetch(`${this.BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data: VerifyOtpResponse = await response.json();
      
      console.log('Réponse vérification OTP:', data);
      
      if (!data.success) {
        throw new Error(data.message || 'Code OTP invalide');
      }

      // Sauvegarder les tokens
      localStorage.setItem('access_token', data.data.accessToken);
      localStorage.setItem('refresh_token', data.data.refreshToken);
      localStorage.setItem('user_info', JSON.stringify(data.data.user));
      
      // Nettoyer le temp token
      localStorage.removeItem('temp_token');
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la vérification OTP:', error);
      throw error;
    }
  }

  // Vérifier si l'utilisateur est connecté
  static isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // Obtenir les informations de l'utilisateur
  static getUserInfo() {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  // Obtenir le token d'accès
  static getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Déconnexion
  static logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('temp_token');
  }

  // Rafraîchir le token (si nécessaire)
  static async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('Refresh token non trouvé');
      }

      const response = await fetch(`${this.BASE_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        throw new Error('Erreur lors du rafraîchissement du token');
      }

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('access_token', data.data.accessToken);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      this.logout();
      return false;
    }
  }
}
