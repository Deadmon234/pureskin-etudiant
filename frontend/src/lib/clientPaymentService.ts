// Service pour gérer les paiements client et les synchroniser avec l'admin
export interface ClientPayment {
  id: string;
  transactionId: string;
  sessionToken: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  amount: number;
  currency: string;
  paymentMethod: string;
  customerEmail?: string;
  customerName?: string;
  orderId?: string;
  createdAt: string;
  updatedAt: string;
  synced?: boolean; // Pour savoir si c'est synchronisé avec l'admin
}

export const clientPaymentService = {
  // Traiter le succès de paiement depuis l'URL de redirection
  processPaymentSuccess(urlParams: URLSearchParams): ClientPayment | null {
    try {
      const transactionId = urlParams.get('transactionId');
      const sessionToken = urlParams.get('sessionToken');
      const status = urlParams.get('status');

      if (!transactionId || !sessionToken || status !== 'SUCCESS') {
        return null;
      }

      // Générer un ID unique pour éviter les duplications
      const uniqueId = `client_${transactionId}_${Date.now()}`;

      const payment: ClientPayment = {
        id: uniqueId, // ID unique avec timestamp
        transactionId,
        sessionToken,
        status: 'SUCCESS',
        amount: 0, // Sera récupéré depuis le localStorage
        currency: 'XAF',
        paymentMethod: 'unknown', // Sera récupéré depuis le localStorage
        customerEmail: '',
        customerName: '',
        orderId: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Récupérer les détails depuis le localStorage
      const paymentData = localStorage.getItem('current_payment_data');
      if (paymentData) {
        const data = JSON.parse(paymentData);
        payment.amount = data.amount || 0;
        payment.paymentMethod = data.paymentMethod || 'unknown';
        payment.customerEmail = data.customerEmail || '';
        payment.customerName = data.customerName || '';
        payment.orderId = data.orderId || '';
      }

      console.log('✅ Paiement client traité:', payment);
      return payment;
    } catch (error) {
      console.error('❌ Erreur traitement paiement client:', error);
      return null;
    }
  },

  // Sauvegarder le paiement client pour synchronisation admin
  async savePaymentForAdmin(payment: ClientPayment): Promise<void> {
    try {
      // Récupérer les paiements existants
      const existingPayments = this.getClientPayments();
      
      // Vérifier si ce paiement (par transactionId) existe déjà
      const existingPayment = existingPayments.find(p => 
        p.transactionId === payment.transactionId || 
        p.sessionToken === payment.sessionToken
      );
      
      if (existingPayment) {
        console.log('ℹ️ Paiement déjà existant, mise à jour...');
        // Mettre à jour le paiement existant au lieu d'en créer un nouveau
        const updatedPayments = existingPayments.map(p => 
          (p.transactionId === payment.transactionId || p.sessionToken === payment.sessionToken)
            ? { ...payment, id: p.id } // Garder l'ID existant mais mettre à jour les autres données
            : p
        );
        localStorage.setItem('client_payments', JSON.stringify(updatedPayments));
      } else {
        // Ajouter le nouveau paiement
        existingPayments.push(payment);
        localStorage.setItem('client_payments', JSON.stringify(existingPayments));
        console.log('✅ Nouveau paiement sauvegardé pour synchronisation admin:', payment.id);
      }
    } catch (error) {
      console.error('❌ Erreur sauvegarde paiement admin:', error);
    }
  },

  // Récupérer tous les paiements client
  getClientPayments(): ClientPayment[] {
    try {
      const payments = localStorage.getItem('client_payments');
      return payments ? JSON.parse(payments) : [];
    } catch (error) {
      console.error('❌ Erreur récupération paiements client:', error);
      return [];
    }
  },

  // Récupérer les paiements non synchronisés avec l'admin
  getUnsyncedPayments(): ClientPayment[] {
    const payments = this.getClientPayments();
    return payments.filter(p => !p.synced);
  },

  // Marquer un paiement comme synchronisé
  markAsSynced(paymentId: string): void {
    try {
      const payments = this.getClientPayments();
      const updatedPayments = payments.map(p => 
        p.id === paymentId ? { ...p, synced: true } : p
      );
      localStorage.setItem('client_payments', JSON.stringify(updatedPayments));
    } catch (error) {
      console.error('❌ Erreur marquage synchronisation:', error);
    }
  },

  // Nettoyer les anciens paiements
  cleanupOldPayments(daysOld: number = 30): void {
    try {
      const payments = this.getClientPayments();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const filteredPayments = payments.filter(p => 
        new Date(p.createdAt) > cutoffDate
      );
      
      localStorage.setItem('client_payments', JSON.stringify(filteredPayments));
      console.log(`🧹 Nettoyage ${payments.length - filteredPayments.length} anciens paiements`);
    } catch (error) {
      console.error('❌ Erreur nettoyage paiements:', error);
    }
  }
};
