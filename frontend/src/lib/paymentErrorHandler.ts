export class PaymentErrorHandler {
  static handleFarotyError(error: any): { shouldContinue: boolean; message?: string } {
    const errorString = error.toString();
    
    // Erreurs de statut de session - ne pas bloquer le processus
    if (errorString.includes('Faroty status check error')) {
      console.warn('⚠️ Erreur de vérification de statut Faroty, continuation du processus...');
      return { shouldContinue: true };
    }
    
    // Erreurs 500/404 sur les endpoints Faroty - utiliser fallback
    if (errorString.includes('500') || errorString.includes('404')) {
      console.warn('⚠️ Endpoint Faroty indisponible, utilisation du fallback...');
      return { shouldContinue: true };
    }
    
    // Erreurs de validation - bloquer le processus
    if (errorString.includes('VALIDATION_ERROR') || errorString.includes('montant')) {
      console.error('❌ Erreur de validation Faroty:', error);
      return { 
        shouldContinue: false, 
        message: 'Erreur de validation: ' + errorString 
      };
    }
    
    // Autres erreurs - logger mais continuer
    console.error('❌ Erreur Faroty non critique:', error);
    return { shouldContinue: true };
  }
  
  static handleOrderError(error: any): { shouldContinue: boolean; message?: string } {
    const errorString = error.toString();
    
    // Commande non trouvée - créer localement
    if (errorString.includes('404')) {
      console.warn('⚠️ Commande non trouvée dans le backend, création locale...');
      return { shouldContinue: true };
    }
    
    // Erreur de connexion backend - fallback local
    if (errorString.includes('fetch') || errorString.includes('ECONNREFUSED')) {
      console.warn('⚠️ Backend indisponible, utilisation du mode local...');
      return { shouldContinue: true };
    }
    
    // Erreurs critiques - bloquer
    console.error('❌ Erreur commande critique:', error);
    return { 
      shouldContinue: false, 
      message: 'Erreur lors du traitement de votre commande: ' + errorString 
    };
  }
}
