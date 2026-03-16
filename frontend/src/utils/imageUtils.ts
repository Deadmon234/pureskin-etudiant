// Utilitaire pour gérer les URLs des images de produits
export const getProductImageUrl = (product?: any): string | null => {
  // Si c'est une chaîne de caractères directe (ancien usage)
  if (typeof product === 'string') {
    if (!product) return null;
    if (product.startsWith('http')) return product;
    if (product.startsWith('/api/admin/products/images/')) return product;
    return null;
  }

  // Si c'est un objet produit
  if (!product) return null;

  // Prioriser imageUrl, sinon utiliser image
  let imageUrl = product.imageUrl || product.image;
  
  if (!imageUrl) return null;

  // Si l'URL est déjà une URL complète (commence par http), la retourner telle quelle
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  // Si l'URL commence par /api/admin/products/images/, c'est une image du backend
  if (imageUrl.startsWith('/api/admin/products/images/')) {
    return "http://localhost:8080" + imageUrl;
  }

  // Si l'URL contient api/admin/products/images/, c'est une image du backend
  if (imageUrl.includes('api/admin/products/images/')) {
    return imageUrl.startsWith('http') ? imageUrl : "http://localhost:8080/" + imageUrl;
  }

  // Pour les autres cas, retourner null (pas d'image)
  return null;
};
