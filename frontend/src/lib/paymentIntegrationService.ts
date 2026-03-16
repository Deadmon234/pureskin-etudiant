// Service d'intégration pour enregistrer les paiements Faroty dans la base du projet
import { paymentService, CreatePaymentRequest } from './paymentService';
import { farotyTransactionService } from './farotyTransactionService';
import { farotyService } from './farotyService';
import { cartService, CartItem } from './cart';

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
}

export interface PaymentIntegrationRequest {
  customerInfo: CustomerInfo;
  cartItems: CartItem[];
  paymentMethod: string;
  amount: number;
  currency: string;
}

export class PaymentIntegrationService {
  // Générer un ID de commande unique
  private generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `PS-${timestamp}-${random}`;
  }

  // Créer un enregistrement de paiement avant le paiement Faroty
  async createPrePayment(
    customerInfo: CustomerInfo,
    cartItems: CartItem[],
    paymentMethod: string,
    accessToken?: string
  ): Promise<any> {
    try {
      const orderId = this.generateOrderId();
      const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Préparer les produits pour l'API
      const products = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      // Validation des informations client
      if (!customerInfo.email || customerInfo.email.trim() === '') {
        throw new Error('L\'email du client est obligatoire pour créer un paiement');
      }
      if (!customerInfo.name || customerInfo.name.trim() === '') {
        throw new Error('Le nom du client est obligatoire pour créer un paiement');
      }

      const paymentData: CreatePaymentRequest = {
        orderId,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        amount: totalAmount, // Send as number for BigDecimal
        currency: 'XAF',
        paymentMethod,
        status: 'PENDING',
        products
      };

      console.log('💳 Creating pre-payment record...', paymentData);

      // Créer le paiement dans la base du projet
      const createdPayment = await paymentService.createPayment(paymentData, accessToken);

      console.log('✅ Pre-payment created successfully:', createdPayment);

      return {
        success: true,
        payment: createdPayment,
        orderId
      };

    } catch (error) {
      console.error('❌ Error creating pre-payment:', error);
      throw error;
    }
  }

  // Créer une session de paiement Faroty
  async createFarotyPaymentSession(
    customerInfo: CustomerInfo,
    cartItems: CartItem[],
    prePaymentResult: any
  ): Promise<any> {
    try {
      console.log('💳 Creating Faroty payment session...');
      console.log('📦 Cart items received:', JSON.stringify(cartItems, null, 2));

      // Vérifier si les prix sont valides
      const invalidItems = cartItems.filter(item => !item.price || item.price <= 0);
      if (invalidItems.length > 0) {
        console.error('❌ Articles avec prix invalides:', invalidItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price
        })));
        
        // Assigner un prix par défaut pour le test (à remplacer par les vrais prix)
        invalidItems.forEach(item => {
          item.price = 1000; // 1000 XAF par défaut pour le test
          console.warn(`⚠️ Prix par défaut assigné à ${item.name}: ${item.price} XAF`);
        });
      }

      const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Validation du montant
      if (totalAmount <= 0) {
        console.error('❌ Montant invalide - Details des articles:');
        cartItems.forEach((item, index) => {
          console.error(`  Article ${index + 1}:`, {
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
          });
        });
        throw new Error(`Le montant total (${totalAmount} XAF) doit être supérieur à 0. Vérifiez les prix et quantités des articles.`);
      }

      console.log(`🧾 Calcul montant: ${cartItems.length} articles, total: ${totalAmount} XAF`);
      console.log('📋 Articles du panier:', cartItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      })));

      // Créer la session Faroty
      const farotySession = await farotyService.createPaymentSession(
        totalAmount,
        {
          orderId: prePaymentResult.orderId,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          description: `Commande PureSkin - ${cartItems.length} produit(s)`
        }
      );

      console.log('✅ Faroty session created successfully:', farotySession);

      return {
        success: true,
        farotySession,
        orderId: prePaymentResult.orderId
      };

    } catch (error) {
      console.error('❌ Error creating Faroty payment session:', error);
      throw error;
    }
  }

  // Mettre à jour le statut du paiement après le traitement Faroty
  async updatePaymentAfterFaroty(
    orderId: string,
    farotyTransactionId: string,
    status: 'SUCCESS' | 'FAILED' | 'CANCELLED',
    paymentReference?: string,
    accessToken?: string
  ): Promise<any> {
    try {
      console.log(`🔄 Updating payment ${orderId} after Faroty processing...`);
      console.log(`Status: ${status}, Faroty Transaction ID: ${farotyTransactionId}`);

      // Mettre à jour le statut dans la base du projet
      const updatedPayment = await paymentService.updatePaymentStatus(orderId, status, accessToken);

      console.log('✅ Payment updated successfully after Faroty processing:', updatedPayment);

      return {
        success: true,
        payment: updatedPayment
      };

    } catch (error) {
      console.error('❌ Error updating payment after Faroty processing:', error);
      throw error;
    }
  }

  // Processus complet de paiement avec intégration
  async processFullPayment(
    customerInfo: CustomerInfo,
    cartItems: CartItem[],
    paymentMethodSlug: string,
    accessToken?: string
  ): Promise<any> {
    try {
      console.log('🚀 Starting full payment process...');

      // Étape 1: Créer le pré-paiement dans la base du projet
      const prePaymentResult = await this.createPrePayment(
        customerInfo,
        cartItems,
        paymentMethodSlug,
        accessToken
      );

      if (!prePaymentResult.success) {
        throw new Error('Failed to create pre-payment');
      }

      const { orderId, payment } = prePaymentResult;

      // Étape 2: Créer la session de paiement Faroty
      const farotySessionResult = await this.createFarotyPaymentSession(
        customerInfo,
        cartItems,
        prePaymentResult
      );

      if (!farotySessionResult.success) {
        throw new Error('Failed to create Faroty payment session');
      }

      console.log('💳 Faroty payment initiated:', farotySessionResult);

      // Retourner les informations pour la redirection vers le paiement Faroty
      return {
        success: true,
        orderId,
        farotySessionUrl: farotySessionResult.farotySession.data.sessionUrl,
        farotySessionToken: farotySessionResult.farotySession.data.sessionToken,
        payment
      };

    } catch (error) {
      console.error('❌ Error in full payment process:', error);
      
      // En cas d'erreur, marquer le paiement comme échoué si possible
      try {
        if ((error as any).orderId) {
          await this.updatePaymentAfterFaroty(
            (error as any).orderId,
            'unknown',
            'FAILED',
            undefined,
            accessToken
          );
        }
      } catch (updateError) {
        console.error('❌ Error updating payment status after failure:', updateError);
      }

      throw error;
    }
  }

  // Vérifier le statut d'un paiement Faroty et mettre à jour la base du projet
  async checkAndUpdatePaymentStatus(
    orderId: string,
    accessToken?: string
  ): Promise<any> {
    try {
      console.log(`🔍 Checking payment status for order ${orderId}...`);

      // Récupérer le paiement depuis la base du projet pour obtenir le transaction ID Faroty
      const projectPayments = await paymentService.getProjectPayments(accessToken);
      const payment = projectPayments.find(p => p.orderId === orderId);

      if (!payment || !payment.farotyTransactionId) {
        throw new Error('Payment or Faroty transaction ID not found');
      }

      // Vérifier le statut auprès de Faroty
      const farotyStatus = await farotyTransactionService.checkPaymentStatus(payment.farotyTransactionId);

      console.log('📊 Faroty payment status:', farotyStatus);

      // Mapper le statut Faroty vers notre format
      let mappedStatus: 'SUCCESS' | 'FAILED' | 'CANCELLED';
      if (farotyStatus.status === 'completed' || farotyStatus.status === 'success') {
        mappedStatus = 'SUCCESS';
      } else if (farotyStatus.status === 'failed' || farotyStatus.status === 'error') {
        mappedStatus = 'FAILED';
      } else if (farotyStatus.status === 'cancelled') {
        mappedStatus = 'CANCELLED';
      } else {
        // Le statut est encore en traitement, ne pas mettre à jour
        return {
          success: true,
          status: 'PENDING',
          message: 'Payment still processing'
        };
      }

      // Mettre à jour le statut dans la base du projet
      const updatedPayment = await this.updatePaymentAfterFaroty(
        orderId,
        payment.farotyTransactionId,
        mappedStatus,
        farotyStatus.reference,
        accessToken
      );

      return {
        success: true,
        status: mappedStatus,
        payment: updatedPayment,
        farotyStatus
      };

    } catch (error) {
      console.error('❌ Error checking payment status:', error);
      throw error;
    }
  }

  // Obtenir les détails complets d'un paiement
  async getPaymentDetails(orderId: string, accessToken?: string): Promise<any> {
    try {
      const projectPayments = await paymentService.getProjectPayments(accessToken);
      const payment = projectPayments.find(p => p.orderId === orderId);

      if (!payment) {
        throw new Error('Payment not found');
      }

      // Si le paiement a un transaction ID Faroty, récupérer le statut détaillé
      let farotyDetails = null;
      if (payment.farotyTransactionId) {
        try {
          farotyDetails = await farotyTransactionService.checkPaymentStatus(payment.farotyTransactionId);
        } catch (error) {
          console.warn('⚠️ Could not fetch Faroty details:', error);
        }
      }

      return {
        payment,
        farotyDetails
      };

    } catch (error) {
      console.error('❌ Error getting payment details:', error);
      throw error;
    }
  }
}

// Exporter une instance singleton
export const paymentIntegrationService = new PaymentIntegrationService();
