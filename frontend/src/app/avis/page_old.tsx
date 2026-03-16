import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Testimonials } from "@/components/Testimonials";
import { Star } from "lucide-react";

const reviews = [
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
    name: "Emma B.",
    age: 23,
    university: "ENS",
    rating: 5,
    date: "Décembre 2023",
    product: "Crème Hydratante",
    comment: "Parfaite pour ma peau sensible. Ne grasse pas, pénètre vite et tient toute la journée. Idéale entre les cours et la bibliothèque.",
    verified: true
  },
  {
    id: 6,
    name: "Lucas R.",
    age: 21,
    university: "CentraleSupélec",
    rating: 4,
    date: "Décembre 2023",
    product: "Gel Nettoyant",
    comment: "Bon produit, nettoie bien sans décaper. Le packaging pratique pour les déplacements. Juste dommage que le tube se vide assez vite.",
    verified: true
  }
];

const stats = {
  average: 4.8,
  total: 1247,
  distribution: {
    5: 892,
    4: 287,
    3: 56,
    2: 8,
    1: 4
  }
};

export default function AvisPage() {
  const handleCartClick = () => {
    // Handle cart click - you can implement cart opening logic here
    console.log("Cart clicked");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={handleCartClick} />
      <main>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Avis de nos Clients Étudiants
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez ce que nos milliers de clients étudiants pensent de nos produits. 
              Authenticité et transparence garanties.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="bg-green-50 rounded-lg p-8 mb-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="text-5xl font-bold text-green-600 mr-2">{stats.average}</div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor(stats.average)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">Note moyenne</p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">{stats.total}</div>
                <p className="text-gray-600">Avis vérifiés</p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">95%</div>
                <p className="text-gray-600">Clients satisfaits</p>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="mt-8 max-w-md mx-auto">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center mb-2">
                  <div className="flex items-center w-16">
                    <span className="text-sm text-gray-600 mr-1">{rating}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 ml-4">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${(stats.distribution[rating as keyof typeof stats.distribution] / stats.total) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 ml-2 w-12 text-right">
                    {stats.distribution[rating as keyof typeof stats.distribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold text-gray-900 mr-2">{review.name}</h3>
                      {review.verified && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                          ✓ Vérifié
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {review.age} ans • {review.university}
                    </p>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="mb-3">
                  <span className="text-sm text-green-600 font-medium">{review.product}</span>
                  <span className="text-sm text-gray-500 ml-2">• {review.date}</span>
                </div>
                
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center">
            <button className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors">
              Voir plus d'avis
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
