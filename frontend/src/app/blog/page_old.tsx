import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { Calendar, User, Clock } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Les 5 erreurs à éviter pour une peau parfaite",
    excerpt: "Découvrez les erreurs communes que font les étudiants et comment les éviter pour avoir une peau éclatante.",
    author: "Dr. Marie Laurent",
    date: "15 Février 2024",
    readTime: "5 min",
    category: "Conseils",
    image: "/api/placeholder/400/250"
  },
  {
    id: 2,
    title: "Routine soin express: 10 minutes par jour",
    excerpt: "Une routine complète pour les étudiants pressés qui veulent prendre soin de leur peau sans y passer des heures.",
    author: "Sophie Martin",
    date: "12 Février 2024",
    readTime: "3 min",
    category: "Routine",
    image: "/api/placeholder/400/250"
  },
  {
    id: 3,
    title: "Le stress et la peau: comment gérer les examens",
    excerpt: "Le lien entre le stress des examens et les problèmes de peau, avec des solutions pratiques.",
    author: "Dr. Pierre Dubois",
    date: "8 Février 2024",
    readTime: "7 min",
    category: "Santé",
    image: "/api/placeholder/400/250"
  },
  {
    id: 4,
    title: "Budget étudiant: produits skincare abordables",
    excerpt: "Les meilleurs produits qui ne videront pas votre portefeuille tout en étant efficaces.",
    author: "Emma Petit",
    date: "5 Février 2024",
    readTime: "6 min",
    category: "Budget",
    image: "/api/placeholder/400/250"
  },
  {
    id: 5,
    title: "Alimentation et peau: le guide étudiant",
    excerpt: "Comment une bonne alimentation peut transformer votre peau sans ruiner vos budgets courses.",
    author: "Nutritionniste Léa Blanc",
    date: "1 Février 2024",
    readTime: "8 min",
    category: "Nutrition",
    image: "/api/placeholder/400/250"
  },
  {
    id: 6,
    title: "Mythes skincare: ce qui marche vraiment",
    excerpt: "Démystifions les fausses croyances sur les soins de la peau qui circulent sur les réseaux sociaux.",
    author: "Dr. Marie Laurent",
    date: "28 Janvier 2024",
    readTime: "10 min",
    category: "Mythes",
    image: "/api/placeholder/400/250"
  }
];

export default function BlogPage() {
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
              Blog PureSkin Étudiant
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Conseils d'experts, astuces pratiques et guides complets pour prendre soin de votre peau pendant vos études.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {["Tous", "Conseils", "Routine", "Santé", "Budget", "Nutrition", "Mythes"].map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === "Tous"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-400 text-sm">Image placeholder</div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    <Link href={`/blog/${post.id}`} className="hover:text-green-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                    <Link 
                      href={`/blog/${post.id}`}
                      className="text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      Lire la suite →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors">
              Charger plus d'articles
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
