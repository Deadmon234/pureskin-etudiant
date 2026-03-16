// Service pour gérer les correspondances entre produits et images uploadées
// Généré automatiquement - Ne pas modifier manuellement

// Liste des images uploadées disponibles (mise à jour: 2026-03-06T13:10:57.810Z)
const getAvailableImages = (): string[] => {
  return [
    'serum-hydratant-1772797504624.jpg',
    'serum-hydratant-1772799237020.jpg',
    'Protection Lèvres SPF 50-1772801413902.jpg'
  ];
};

// Fonction pour trouver la meilleure correspondance d'image pour un produit
export const findMatchingImage = (productName: string, originalImage?: string): string => {
  const availableImages = getAvailableImages();
  
  // Si l'image originale existe déjà et est accessible, l'utiliser
  if (originalImage && originalImage.startsWith('/images/products/')) {
    return originalImage;
  }
  
  // Convertir le nom du produit en minuscules pour la recherche
  const searchTerms = productName.toLowerCase().split(' ');
  
  // Chercher une image qui correspond aux termes de recherche
  for (const image of availableImages) {
    const imageLower = image.toLowerCase();
    
    // Vérifier si tous les termes de recherche sont dans le nom de l'image
    if (searchTerms.every(term => imageLower.includes(term))) {
      return '/images/products/' + image;
    }
    
    // Correspondance partielle (au moins un terme)
    if (searchTerms.some(term => imageLower.includes(term))) {
      return '/images/products/' + image;
    }
  }
  
  // Correspondances spécifiques connues
  if (productName.toLowerCase().includes('serum')) {
    const serumImage = availableImages.find(img => img.toLowerCase().includes('serum'));
    if (serumImage) return '/images/products/' + serumImage;
  }
  
  if (productName.toLowerCase().includes('protection') || productName.toLowerCase().includes('lèvres')) {
    const protectionImage = availableImages.find(img => img.toLowerCase().includes('protection'));
    if (protectionImage) return '/images/products/' + protectionImage;
  }
  
  return ''; // Pas d'image trouvée
};
