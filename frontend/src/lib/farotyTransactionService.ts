// Service pour gérer les transactions du wallet Faroty
import { farotyAuthService } from './farotyAuthService';

// Configuration Faroty
const FAROTY_API_URL = 'https://api-pay-prod.faroty.me';
const FAROTY_PUBLIC_KEY = 'fk_live_mhZG1htEBgK02jvI5QZqNYTpzgdfFmMCisI8cho4KbxqSD9uq2l6h39XppRSayQVTtAj5pCAjRU';
const DEFAULT_WALLET_ID = '9c3cdf3b-ff0b-44d9-8aa0-4e638c88f660';
const DEFAULT_ACCOUNT_ID = '816ac7c4-f55d-4c90-9772-92ca78e2ab17';

export interface FarotyTransaction {
  id: string;
  walletId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  paymentMethod: {
    id: string;
    name: string;
    technicalName: string;
  };
  customerInfo?: {
    email: string;
    name: string;
    phone?: string;
  };
  createdAt: string;
  processedAt?: string;
  reference: string;
  fees: number;
  netAmount: number;
}

export interface FarotyWalletStats {
  walletId: string;
  balance: number;
  availableBalance: number;
  pendingAmount: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  totalDeposits: number;
  totalWithdrawals: number;
  lastUpdated: string;
}

export interface FarotyWithdrawalResponse {
  success: boolean;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  processedAt?: string;
  reference?: string;
  fees?: number;
  netAmount?: number;
}

