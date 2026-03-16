// Service pour gérer les paiements et méthodes de paiement
import { apiService } from './api';

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
  txTva: number;
  txPartner: number;
  withdrawMode: string | null;
  useTieredFees: boolean;
  referenceCurrency: string;
  supportsMultiCurrency: boolean;
  createdAt: string;
  updatedAt: string;
  transactionsCount: number;
  activeTransactionsCount: number;
  active: boolean;
}

export interface Payment {
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

export interface ProjectPayment {
  id: number;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number;
  currency: string;
  paymentMethod?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  paymentReference?: string;
  farotyTransactionId?: string;
  farotyWalletId?: string;
  products: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  createdAt: string;
  processedAt?: string;
}

export interface CreatePaymentRequest {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number; // Amount as number for BigDecimal
  currency: string;
  paymentMethod?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  paymentReference?: string;
  farotyTransactionId?: string;
  farotyWalletId?: string;
  products: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
}

export interface WalletStats {
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

export const paymentService = {
  // Récupérer les méthodes de paiement depuis l'API Faroty avec accessToken
  async getPaymentMethods(accessToken?: string): Promise<PaymentMethod[]> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Ajouter le token d'authentification si disponible
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch('https://api-pay-prod.faroty.me/payments/api/v1/payment-methods', {
        method: 'GET',
        headers: headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiResponse = await response.json();
      
      console.log('🔍 Full API Response:', apiResponse);
      
      // Vérifier la structure de la réponse selon le format attendu
      if (apiResponse.success && apiResponse.data && apiResponse.data.content) {
        const methods = apiResponse.data.content;
        console.log('✅ Payment methods loaded from Faroty API:', methods);
        return methods;
      } else {
        console.warn('⚠️ Unexpected API response structure:', apiResponse);
        throw new Error('Structure de réponse API invalide');
      }
    } catch (error) {
      console.error('❌ Error fetching payment methods from Faroty API:', error);
      
      // Fallback vers méthodes par défaut si l'API échoue
      return this.getDefaultPaymentMethods();
    }
  },

  // Méthodes de paiement par défaut (fallback)
  getDefaultPaymentMethods(): PaymentMethod[] {
    return [
      {
        id: "default-1",
        name: "Carte bancaire",
        slug: "CARD",
        technicalName: "stripe",
        logoUrl: "https://media.faroty.me/api/media/public/87d31f5e-bb18-4f91-b995-d38b1eecd29c.png",
        depositFeeRate: 4.00,
        withdrawalFeeRate: 2.00,
        maxTransactionAmount: 500000.00,
        transactionCooldown: 2,
        txTva: 0.00,
        txPartner: 0.00,
        withdrawMode: null,
        useTieredFees: true,
        referenceCurrency: "USD",
        supportsMultiCurrency: true,
        createdAt: "2026-01-15T00:00:00Z",
        updatedAt: "2026-01-15T00:00:00Z",
        transactionsCount: 339,
        activeTransactionsCount: 240,
        active: true
      },
      {
        id: "default-2",
        name: "Orange Money",
        slug: "OM",
        technicalName: "orange_money_cm",
        logoUrl: "https://media.faroty.me/api/media/public/d2b79305-d31d-4e7e-b9bc-92cb6074c49a.jpg",
        depositFeeRate: 1.95,
        withdrawalFeeRate: 0.00,
        maxTransactionAmount: 500000.00,
        transactionCooldown: 2,
        txTva: 0.19,
        txPartner: 0.02,
        withdrawMode: null,
        useTieredFees: true,
        referenceCurrency: "XAF",
        supportsMultiCurrency: false,
        createdAt: "2026-01-15T00:00:00Z",
        updatedAt: "2026-01-15T00:00:00Z",
        transactionsCount: 193,
        activeTransactionsCount: 92,
        active: true
      },
      {
        id: "default-3",
        name: "MTN Mobile Money",
        slug: "MOMO",
        technicalName: "mtn_mobile_money_cm",
        logoUrl: "https://media.faroty.me/api/media/public/54ffe847-a1a7-4c11-aee1-4c470f976a94.jpg",
        depositFeeRate: 1.95,
        withdrawalFeeRate: 0.00,
        maxTransactionAmount: 500000.00,
        transactionCooldown: 2,
        txTva: 0.00,
        txPartner: 0.00,
        withdrawMode: null,
        useTieredFees: true,
        referenceCurrency: "XAF",
        supportsMultiCurrency: false,
        createdAt: "2026-01-15T00:00:00Z",
        updatedAt: "2026-01-15T00:00:00Z",
        transactionsCount: 218,
        activeTransactionsCount: 106,
        active: true
      }
    ];
  },

  // Récupérer les paiements depuis la base de données PureSkin
  async getPayments(accessToken?: string): Promise<Payment[]> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Ajouter le token d'authentification si disponible
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      console.log('🔍 Attempting to fetch payments from PureSkin API...');
      
      // Récupérer toutes les transactions depuis PureSkin
      const response = await fetch('http://localhost:8080/api/admin/payment-methods/transactions', {
        method: 'GET',
        headers: headers
      });
      
      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response headers:', response.headers);
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.warn('⚠️ Authentication failed - using fallback data');
          return this.getDefaultPayments();
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiResponse = await response.json();
      console.log('🔍 PureSkin Transactions API Response:', apiResponse);
      
      if (apiResponse.success && apiResponse.data) {
        // Transformer les transactions en format Payment
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
      console.error('❌ Error fetching payments from PureSkin API:', error);
      
      // Fallback vers données mock si l'API échoue
      console.log('🔄 Using fallback payment data...');
      return this.getDefaultPayments();
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

  // Récupérer les statistiques du wallet depuis PureSkin
  async getWalletStats(accessToken?: string): Promise<WalletStats> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      console.log('🔍 Attempting to fetch wallet stats from PureSkin API...');

      const response = await fetch('http://localhost:8080/api/admin/payment-methods/overview', {
        method: 'GET',
        headers: headers
      });
      
      console.log('🔍 Wallet stats response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.warn('⚠️ Authentication failed for wallet stats - using fallback data');
          return this.getDefaultWalletStats();
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiResponse = await response.json();
      console.log('🔍 PureSkin Wallet Stats API Response:', apiResponse);
      
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
        console.warn('⚠️ Unexpected wallet stats response:', apiResponse);
        throw new Error('Structure de réponse API invalide');
      }
    } catch (error) {
      console.error('❌ Error fetching wallet stats from PureSkin API:', error);
      
      // Fallback vers données par défaut
      console.log('🔄 Using fallback wallet stats...');
      return this.getDefaultWalletStats();
    }
  },

