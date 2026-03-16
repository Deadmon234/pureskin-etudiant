"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartButton } from "@/components/CartButton";
import { Cart } from "@/components/Cart";
import { Star, Filter, ChevronDown, User, Calendar, Check } from "lucide-react";
import { apiService, Testimonial } from "@/lib/api";

const allReviews = [
  {
    id: 1,
    name: "Camille L.",
    age: 21,
    university: "Sorbonne",
    rating: 5,
    date: "Février 2024",
    product: "Routine Complète",
    comment: "Incroyable ! Ma peau a complètement changé en 2 semaines. Les produits sont parfaits pour mon budget étudiant et les résultats sont visibles. Plus de boutons, une peau lumineuse !",
    verified: true
  },
  {
    id: 2,
    name: "Thomas M.",
    age: 19,
    university: "Polytechnique",
    rating: 5,
    date: "Février 2024",
    product: "Kit Express",
    comment: "Étudiant en prépa, je n'avais que 5 minutes le matin. Cette routine express est parfaite. Simple, rapide et efficace. Recommande à 100% !",
    verified: true
  },
  {
    id: 3,
    name: "Léa S.",
    age: 22,
    university: "Sciences Po",
    rating: 4,
    date: "Janvier 2024",
    product: "Sérum Anti-Imperfections",
    comment: "Très bon produit qui aide vraiment contre les boutons de stress avant les examens. Seul petit bémol : j'aurais aimé un format plus grand pour le prix.",
    verified: true
  },
  {
    id: 4,
    name: "Maxime D.",
    age: 20,
    university: "HEC",
    rating: 5,
    date: "Janvier 2024",
    product: "Routine Complète",
    comment: "Je ne pensais jamais voir le jour où ma peau serait aussi belle. Les conseils personnalisés et les produits adaptés ont fait toute la différence. Merci PureSkin !",
    verified: true
  },
  {
    id: 5,
    name: "Julie P.",
    age: 23,
    university: "ENS",
    rating: 5,
    date: "Janvier 2024",
    product: "Masque Purifiant",
    comment: "Le masque est génial pour les peaux mixtes. Je l'utilise 2 fois par semaine et ma peau est beaucoup plus nette. Le parfum est très agréable aussi.",
    verified: true
  },
  {
    id: 6,
    name: "Antoine B.",
    age: 20,
    university: "Centrale",
    rating: 4,
    date: "Décembre 2023",
    product: "Crème Hydratante",
    comment: "Bonne crème hydratante, non grasse. Parfait pour ma peau sensible. La seule chose : le pot pourrait être plus grand pour le prix.",
    verified: true
  },
  {
    id: 7,
    name: "Emma R.",
    age: 21,
    university: "Dauphine",
    rating: 5,
    date: "Décembre 2023",
    product: "Kit Express",
    comment: "Vraiment le kit parfait pour les étudiants ! Tout ce qu'il faut en un seul achat. Ma peau a radicalement changé en 3 semaines.",
    verified: true
  },
  {
    id: 8,
    name: "Lucas G.",
    age: 22,
    university: "Télécom Paris",
    rating: 5,
    date: "Décembre 2023",
    product: "Sérum Anti-Imperfections",
    comment: "Je souffrais de boutons depuis des années. Ce sérum m'a sauvé la vie ! Plus d'inflammation, plus de cicatrices. Un grand merci !",
    verified: true
  },
  {
    id: 9,
    name: "Chloé M.",
    age: 19,
    university: "Assas",
    rating: 4,
    date: "Novembre 2023",
    product: "Routine Complète",
    comment: "Produits de qualité, résultats visibles. Le seul point négatif : le temps de livraison un peu long.",
    verified: true
  },
  {
    id: 10,
    name: "Nicolas V.",
    age: 23,
    university: "Mines Paris",
    rating: 5,
    date: "Novembre 2023",
    product: "Crème Hydratante",
    comment: "Excellente crème ! Ma peau sèche est enfin hydratée sans effet brillant. Je l'adopte depuis 6 mois.",
    verified: true
  },
  {
    id: 11,
    name: "Laura K.",
    age: 20,
    university: "Paris 1",
    rating: 5,
    date: "Octobre 2023",
    product: "Masque Purifiant",
    comment: "Le masque est incroyable ! Ma peau est plus nette, les pores sont resserrés. Je le recommande vivement !",
    verified: true
  },
  {
    id: 12,
    name: "Hugo L.",
    age: 21,
    university: "UPEC",
    rating: 4,
    date: "Octobre 2023",
    product: "Kit Express",
    comment: "Bon kit pour débuter. Les produits sont efficaces mais j'aurais aimé plus d'options de personnalisation.",
    verified: true
  }
];

