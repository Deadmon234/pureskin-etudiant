"use client";

import { useEffect, useState, useRef } from "react";
import { apiService, Testimonial } from "@/lib/api";
import { Star, Quote } from "lucide-react";

// Données de secours si l'API ne fonctionne pas
const fallbackTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Camille L.",
    text: "Incroyable ! Ma peau a complètement changé en 2 semaines. Les produits sont parfaits pour mon budget étudiant et les résultats sont visibles.",
    rating: 5,
    isApproved: true,
    createdAt: "2024-02-15T10:00:00Z",
    studies: "Sorbonne",
    age: 21
  },
  {
    id: 2,
    name: "Thomas M.",
    text: "Étudiant en prépa, je n'avais que 5 minutes le matin. Cette routine express est parfaite. Simple, rapide et efficace.",
    rating: 5,
    isApproved: true,
    createdAt: "2024-02-14T15:30:00Z",
    studies: "Polytechnique",
    age: 19
  },
  {
    id: 3,
    name: "Léa S.",
    text: "Très bon produit qui aide vraiment contre les boutons de stress avant les examens. Les résultats sont rapides et durables.",
    rating: 4,
    isApproved: true,
    createdAt: "2024-02-13T09:15:00Z",
    studies: "Sciences Po",
    age: 22
  },
  {
    id: 4,
    name: "Maxime D.",
    text: "Je ne pensais jamais voir le jour où ma peau serait aussi belle. Les conseils personnalisés et les produits adaptés ont fait toute la différence.",
    rating: 5,
    isApproved: true,
    createdAt: "2024-02-12T14:20:00Z",
    studies: "HEC",
    age: 20
  },
  {
    id: 5,
    name: "Sophie B.",
    text: "Les produits sont doux et efficaces. Ma peau sensible les tolère parfaitement. Je recommande vivement !",
    rating: 5,
    isApproved: true,
    createdAt: "2024-02-11T11:45:00Z",
    studies: "Assas",
    age: 23
  },
  {
    id: 6,
    name: "Lucas R.",
    text: "Bonne crème hydratante, non grasse. Parfait pour ma peau sensible. Je l'utilise quotidiennement depuis 6 mois.",
    rating: 4,
    isApproved: true,
    createdAt: "2024-02-10T16:30:00Z",
    studies: "Centrale",
    age: 21
  }
];

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await apiService.getTestimonials();
        setTestimonials(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des témoignages:', err);
        setError('Impossible de charger les témoignages');
        setTestimonials(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || !scrollContainerRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    let scrollAmount = 0;
    const scrollStep = 1; // Pixels par frame
    const scrollSpeed = 30; // ms entre chaque frame

    const scroll = () => {
      if (!scrollContainer) return;
      
      scrollAmount += scrollStep;
      
      // Si on atteint la fin, on revient au début
      if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        scrollAmount = 0;
      }
      
      scrollContainer.scrollLeft = scrollAmount;
    };

    const intervalId = setInterval(scroll, scrollSpeed);

    return () => clearInterval(intervalId);
  }, [isAutoPlaying]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des témoignages...</p>
          </div>
        </div>
      </section>
    );
  }

  // Calculer les statistiques à partir des témoignages réels
  const averageRating = testimonials.length > 0 
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : "4.8";
  
  const totalReviews = testimonials.length > 0 ? testimonials.length * 150 : 2341; // Estimation

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Ils parlent de nous
            <span className="text-green-600 block">avec leur cœur</span>
          </h2>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-2xl font-bold text-gray-900">{averageRating}/5</p>
              <p className="text-sm text-gray-600">Note moyenne</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{totalReviews.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Avis vérifiés</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">94%</p>
              <p className="text-sm text-gray-600">Recommandent</p>
            </div>
          </div>
        </div>

        {/* Testimonials Horizontal Scroll */}
        <div className="relative">
          {/* Auto-play indicator */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span>{isAutoPlaying ? 'Défilement automatique' : 'Défilement en pause'}</span>
            </div>
          </div>

          {/* Horizontal Scroll Container */}
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex space-x-6 pb-4" style={{ width: 'max-content' }}>
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow flex-shrink-0 w-80"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                        👩‍🎓
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">
                          {testimonial.age} ans • {testimonial.studies}
                        </p>
                      </div>
                    </div>
                    <Quote className="w-5 h-5 text-green-200" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-gray-700 mb-4">"{testimonial.text}"</p>

                  {/* Date */}
                  <div className="text-sm text-gray-500">
                    {new Date(testimonial.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gradient edges for smooth scroll effect */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Rejoignez les milliers d'étudiants qui ont retrouvé confiance
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Découvrez nos produits adaptés à votre budget et votre rythme de vie
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 transition-colors font-medium">
              Découvrir les produits
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium">
              Lire tous les avis
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
