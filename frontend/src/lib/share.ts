import { Product } from './api';

export class ShareService {
  // Partager un produit sur WhatsApp
  shareOnWhatsApp(product: Product, currentUrl?: string): void {
    if (typeof window === 'undefined') return;
    
    const productUrl = currentUrl || `${window.location.origin}/products/${product.id}`;
    
    // Créer le message de partage
    const message = this.createShareMessage(product, productUrl);
    
    // Encoder le message pour l'URL
    const encodedMessage = encodeURIComponent(message);
    
    // Créer l'URL WhatsApp
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    // Ouvrir WhatsApp dans un nouvel onglet
    window.open(whatsappUrl, '_blank');
  }

  // Créer le message de partage
  private createShareMessage(product: Product, productUrl: string): string {
    const message = `🌿 *${product.name}* - PureSkin\n\n` +
      `💰 Prix: ${product.price.toFixed(2)} €\n` +
      `📝 ${product.description}\n\n` +
      `🛒 Découvrez ce produit sur PureSkin:\n` +
      `${productUrl}\n\n` +
      `✨ Produits naturels pour les étudiants ✨`;
    
    return message;
  }

  // Partager avec l'API Web Share (si supportée)
  async shareProduct(product: Product, currentUrl?: string): Promise<boolean> {
    if (typeof window === 'undefined' || !navigator.share) {
      return false;
    }
    
    try {
      const productUrl = currentUrl || `${window.location.origin}/products/${product.id}`;
      
      await navigator.share({
        title: product.name,
        text: product.description,
        url: productUrl
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      return false;
    }
  }

  // Copier le lien du produit dans le presse-papiers
  async copyProductLink(product: Product, currentUrl?: string): Promise<boolean> {
    if (typeof window === 'undefined' || !navigator.clipboard) {
      return false;
    }
    
    try {
      const productUrl = currentUrl || `${window.location.origin}/products/${product.id}`;
      await navigator.clipboard.writeText(productUrl);
      return true;
    } catch (error) {
      console.error('Erreur lors de la copie du lien:', error);
      return false;
    }
  }
}

export const shareService = new ShareService();