export default function AvisPage() {
  const [reviews, setReviews] = useState(allReviews.slice(0, 6));
  const [displayedCount, setDisplayedCount] = useState(6);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterProduct, setFilterProduct] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await apiService.getTestimonials();
        setTestimonials(data);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const handleLoadMore = () => {
    const newCount = displayedCount + 6;
    const newReviews = allReviews.slice(0, newCount);
    setReviews(newReviews);
    setDisplayedCount(newCount);
  };

  const filteredReviews = reviews.filter(review => {
    const ratingMatch = filterRating === null || review.rating === filterRating;
    const productMatch = filterProduct === '' || review.product.toLowerCase().includes(filterProduct.toLowerCase());
    return ratingMatch && productMatch;
  });

  const averageRating = 4.8;
  const totalReviews = 2341;
  const ratingDistribution = [45, 78, 156, 423, 1639]; // 1-5 stars

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Avis de nos clients
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez ce que nos clients pensent de nos produits. Plus de 2000 avis vérifiés d'étudiants comme vous.
            </p>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {renderStars(Math.round(averageRating))}
                </div>
                <p className="text-3xl font-bold text-gray-900">{averageRating}/5</p>
                <p className="text-sm text-gray-600">Note moyenne</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{totalReviews.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Avis vérifiés</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">94%</p>
                <p className="text-sm text-gray-600">Recommandent</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">2.5j</p>
                <p className="text-sm text-gray-600">Délai moyen constaté</p>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des notes</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-20">
                      <span className="text-sm">{rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${(ratingDistribution[5 - rating] / totalReviews) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {ratingDistribution[5 - rating]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ cursor: 'pointer' }}
                >
                  <Filter className="w-4 h-4" />
                  Filtres
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                
                {filterRating && (
                  <button
                    onClick={() => setFilterRating(null)}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    style={{ cursor: 'pointer' }}
                  >
                    {filterRating} étoiles ×
                  </button>
                )}
                
                {filterProduct && (
                  <button
                    onClick={() => setFilterProduct('')}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    style={{ cursor: 'pointer' }}
                  >
                    {filterProduct} ×
                  </button>
                )}
              </div>
              
              <div className="text-sm text-gray-600">
                {filteredReviews.length} avis affichés
              </div>
            </div>

            {showFilters && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Note minimale</h4>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            filterRating === rating
                              ? 'bg-green-500 text-white'
                              : 'bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                          style={{ cursor: 'pointer' }}
                        >
                          {rating}+
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Produit</h4>
                    <select
                      value={filterProduct}
                      onChange={(e) => setFilterProduct(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="">Tous les produits</option>
                      <option value="Routine Complète">Routine Complète</option>
                      <option value="Kit Express">Kit Express</option>
                      <option value="Sérum Anti-Imperfections">Sérum Anti-Imperfections</option>
                      <option value="Crème Hydratante">Crème Hydratante</option>
                      <option value="Masque Purifiant">Masque Purifiant</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.name}</h4>
                      <p className="text-sm text-gray-600">
                        {review.age} ans • {review.university}
                      </p>
                    </div>
                  </div>
                  {review.verified && (
                    <div className="flex items-center space-x-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      <Check className="w-3 h-3" />
                      <span>Vérifié</span>
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {renderStars(review.rating)}
                  <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
                </div>

                {/* Product */}
                <div className="mb-4">
                  <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {review.product}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-gray-700 mb-4 line-clamp-3">{review.comment}</p>

                {/* Date */}
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {review.date}
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {displayedCount < allReviews.length && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                className="bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 transition-colors font-medium"
                style={{ cursor: 'pointer' }}
              >
                Voir plus d'avis ({allReviews.length - displayedCount} restants)
              </button>
            </div>
          )}

          {/* Testimonials from API */}
          {testimonials.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                Témoignages de notre communauté
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.slice(0, 6).map((testimonial) => (
                  <div key={testimonial.id} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg">
                          <User className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                          <p className="text-sm text-gray-600">
                            {testimonial.age} ans • {testimonial.studies}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm font-medium text-green-800">
                        ✨ {testimonial.results}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      
      {/* Cart */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
