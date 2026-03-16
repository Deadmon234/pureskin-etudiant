export interface FarotySessionRequest {
  walletId: string;
  currencyCode: string;
  cancelUrl: string;
  successUrl: string;
  type: "DEPOSIT" | "WITHDRAWAL";
  amount: number;
  contentType: "CAMPAIGN_SIMPLE";
  dynamicContentData: {
    title: string;
    description: string;
    target: string;
    imageUrl: string;
  };
}

export interface FarotySessionResponse {
  success: boolean;
  message: string;
  statusCode: number;
  timestamp: string;
  data: {
    sessionToken: string;
    sessionUrl: string;
  };
  pagination: null;
  metadata: null;
}

export interface FarotyWithdrawalRequest {
  walletId: string;
  currencyCode: string;
  type: "WITHDRAWAL";
  amount: number;
  refId: string; // ID de référence pour le retrait
}

export interface FarotyAuthRequest {
  phoneNumber: string;
  otp?: string;
}

export interface FarotyAuthResponse {
  success: boolean;
  data: {
    token: string;
    refreshToken: string;
    expiresIn: number;
  };
}

class FarotyService {
  private readonly baseUrl = "https://api-pay-prod.faroty.me/payments/api/v1";
  private readonly apiKey = "fk_live_mhZG1htEBgK02jvI5QZqNYTpzgdfFmMCisI8cho4KbxqSD9uq2l6h39XppRSayQVTtAj5pCAjRU";
  private readonly walletId = "9c3cdf3b-ff0b-44d9-8aa0-4e638c88f660";

  // Créer une session de paiement Faroty
  async createPaymentSession(
    amount: number,
    orderData: {
      orderId: string;
      customerName: string;
      customerEmail: string;
      description?: string;
    }
  ): Promise<FarotySessionResponse> {
    // Validation du montant
    if (amount <= 0) {
      throw new Error(`Le montant (${amount} XAF) doit être supérieur à 0 pour créer une session de paiement Faroty.`);
    }

    console.log(`💳 Création session Faroty: ${amount} XAF pour commande ${orderData.orderId}`);

    const requestData: FarotySessionRequest = {
      walletId: this.walletId,
      currencyCode: "XAF",
      cancelUrl: `${window.location.origin}/payment/cancel?orderId=${orderData.orderId}`,
      successUrl: `${window.location.origin}/payment/success?orderId=${orderData.orderId}`,
      type: "DEPOSIT",
      amount,
      contentType: "CAMPAIGN_SIMPLE",
      dynamicContentData: {
        title: `Paiement PureSkin - ${orderData.customerName}`,
        description: orderData.description || `Paiement de la commande ${orderData.orderId}`,
        target: `${amount.toLocaleString()} XAF`,
        imageUrl: "https://media.faroty.me/api/media/public/c3e256db-6c97-48a7-8e8d-f2ba1d568727.jpg"
      }
    };

    try {
      const response = await fetch(`${this.baseUrl}/payment-sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": this.apiKey,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Faroty API error: ${response.status} - ${errorText}`);
      }

      const data: FarotySessionResponse = await response.json();
      
      if (data.success && data.data.sessionUrl) {
        // Ouvrir l'URL de session dans un nouvel onglet
        console.log('✅ Session Faroty créée:', data);
        window.open(data.data.sessionUrl, "_blank");
      } else {
        throw new Error('Session Faroty non valide ou URL manquante');
      }

      return data;
    } catch (error) {
      console.error("Error creating Faroty payment session:", error);
      throw error;
    }
  }

  // Initialiser l'authentification OTP pour le retrait
  async initiateWithdrawalAuth(phoneNumber: string): Promise<FarotyAuthResponse> {
    const requestData: FarotyAuthRequest = {
      phoneNumber,
    };

    try {
      const response = await fetch(`${this.baseUrl}/auth/otp/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": this.apiKey,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Faroty auth error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error initiating Faroty auth:", error);
      throw error;
    }
  }

  // Valider l'OTP et obtenir le token
  async validateOtp(phoneNumber: string, otp: string): Promise<FarotyAuthResponse> {
    const requestData: FarotyAuthRequest = {
      phoneNumber,
      otp,
    };

    try {
      const response = await fetch(`${this.baseUrl}/auth/otp/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": this.apiKey,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Faroty OTP validation error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error validating OTP:", error);
      throw error;
    }
  }

  // Créer une session de retrait
  async createWithdrawalSession(
    amount: number,
    authToken: string
  ): Promise<FarotySessionResponse> {
    const requestData: FarotyWithdrawalRequest = {
      walletId: this.walletId,
      currencyCode: "XAF",
      type: "WITHDRAWAL",
      amount,
      refId: "c173d45d-4787-4f52-8e46-d7320ea43a76",
    };

    try {
      const response = await fetch(`${this.baseUrl}/payment-sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": this.apiKey,
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Faroty withdrawal error: ${response.status} - ${errorText}`);
      }

      const data: FarotySessionResponse = await response.json();
      
      if (data.success && data.data.sessionUrl) {
        // Ouvrir l'URL de session dans un nouvel onglet
        window.open(data.data.sessionUrl, "_blank");
      }

      return data;
    } catch (error) {
      console.error("Error creating Faroty withdrawal session:", error);
      throw error;
    }
  }

  // Vérifier le statut d'une session de paiement
  async checkSessionStatus(sessionToken: string): Promise<any> {
    try {
      // Encoder le sessionToken pour l'URL
      const encodedToken = encodeURIComponent(sessionToken);
      console.log(`🔍 Vérification statut session: ${sessionToken}`);
      
      const response = await fetch(`${this.baseUrl}/payment-sessions/${encodedToken}/status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": this.apiKey,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Erreur statut session Faroty: ${response.status} - ${errorText}`);
        
        // Si l'endpoint n'existe pas, retourner un statut par défaut
        if (response.status === 500 || response.status === 404) {
          console.warn(`⚠️ Endpoint de statut indisponible, utilisation du statut par défaut`);
          return {
            success: true,
            status: "UNKNOWN",
            message: "Statut de session non vérifiable"
          };
        }
        
        throw new Error(`Faroty status check error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Statut session récupéré:', result);
      return result;
    } catch (error) {
      console.error("Error checking session status:", error);
      // En cas d'erreur, retourner un statut par défaut pour ne pas bloquer le processus
      return {
        success: true,
        status: "UNKNOWN",
        message: "Vérification de statut impossible"
      };
    }
  }
}

export const farotyService = new FarotyService();