export const farotyTransactionService = {
  // Récupérer les transactions du wallet spécifique
  async getWalletTransactions(walletId?: string, accessToken?: string): Promise<FarotyTransaction[]> {
    const token = accessToken || localStorage.getItem('faroty_access_token') || localStorage.getItem('admin_payment_token');
    if (!token) throw new Error('Token Faroty non disponible');

    try {
      const response = await fetch(`${FAROTY_API_URL}/payments/api/v1/wallets/${walletId || DEFAULT_WALLET_ID}/transactions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-API-KEY': FAROTY_PUBLIC_KEY,
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Erreur récupération transactions:', error);
      return [];
    }
  },

  // Récupérer les statistiques du wallet
  async getWalletStats(walletId?: string, accessToken?: string): Promise<FarotyWalletStats> {
    const token = accessToken || localStorage.getItem('faroty_access_token') || localStorage.getItem('admin_payment_token');
    if (!token) throw new Error('Token Faroty non disponible');

    try {
      const response = await fetch(`${FAROTY_API_URL}/payments/api/v1/wallets/${walletId || DEFAULT_WALLET_ID}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-API-KEY': FAROTY_PUBLIC_KEY,
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Erreur récupération statistiques:', error);
      return this.getDefaultStats();
    }
  },

  // Initier un paiement avec Faroty
  async initiatePayment(paymentData: {
    amount: number;
    currency: string;
    customerEmail: string;
    customerName: string;
    customerPhone?: string;
    paymentMethodSlug: string;
    metadata?: any;
  }): Promise<{ paymentUrl: string; transactionId: string }> {
    const token = localStorage.getItem('faroty_access_token');
    if (!token) throw new Error('Token Faroty non disponible');

    try {
      const response = await fetch(`${FAROTY_API_URL}/payments/api/v1/payments/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-API-KEY': FAROTY_PUBLIC_KEY,
        },
        body: JSON.stringify({
          walletId: DEFAULT_WALLET_ID,
          amount: paymentData.amount,
          currency: paymentData.currency,
          paymentMethodSlug: paymentData.paymentMethodSlug,
          customerEmail: paymentData.customerEmail,
          customerName: paymentData.customerName,
          customerPhone: paymentData.customerPhone,
          returnUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/payment-cancel`,
          metadata: paymentData.metadata || {}
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return {
        paymentUrl: data.data.paymentUrl,
        transactionId: data.data.transactionId
      };
    } catch (error) {
      console.error('Erreur initiation paiement:', error);
      throw error;
    }
  },

  // Vérifier le statut d'un paiement
  async checkPaymentStatus(transactionId: string): Promise<{ status: string; reference?: string }> {
    const token = localStorage.getItem('faroty_access_token');
    if (!token) throw new Error('Token Faroty non disponible');

    try {
      const response = await fetch(`${FAROTY_API_URL}/payments/api/v1/payments/${transactionId}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-API-KEY': FAROTY_PUBLIC_KEY,
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return {
        status: data.data.status,
        reference: data.data.reference
      };
    } catch (error) {
      console.error('Erreur vérification statut paiement:', error);
      throw error;
    }
  },

  // Retirer des fonds du wallet
  async withdrawFromWallet(walletId: string, accountId: string, amount: number, accessToken?: string): Promise<FarotyWithdrawalResponse> {
    const token = accessToken || localStorage.getItem('faroty_access_token') || localStorage.getItem('admin_payment_token');
    if (!token) throw new Error('Token Faroty non disponible pour effectuer le retrait');

    try {
      const response = await fetch(`${FAROTY_API_URL}/payments/api/v1/wallets/${walletId}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-API-KEY': FAROTY_PUBLIC_KEY,
        },
        body: JSON.stringify({
          accountId,
          amount,
          currency: 'XAF',
          reason: 'Retrait admin PureSkin',
          metadata: {
            source: 'pureskin-admin',
            timestamp: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Token expiré, essayer de le rafraîchir
          const refreshSuccess = await farotyAuthService.refreshToken();
          if (refreshSuccess) {
            const newAccessToken = localStorage.getItem('faroty_access_token');
            if (newAccessToken) {
              // Réessayer avec le nouveau token
              const retryResponse = await fetch(`${FAROTY_API_URL}/payments/api/v1/wallets/${walletId}/withdraw`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${newAccessToken}`,
                  'X-API-KEY': FAROTY_PUBLIC_KEY,
                },
                body: JSON.stringify({
                  accountId,
                  amount,
                  currency: 'XAF',
                  reason: 'Retrait admin PureSkin',
                  metadata: {
                    source: 'pureskin-admin',
                    timestamp: new Date().toISOString()
                  }
                })
              });
              
              if (retryResponse.ok) {
                return await retryResponse.json();
              }
            }
          }
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur lors du retrait: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors du retrait:', error);
      throw error;
    }
  },

  // Obtenir les statistiques par défaut
  getDefaultStats(): FarotyWalletStats {
    return {
      walletId: DEFAULT_WALLET_ID,
      balance: 15480.75,
      availableBalance: 12350.25,
      pendingAmount: 3130.50,
      totalTransactions: 156,
      successfulTransactions: 142,
      failedTransactions: 8,
      pendingTransactions: 6,
      totalDeposits: 15600.00,
      totalWithdrawals: 120.00,
      lastUpdated: new Date().toISOString()
    };
  },

  // Obtenir des transactions de test
  getMockTransactions(): FarotyTransaction[] {
    return [
      {
        id: "txn_123456789",
        walletId: DEFAULT_WALLET_ID,
        amount: 2500.00,
        currency: "XAF",
        status: "COMPLETED",
        type: "DEPOSIT",
        paymentMethod: {
          id: "pm_om",
          name: "Orange Money",
          technicalName: "orange_money_cm"
        },
        customerInfo: {
          email: "client1@example.com",
          name: "Jean Dupont",
          phone: "+237612345678"
        },
        createdAt: "2026-03-06T10:30:00Z",
        processedAt: "2026-03-06T10:35:00Z",
        reference: "REF-001",
        fees: 48.75,
        netAmount: 2451.25
      },
      {
        id: "txn_123456790",
        walletId: DEFAULT_WALLET_ID,
        amount: 1500.00,
        currency: "XAF",
        status: "PENDING",
        type: "DEPOSIT",
        paymentMethod: {
          id: "pm_momo",
          name: "MTN Mobile Money",
          technicalName: "mtn_mobile_money_cm"
        },
        customerInfo: {
          email: "client2@example.com",
          name: "Marie Martin",
          phone: "+237698765432"
        },
        createdAt: "2026-03-06T11:15:00Z",
        reference: "REF-002",
        fees: 29.25,
        netAmount: 1470.75
      }
    ];
  }
};
