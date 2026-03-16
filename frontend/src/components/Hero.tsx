import { ArrowRight, Leaf, Shield, Heart } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export function Hero() {
  // Liste dynamique de toutes les images dans public/images/products
  const productImages = [
    "/images/products/DSC4575.png",
    // "/images/products/beaute diversite.jpg",
    // "/images/products/devien conseiller beaute.jpg",
    "/images/products/entrepreneuriat-cosmetique-afrique-banniere-1280x720.jpg",
    "/images/products/fermer-les-mains-tenir-pot-cosmétique-avec-crème-sur-la-feuille-verte-fond-de-plantes-le-fraîche-blanches-espace-copie-219111782.jpg",
    // "/images/products/images.jpg",
    "/images/products/istockphoto-1289220585-612x612.jpg"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Défilement automatique toutes les 4 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        // Trouver la prochaine image valide
        let nextIndex = (prevIndex + 1) % productImages.length;
        let attempts = 0;
        
        // Éviter les images avec erreur
        while (imageErrors.has(nextIndex) && attempts < productImages.length) {
          nextIndex = (nextIndex + 1) % productImages.length;
          attempts++;
        }
        
        return nextIndex;
      });
    }, 4000); // 4 secondes

    return () => clearInterval(interval);
  }, [productImages.length, imageErrors]);

  const handleImageError = (index: number) => {
    console.log(`Image ${index} failed to load: ${productImages[index]}`);
    setImageErrors(prev => new Set(prev).add(index));
  };

  const handleImageLoad = (index: number) => {
    console.log(`Image ${index} loaded successfully: ${productImages[index]}`);
    setLoadedImages(prev => new Set(prev).add(index));
  };

  // Filtrer seulement les images valides
  const validImages = productImages.filter((_, index) => !imageErrors.has(index));
  const hasValidImages = validImages.length > 0;

  return (
    <section className="relative bg-gradient-to-br from-green-50 to-blue-50 py-20 lg:py-4">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-6">
              <Leaf className="w-4 h-4 mr-2" />
              Cosmétique naturelle pour étudiants
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Une peau saine même
              <span className="text-green-600 block">pendant les études</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl lg:max-w-none">
              PureSkin Étudiant vous propose des cosmétiques naturels, vegan et sans parabènes 
              spécialement conçus pour les peaux mixtes à grasses des 18-25 ans. 
              Soyez beau(e) sans vous ruiner !
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                href="/produits"
                className="inline-flex items-center bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors"
              >
                Découvrir nos produits
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link 
                href="/routine"
                className="inline-flex items-center border border-green-500 text-green-600 px-6 py-3 rounded-full hover:bg-green-50 transition-colors"
              >
                Ma routine personnalisée
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 mt-12 justify-center lg:justify-start">
              <div className="flex items-center text-gray-600">
                <Shield className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm">100% naturel</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Heart className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm">Vegan & cruelty-free</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Leaf className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm">Sans parabènes</span>
              </div>
            </div>
          </div>

          {/* Image carousel */}
          <div className="relative">
            <div className="relative rounded-3xl h-96 lg:h-full min-h-[400px] overflow-hidden">
              {/* Image actuelle avec transition */}
              {productImages.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt={`Produit PureSkin ${index + 1}`}
                  onError={() => handleImageError(index)}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                    index === currentImageIndex && !imageErrors.has(index) ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              
              {/* Fallback si aucune image ne charge */}
              {imageErrors.size === productImages.length && (
                <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-blue-200 rounded-3xl h-96 lg:h-full min-h-[400px] flex items-center justify-center">
                  <div className="text-center text-white">
                    <Leaf className="w-16 h-16 mx-auto mb-4 text-green-600" />
                    <p className="text-green-800 font-semibold">PureSkin Étudiant</p>
                    <p className="text-green-600 text-sm">Cosmétiques naturels</p>
                  </div>
                </div>
              )}
              
              {/* Overlay pour meilleure lisibilité */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-3xl"></div>
              
              {/* Indicateurs de progression */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => !imageErrors.has(index) && setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex && !imageErrors.has(index)
                        ? 'bg-white w-8' 
                        : imageErrors.has(index)
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                    aria-label={`Image ${index + 1}`}
                    disabled={imageErrors.has(index)}
                  />
                ))}
              </div>
            </div>
            
            {/* Floating cards */}
            <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-4 hidden lg:block">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">4.8</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Note moyenne</p>
                  <p className="text-xs text-gray-600">2,341 avis</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 hidden lg:block">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">-30%</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Prix étudiant</p>
                  <p className="text-xs text-gray-600">Code: ETUDIANT30</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
