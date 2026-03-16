// Script pour scanner dynamiquement les images uploadées
const { readFileSync, readdirSync } = require('fs');
const { join } = require('path');

// Fonction pour scanner le dossier des images et retourner la liste
function scanUploadedImages() {
  try {
    const imagesDir = join(process.cwd(), 'public', 'images', 'products');
    const files = readdirSync(imagesDir);
    
    // Filtrer uniquement les fichiers image
    const imageFiles = files.filter(file => 
      file.endsWith('.jpg') || 
      file.endsWith('.jpeg') || 
      file.endsWith('.png') || 
      file.endsWith('.svg') ||
      file.endsWith('.webp')
    );
    
    return imageFiles;
  } catch (error) {
    console.error('Erreur lors du scan des images:', error);
    return [];
  }
}

// Mettre à jour le fichier imageMatchingService.ts avec les nouvelles images
function updateImageMatchingService() {
  const images = scanUploadedImages();
  
  // Générer le contenu du fichier
  const content = `// Service pour gérer les correspondances entre produits et images uploadées
// Généré automatiquement - Ne pas modifier manuellement

// Liste des images uploadées disponibles (mise à jour: ${new Date().toISOString()})
const getAvailableImages = (): string[] => {
  return [
${images.map(img => `    '${img}'`).join(',\n')}
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
      return `/images/products/${image}`;
    }
    
    // Correspondance partielle (au moins un terme)
    if (searchTerms.some(term => imageLower.includes(term))) {
      return `/images/products/${image}`;
    }
  }
  
  // Correspondances spécifiques connues
  if (productName.toLowerCase().includes('serum')) {
    const serumImage = availableImages.find(img => img.toLowerCase().includes('serum'));
    if (serumImage) return `/images/products/${serumImage}`;
  }
  
  if (productName.toLowerCase().includes('protection') || productName.toLowerCase().includes('lèvres')) {
    const protectionImage = availableImages.find(img => img.toLowerCase().includes('protection'));
    if (protectionImage) return `/images/products/${protectionImage}`;
  }
  
  return ''; // Pas d'image trouvée
};
`;

  // Écrire le fichier mis à jour
  const filePath = join(process.cwd(), 'src', 'utils', 'imageMatchingService.ts');
  writeFileSync(filePath, content, 'utf8');
  
  console.log(`Service d'images mis à jour avec ${images.length} images`);
}

// Exécuter la mise à jour
updateImageMatchingService();