  // Statistiques wallet par défaut (fallback)
  getDefaultWalletStats(): WalletStats {
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
  },

  // Paiements par défaut (fallback)
  getDefaultPayments(): Payment[] {
    return [
      {
        id: 1,
        orderId: 1001,
        amount: 89.99,
        method: "orange_money_cm",
        status: "completed",
        customerEmail: "client1@example.com",
        customerName: "Jean Dupont",
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
        customerName: "Marie Martin",
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
        customerName: "Pierre Durand",
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
        customerName: "Sophie Lemoine",
        createdAt: "2026-03-06T08:20:00Z",
        updatedAt: "2026-03-06T08:25:00Z",
        walletBalance: 180.30
      }
    ];
  },

  // Créer un paiement dans la base de données du projet
  async createPayment(paymentData: CreatePaymentRequest, accessToken?: string): Promise<ProjectPayment> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      console.log('💳 Creating payment in project database...', paymentData);

      const response = await fetch('http://localhost:8080/api/payments', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Backend error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      const createdPayment = await response.json();
      console.log('✅ Payment created successfully:', createdPayment);
      return createdPayment;
    } catch (error) {
      console.error('❌ Error creating payment:', error);
      throw error;
    }
  },

  // Mettre à jour le statut d'un paiement
  async updatePaymentStatus(orderId: string, status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED', accessToken?: string): Promise<ProjectPayment> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      console.log(`🔄 Updating payment status for order ${orderId} to ${status}`);

      const response = await fetch(`http://localhost:8080/api/payments/${orderId}/status`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedPayment = await response.json();
      console.log('✅ Payment status updated successfully:', updatedPayment);
      return updatedPayment;
    } catch (error) {
      console.error('❌ Error updating payment status:', error);
      throw error;
    }
  },

  // Récupérer les paiements du projet
  async getProjectPayments(accessToken?: string): Promise<ProjectPayment[]> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      console.log('🔍 Fetching project payments...');

      const response = await fetch('http://localhost:8080/api/payments', {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        console.warn(`⚠️ Payments endpoint returned ${response.status}, using fallback...`);
        // Retourner un tableau vide si l'endpoint échoue
        return [];
      }

      const payments = await response.json();
      console.log('✅ Project payments loaded:', payments);
      
      // S'assurer que les paiements sont au bon format
      if (Array.isArray(payments)) {
        return payments.map((payment: any) => ({
          id: payment.id || 0,
          orderId: payment.orderId || payment.paymentReference || `PS-${payment.id}`,
          customerName: payment.customerName || 'Client',
          customerEmail: payment.customerEmail || 'client@example.com',
          customerPhone: payment.customerPhone,
          amount: parseFloat(payment.amount) || 0,
          currency: payment.currency || 'XAF',
          paymentMethod: payment.paymentMethod || 'wallet',
          status: payment.status || 'PENDING',
          paymentReference: payment.paymentReference || payment.orderId,
          products: payment.products || [],
          createdAt: payment.createdAt || new Date().toISOString(),
          processedAt: payment.processedAt
        }));
      } else {
        console.warn('⚠️ Payments response is not an array:', payments);
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching project payments:', error);
      // Retourner un tableau vide en cas d'erreur
      return [];
    }
  },

  // Récupérer les statistiques des paiements du projet
  async getProjectPaymentStats(accessToken?: string): Promise<any> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      console.log('🔍 Fetching project payment stats...');

      const response = await fetch('http://localhost:8080/api/payments/stats', {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        console.warn(`⚠️ Stats endpoint returned ${response.status}, using fallback...`);
        // Retourner des statistiques par défaut si l'endpoint échoue
        return {
          totalTransactions: 0,
          successfulTransactions: 0,
          failedTransactions: 0,
          pendingTransactions: 0,
          totalRevenue: 0,
          successfulRevenue: 0,
          availableBalance: 0,
          totalProductsSold: 0,
          todayTransactions: 0
        };
      }

      const stats = await response.json();
      console.log('✅ Project payment stats loaded:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Error fetching project payment stats:', error);
      // Retourner des statistiques par défaut en cas d'erreur
      return {
        totalTransactions: 0,
        successfulTransactions: 0,
        failedTransactions: 0,
        pendingTransactions: 0,
        totalRevenue: 0,
        successfulRevenue: 0,
        availableBalance: 0,
        totalProductsSold: 0,
        todayTransactions: 0
      };
    }
  },
};
