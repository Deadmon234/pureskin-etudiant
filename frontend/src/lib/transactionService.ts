// Service pour gérer les transactions PureSkin (authentification projet)
import { apiService } from './api';

export interface Transaction {
  id: number;
  orderId: number;
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  customerEmail: string;
  customerName: string;
  createdAt: string;
  updatedAt: string;
  walletBalance?: number;
  paymentMethodId?: number;
}

export interface TransactionWalletStats {
  totalBalance: number;
  availableBalance: number;
  pendingTransactions: number;
  totalTransactions: number;
  lastUpdated: string;
  accountInfo?: {
    accountId: string;
    publicKey: string;
    provider: string;
  };
}

export const transactionService = {
  // Récupérer les transactions depuis la base de données PureSkin
  async getTransactions(accessToken?: string): Promise<Transaction[]> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Ajouter le token d'authentification du projet si disponible
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      console.log('🔍 Attempting to fetch transactions from PureSkin API...');
      
      // Récupérer toutes les transactions depuis PureSkin
      const response = await fetch('http://localhost:8080/api/admin/payment-methods/transactions', {
        method: 'GET',
        headers: headers
      });
      
      console.log('🔍 Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.warn('⚠️ Authentication failed - using fallback data');
          return this.getDefaultTransactions();
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiResponse = await response.json();
      console.log('🔍 PureSkin Transactions API Response:', apiResponse);
      
      if (apiResponse.success && apiResponse.data) {
        // Transformer les transactions en format Transaction
        const transactions = apiResponse.data || [];
        return transactions.map((transaction: any) => ({
          id: transaction.id,
          orderId: parseInt(transaction.orderNumber) || 0,
          amount: transaction.amount,
          method: transaction.paymentMethod,
          status: this.mapTransactionStatus(transaction.status),
          customerEmail: transaction.customerEmail,
          customerName: this.extractCustomerName(transaction.customerEmail),
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
          walletBalance: undefined // À calculer si nécessaire
        }));
      } else {
        console.warn('⚠️ Unexpected PureSkin API response structure:', apiResponse);
        throw new Error('Structure de réponse API invalide');
      }
    } catch (error) {
      console.error('❌ Error fetching transactions from PureSkin API:', error);
      
      // Fallback vers données mock si l'API échoue
      console.log('🔄 Using fallback transaction data...');
      return this.getDefaultTransactions();
    }
  },

  // Récupérer les statistiques du wallet depuis PureSkin
  async getTransactionStats(accessToken?: string): Promise<TransactionWalletStats> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      console.log('🔍 Attempting to fetch transaction stats from PureSkin API...');

      const response = await fetch('http://localhost:8080/api/admin/payment-methods/overview', {
        method: 'GET',
        headers: headers
      });
      
      console.log('🔍 Transaction stats response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.warn('⚠️ Authentication failed for transaction stats - using fallback data');
          return this.getDefaultTransactionStats();
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiResponse = await response.json();
      console.log('🔍 PureSkin Transaction Stats API Response:', apiResponse);
      
      if (apiResponse.success && apiResponse.data) {
        const stats = apiResponse.data;
        return {
          totalBalance: (stats.totalAmount || 0) + (stats.pendingAmount || 0), // Solde total = complétées + en attente
          availableBalance: stats.totalAmount || 0, // Solde disponible = seulement transactions complétées
          pendingTransactions: stats.pendingAmount || 0, // Montant en attente de retrait/traitement
          totalTransactions: stats.totalTransactions || 0,
          lastUpdated: new Date().toISOString(),
          accountInfo: stats.accountInfo
        };
      } else {
        console.warn('⚠️ Unexpected transaction stats response:', apiResponse);
        throw new Error('Structure de réponse API invalide');
      }
    } catch (error) {
      console.error('❌ Error fetching transaction stats from PureSkin API:', error);
      
      // Fallback vers données par défaut
      console.log('🔄 Using fallback transaction stats...');
      return this.getDefaultTransactionStats();
    }
  },

  // Mapper les statuts de transaction PureSkin vers notre format
  mapTransactionStatus(status: string): 'pending' | 'completed' | 'failed' | 'refunded' {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'completed') return 'completed';
    if (statusLower === 'pending') return 'pending';
    if (statusLower === 'failed') return 'failed';
    if (statusLower === 'refunded') return 'refunded';
    return 'pending'; // Par défaut
  },

  // Extraire le nom du client depuis l'email
  extractCustomerName(email: string): string {
    if (!email) return 'Client inconnu';
    
    const namePart = email.split('@')[0];
    // Remplacer les points et underscores par des espaces et capitaliser
    return namePart.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  },

  // Transactions par défaut (fallback)
  getDefaultTransactions(): Transaction[] {
    return [
      {
        id: 1,
        orderId: 1001,
        amount: 89.99,
        method: "orange_money_cm",
        status: "completed",
        customerEmail: "client1@example.com",
        customerName: "Client1",
        createdAt: "2026-03-06T10:30:00Z",
        updatedAt: "2026-03-06T10:35:00Z",
        walletBalance: 250.50
      },
      {
        id: 2,
        orderId: 1002,
        amount: 45.50,
        method: "stripe",
        status: "pending",
        customerEmail: "client2@example.com",
        customerName: "Client2",
        createdAt: "2026-03-06T11:15:00Z",
        updatedAt: "2026-03-06T11:15:00Z"
      },
      {
        id: 3,
        orderId: 1003,
        amount: 120.00,
        method: "mtn_mobile_money_cm",
        status: "failed",
        customerEmail: "client3@example.com",
        customerName: "Client3",
        createdAt: "2026-03-06T09:45:00Z",
        updatedAt: "2026-03-06T09:50:00Z"
      },
      {
        id: 4,
        orderId: 1004,
        amount: 67.80,
        method: "orange_money_cm",
        status: "completed",
        customerEmail: "client4@example.com",
        customerName: "Client4",
        createdAt: "2026-03-06T08:20:00Z",
        updatedAt: "2026-03-06T08:25:00Z",
        walletBalance: 180.30
      }
    ];
  },

  // Statistiques transaction par défaut (fallback)
  getDefaultTransactionStats(): TransactionWalletStats {
    return {
      totalBalance: 15480.75,
      availableBalance: 12350.25,
      pendingTransactions: 3130.50,
      totalTransactions: 156,
      lastUpdated: new Date().toISOString(),
      accountInfo: {
        accountId: "816ac7c4-f55d-4c90-9772-92ca78e2ab17",
        publicKey: "fk_live_mhZG1htEBgK02jvI5QZqNYTpzgdfFmMCisI8cho4KbxqSD9uq2l6h39XppRSayQVTtAj5pCAjRU",
        provider: "Flutterwave"
      }
    };
  }
};
