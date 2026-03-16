// Service de paiement Faroty

export interface WalletCreationRequest {
  accountId: string;
  currencyCode: string;
  walletType: "PERSONAL" | "BUSINESS";
  legalIdentifier: string;
  refId: string;
}

export interface WalletCreationResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    accountId: string;
    currencyCode: string;
    walletType: string;
    legalIdentifier: string;
    refId: string;
    balance: number;
    status: string;
    createdAt: string;
  };
}

export interface PaymentSessionRequest {
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

export interface PaymentSessionResponse {
  success: boolean;
  message: string;
  statusCode: number;
  timestamp: string;
  data: {
    sessionToken: string;
    sessionUrl: string;
  };
}

export class FarotyPaymentService {
  private static readonly BASE_URL = "https://api-pay-prod.faroty.me/payments/api/v1";
  private static readonly ACCOUNT_ID = "816ac7c4-f55d-4c90-9772-92ca78e2ab17";
  private static readonly API_KEY = "fk_live_mhZG1htEBgK02jvI5QZqNYTpzgdfFmMCisI8cho4KbxqSD9uq2l6h39XppRSayQVTtAj5pCAjRU";
  private static readonly WEBHOOK_ID = "d4c411c0-fc50-4d56-a3a5-21c47a26cc66";

  // Créer un wallet pour l'utilisateur
  static async createWallet(userId: string, legalIdentifier: string): Promise<WalletCreationResponse> {
    try {
      const request: WalletCreationRequest = {
        accountId: this.ACCOUNT_ID,
        currencyCode: "XAF",
        walletType: "PERSONAL",
        legalIdentifier,
        refId: userId
      };

      console.log('Création wallet avec:', request);

      const response = await fetch(`${this.BASE_URL}/wallets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.API_KEY,
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data: WalletCreationResponse = await response.json();
      
      console.log('Réponse création wallet:', data);
      
      if (!data.success) {
        throw new Error(data.message || 'Erreur lors de la création du wallet');
      }

      // Sauvegarder l'ID du wallet
      localStorage.setItem('wallet_id', data.data.id);
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la création du wallet:', error);
      throw error;
    }
  }

  // Créer une session de paiement
  static async createPaymentSession(
    walletId: string, 
    amount: number, 
    cancelUrl: string, 
    successUrl: string
  ): Promise<PaymentSessionResponse> {
    try {
      const request: PaymentSessionRequest = {
        walletId,
        currencyCode: "XAF",
        cancelUrl,
        successUrl,
        type: "DEPOSIT",
        amount,
        contentType: "CAMPAIGN_SIMPLE",
        dynamicContentData: {
          title: "Commande PureSkin Étudiant",
          description: "Paiement sécurisé pour vos produits de soin",
          target: `${amount} XAF`,
          imageUrl: "https://media.faroty.me/api/media/public/c3e256db-6c97-48a7-8e8d-f2ba1d568727.jpg"
        }
      };

      console.log('Création session paiement avec:', request);

      const response = await fetch(`${this.BASE_URL}/payment-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.API_KEY,
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data: PaymentSessionResponse = await response.json();
      
      console.log('Réponse création session:', data);
      
      if (!data.success) {
        throw new Error(data.message || 'Erreur lors de la création de la session');
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la création de la session:', error);
      throw error;
    }
  }

  // Mettre à jour l'URL du webhook
  static async updateWebhookUrl(webhookUrl: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}/webhooks/${this.WEBHOOK_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Account-ID': this.ACCOUNT_ID,
          'X-API-KEY': this.API_KEY,
        },
        body: JSON.stringify({ url: webhookUrl })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Webhook mis à jour:', data);
      
      return data.success;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du webhook:', error);
      return false;
    }
  }

  // Obtenir l'ID du wallet sauvegardé
  static getWalletId(): string | null {
    return localStorage.getItem('wallet_id');
  }

  // Vérifier si l'utilisateur a un wallet
  static hasWallet(): boolean {
    return !!this.getWalletId();
  }

  // Rediriger vers la page de paiement
  static redirectToPayment(sessionUrl: string): void {
    window.location.href = sessionUrl;
  }

  // Calculer le montant total pour le paiement
  static calculatePaymentAmount(cartTotal: number): number {
    // Convertir en XAF (taux approximatif : 1 EUR = 655 XAF)
    return Math.round(cartTotal * 655);
  }

  // Générer les URLs de retour
  static generateReturnUrls(): { cancelUrl: string; successUrl: string } {
    const baseUrl = window.location.origin;
    
    return {
      cancelUrl: `${baseUrl}/payment/cancel`,
      successUrl: `${baseUrl}/payment/success`
    };
  }
}
