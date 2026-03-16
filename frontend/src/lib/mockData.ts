// Mock data for testing when API is not available

export const mockProducts = [
  {
    id: 1,
    name: "Sérum Hydratant Étudiant",
    slug: "serum-hydratant-etudiant",
    description: "Sérum hydratant intense avec acide hyaluronique et vitamine C. Spécialement formulé pour les peaux jeunes.",
    price: 24.99,
    originalPrice: 34.99,
    imageUrl: "/images/serum-hydratant.jpg",
    badge: "best-seller",
    stockQuantity: 150,
    isActive: true,
    isFeatured: true,
    categoryId: 1,
    ingredients: "Acide hyaluronique, Vitamine C, Niacinamide",
    usageInstructions: "Appliquer matin et soir sur peau propre avant la crème hydratante",
    benefits: "Hydratation intense, éclat du teint, anti-oxydant"
  },
  {
    id: 2,
    name: "Crème Solaire SPF 50+",
    slug: "creme-solaire-spf-50",
    description: "Protection solaire très haute protection, non grasse, idéale pour le quotidien et le sport.",
    price: 18.99,
    originalPrice: null,
    imageUrl: "/images/creme-solaire.jpg",
    badge: "essentiel",
    stockQuantity: 200,
    isActive: true,
    isFeatured: true,
    categoryId: 1,
    ingredients: "Filtres solaires SPF 50+, Aloe Vera, Antioxydants",
    usageInstructions: "Appliquer généreusement 15 minutes avant l'exposition solaire",
    benefits: "Protection UVA/UVB, non grasse, résistante à l'eau"
  },
  {
    id: 3,
    name: "Nettoyant Doux 3-en-1",
    slug: "nettoyant-doux-3-en-1",
    description: "Démaquille, nettoie et tonifie en une seule étape. Parfait pour les matins pressés.",
    price: 15.99,
    originalPrice: 22.99,
    imageUrl: "/images/nettoyant-doux.jpg",
    badge: "new",
    stockQuantity: 100,
    isActive: true,
    isFeatured: false,
    categoryId: 1,
    ingredients: "Eau florale de camomille, Glycérine végétale, Extrait de thé vert",
    usageInstructions: "Appliquer sur visage humide, masser doucement puis rincer",
    benefits: "Nettoyage en douceur, gain de temps, respect du pH cutané"
  },
  {
    id: 4,
    name: "Masque Détox Week-end",
    slug: "masque-detox-week-end",
    description: "Masque détoxifiant à l'argile et au charbon actif. Idéal après les examens.",
    price: 12.99,
    originalPrice: 19.99,
    imageUrl: "/images/masque-detox.jpg",
    badge: "promo",
    stockQuantity: 80,
    isActive: true,
    isFeatured: false,
    categoryId: 1,
    ingredients: "Argile blanche, Charbon actif, Huiles essentielles de citron",
    usageInstructions: "Appliquer en couche fine, laisser poser 10-15 minutes puis rincer",
    benefits: "Détoxification, purification, élimination des impuretés"
  },
  {
    id: 5,
    name: "Baume Lèvres Protecteur",
    slug: "baume-levres-protecteur",
    description: "Baume lèvres avec SPF 30. Protège du froid, du vent et du soleil.",
    price: 6.99,
    originalPrice: null,
    imageUrl: "/images/baume-levres.jpg",
    badge: null,
    stockQuantity: 300,
    isActive: true,
    isFeatured: false,
    categoryId: 2,
    ingredients: "Beurre de karité, Cire d'abeille, Filtres solaires SPF 30",
    usageInstructions: "Appliquer sur les lèvres autant que nécessaire",
    benefits: "Protection SPF 30, nutrition, réparation"
  },
  {
    id: 6,
    name: "Gommage Doux Visage",
    slug: "gommage-doux-visage",
    description: "Gommage enzymatique doux, sans grains, respectueux des peaux sensibles.",
    price: 14.99,
    originalPrice: 21.99,
    imageUrl: "/images/gommage-doux.jpg",
    badge: "best-seller",
    stockQuantity: 90,
    isActive: true,
    isFeatured: true,
    categoryId: 1,
    ingredients: "Enzymes de papaye, Acide lactique, Extrait de calendula",
    usageInstructions: "Appliquer sur peau sèche, masser 1 minute puis rincer",
    benefits: "Exfoliation douce, renouvellement cellulaire, éclat immédiat"
  },
  {
    id: 7,
    name: "Soin Anti-Boutons",
    slug: "soin-anti-boutons",
    description: "Gel-crème anti-imperfections, action rapide sur les boutons et points noirs.",
    price: 19.99,
    originalPrice: 29.99,
    imageUrl: "/images/anti-boutons.jpg",
    badge: "urgent",
    stockQuantity: 60,
    isActive: true,
    isFeatured: false,
    categoryId: 1,
    ingredients: "Acide salicylique, Tea tree oil, Zinc",
    usageInstructions: "Appliquer localement sur les imperfections 2-3 fois par jour",
    benefits: "Action ciblée, réduction des boutons, prévention"
  },
  {
    id: 8,
    name: "Huile Démaquillante",
    slug: "huile-demaquillante",
    description: "Huile démaquillante qui élimine même le maquillage waterproof.",
    price: 16.99,
    originalPrice: null,
    imageUrl: "/images/huile-demaquillante.jpg",
    badge: null,
    stockQuantity: 120,
    isActive: true,
    isFeatured: false,
    categoryId: 1,
    ingredients: "Huiles végétales, Vitamine E, Fragrance naturelle",
    usageInstructions: "Masser sur visage sec, émulsionner avec eau tiède puis rincer",
    benefits: "Démaquillage efficace, respect du film hydrolipidique, peau douce"
  }
];

