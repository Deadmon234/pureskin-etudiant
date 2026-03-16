import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Webhook secret pour vérifier la signature
const WEBHOOK_SECRET = 'whs_mGj5QgRlqgrFL8puchO-ZMk7QrXNbT1TYSxYAg';

interface WebhookPayload {
  event: string;
  data: {
    sessionId: string;
    walletId: string;
    amount: number;
    currency: string;
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
    timestamp: string;
    userId?: string;
    metadata?: any;
  };
  signature: string;
}

export async function POST(request: NextRequest) {
  try {
    // Récupérer le corps de la requête
    const body = await request.text();
    const payload: WebhookPayload = JSON.parse(body);

    // Vérifier la signature du webhook
    const signature = request.headers.get('x-webhook-signature');
    if (!signature) {
      console.error('Webhook: Signature manquante');
      return NextResponse.json(
        { error: 'Signature manquante' },
        { status: 400 }
      );
    }

    // Calculer la signature attendue
    const expectedSignature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    // Vérifier si la signature correspond
    if (signature !== expectedSignature) {
      console.error('Webhook: Signature invalide');
      return NextResponse.json(
        { error: 'Signature invalide' },
        { status: 401 }
      );
    }

    console.log('Webhook reçu:', payload);

    // Traiter l'événement selon son type
    switch (payload.event) {
      case 'payment.completed':
        await handlePaymentCompleted(payload.data);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(payload.data);
        break;
      
      case 'payment.pending':
        await handlePaymentPending(payload.data);
        break;
      
      default:
        console.log(`Événement non géré: ${payload.event}`);
    }

    // Retourner une réponse de succès
    return NextResponse.json(
      { 
        success: true, 
        message: 'Webhook traité avec succès',
        received: new Date().toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur lors du traitement du webhook:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur lors du traitement du webhook',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

// Gérer un paiement réussi
async function handlePaymentCompleted(data: WebhookPayload['data']) {
  console.log(`Paiement réussi: ${data.sessionId}`);
  
  // Ici, vous pouvez :
  // 1. Mettre à jour le statut de la commande en base de données
  // 2. Envoyer un email de confirmation
  // 3. Mettre à jour les stocks
  // 4. Créer un historique de transaction
  
  // Exemple : Mettre à jour une commande (simulation)
  const orderData = {
    sessionId: data.sessionId,
    walletId: data.walletId,
    amount: data.amount,
    currency: data.currency,
    status: 'PAYÉ',
    paidAt: new Date().toISOString(),
    userId: data.userId
  };

  // Sauvegarder en base de données (à implémenter)
  console.log('Commande mise à jour:', orderData);

  // Envoyer une notification (à implémenter)
  await sendPaymentNotification(data, 'success');
}

// Gérer un paiement échoué
async function handlePaymentFailed(data: WebhookPayload['data']) {
  console.log(`Paiement échoué: ${data.sessionId}`);
  
  // Ici, vous pouvez :
  // 1. Mettre à jour le statut de la commande
  // 2. Envoyer un email d'échec
  // 3. Notifier l'utilisateur
  
  const orderData = {
    sessionId: data.sessionId,
    walletId: data.walletId,
    amount: data.amount,
    currency: data.currency,
    status: 'ÉCHOUÉ',
    failedAt: new Date().toISOString(),
    userId: data.userId
  };

  console.log('Commande mise à jour (échec):', orderData);
  await sendPaymentNotification(data, 'failed');
}

// Gérer un paiement en attente
async function handlePaymentPending(data: WebhookPayload['data']) {
  console.log(`Paiement en attente: ${data.sessionId}`);
  
  // Ici, vous pouvez :
  // 1. Mettre à jour le statut de la commande
  // 2. Envoyer une notification
  
  const orderData = {
    sessionId: data.sessionId,
    walletId: data.walletId,
    amount: data.amount,
    currency: data.currency,
    status: 'EN ATTENTE',
    pendingAt: new Date().toISOString(),
    userId: data.userId
  };

  console.log('Commande mise à jour (attente):', orderData);
  await sendPaymentNotification(data, 'pending');
}

// Envoyer une notification de paiement (simulation)
async function sendPaymentNotification(data: WebhookPayload['data'], status: 'success' | 'failed' | 'pending') {
  // Ici, vous pouvez implémenter l'envoi d'email ou de notification push
  console.log(`Notification ${status} envoyée pour:`, {
    sessionId: data.sessionId,
    userId: data.userId,
    amount: data.amount
  });
}

// Endpoint GET pour vérifier que le webhook est actif
export async function GET() {
  return NextResponse.json({
    status: 'Webhook actif',
    timestamp: new Date().toISOString(),
    service: 'PureSkin Payment Webhook'
  });
}
