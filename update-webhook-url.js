// Script pour mettre à jour l'URL du webhook Faroty

const WEBHOOK_ID = "d4c411c0-fc50-4d56-a3a5-21c47a26cc66";
const API_KEY = "fk_live_mhZG1htEBgK02jvI5QZqNYTpzgdfFmMCisI8cho4KbxqSD9uq2l6h39XppRSayQVTtAj5pCAjRU";
const ACCOUNT_ID = "816ac7c4-f55d-4c90-9772-92ca78e2ab17";

// URL de votre webhook backend
const WEBHOOK_URL = "http://localhost:8080/api/webhooks/faroty/payment";

async function updateWebhookUrl() {
  try {
    console.log('🔄 Mise à jour URL webhook Faroty...');
    console.log('Webhook ID:', WEBHOOK_ID);
    console.log('Account ID:', ACCOUNT_ID);
    console.log('Nouvelle URL:', WEBHOOK_URL);

    const url = `https://api-pay-prod.faroty.me/payments/api/v1/webhooks/${WEBHOOK_ID}`;
    
    const requestBody = {
      url: WEBHOOK_URL
    };

    console.log('URL de la requête:', url);
    console.log('Corps de la requête:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Account-ID': ACCOUNT_ID,
        'X-API-KEY': API_KEY
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Status de la réponse:', response.status);
    console.log('Status Text:', response.statusText);

    const data = await response.json();
    console.log('Réponse:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('✅ URL webhook mise à jour avec succès !');
      console.log('Nouvelle URL:', WEBHOOK_URL);
    } else {
      console.error('❌ Erreur lors de la mise à jour:', data);
    }

  } catch (error) {
    console.error('❌ Erreur réseau:', error);
  }
}

// Exécuter la mise à jour
updateWebhookUrl();