export const mockCategories = [
  {
    id: 1,
    name: "Soins Visage",
    slug: "soins-visage",
    description: "Produits pour le soin quotidien du visage",
    imageUrl: "/images/categories/soins-visage.jpg",
    isActive: true
  },
  {
    id: 2,
    name: "Solaire",
    slug: "solaire",
    description: "Protection solaire adaptée aux peaux jeunes",
    imageUrl: "/images/categories/solaire.jpg",
    isActive: true
  },
  {
    id: 3,
    name: "Corps",
    slug: "corps",
    description: "Soins pour le corps",
    imageUrl: "/images/categories/corps.jpg",
    isActive: true
  }
];

export const mockBlogPosts = [
  {
    id: 1,
    title: "Les 5 étapes indispensables d'une routine skincare étudiante",
    slug: "les-5-etapes-indispensables-routine-skincare-etudiante",
    excerpt: "Découvrez la routine skincare parfaite adaptée au budget et au rythme de vie étudiant.",
    content: "Une routine skincare complète ne doit pas être compliquée ni coûteuse...",
    featuredImage: "/images/blog-routine-etudiante.jpg",
    author: "Dr. Marie Laurent",
    readingTime: 7,
    isPublished: true,
    publishedAt: "2024-01-15T10:00:00Z",
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    title: "Comment gérer l'acné pendant les examens ?",
    slug: "comment-gerer-acne-pendant-examens",
    excerpt: "Le stress des examens peut provoquer des poussées d'acné. Découvrez nos astuces.",
    content: "Le stress libère du cortisol qui stimule la production de sébum...",
    featuredImage: "/images/blog-acne-examens.jpg",
    author: "Dr. Paul Martin",
    readingTime: 5,
    isPublished: true,
    publishedAt: "2024-01-10T14:30:00Z",
    createdAt: "2024-01-10T14:30:00Z"
  }
];

export const mockRoutines = [
  {
    id: 1,
    name: "Routine Express Matin",
    slug: "routine-express-matin",
    description: "Parfaite pour les matins pressés avant les cours. 5 minutes pour une peau protégée.",
    skinTypeId: 1,
    steps: "1. Nettoyage rapide avec le Nettoyant 3-en-1 (30s)\n2. Sérum Hydratant (30s)\n3. Crème Solaire SPF 50+ (30s)\n4. Baume Lèvres (10s)",
    durationMinutes: 5,
    difficultyLevel: "Débutant",
    isRecommended: true,
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    name: "Routine Soir Détente",
    slug: "routine-soir-detente",
    description: "Routine relaxante après une longue journée. Élimine les impuretés et prépare au repos.",
    skinTypeId: 2,
    steps: "1. Démaquillage à l'Huile Démaquillante (1min)\n2. Nettoyage doux avec le Nettoyant 3-en-1 (1min)\n3. Sérum Hydratant (30s)\n4. Crème Hydratante Légère (30s)",
    durationMinutes: 3,
    difficultyLevel: "Débutant",
    isRecommended: false,
    createdAt: "2024-01-15T10:00:00Z"
  }
];

export const mockTestimonials = [
  {
    id: 1,
    customerId: 1,
    name: "Camille Martin",
    age: 20,
    studies: "Sorbonne Université",
    rating: 5,
    text: "Le sérum hydratant est incroyable ! Ma peau est beaucoup plus douce et les rougeurs ont diminué.",
    results: "Peau plus douce, rougeurs diminuées",
    isApproved: true,
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    customerId: 2,
    name: "Lucas Bernard",
    age: 22,
    studies: "Université de Paris",
    rating: 5,
    text: "La crème solaire SPF 50+ est parfaite. Texture légère, non grasse, sans traces blanches.",
    results: "Protection efficace, texture agréable",
    isApproved: true,
    createdAt: "2024-01-14T15:30:00Z"
  }
];
