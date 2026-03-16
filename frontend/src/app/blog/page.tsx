"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartButton } from "@/components/CartButton";
import Cart from "@/components/Cart";
import Link from "next/link";
import { Calendar, User, Clock, Search, Filter, ChevronDown } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Les 5 erreurs à éviter pour une peau parfaite",
    excerpt: "Découvrez les erreurs communes que font les étudiants et comment les éviter pour avoir une peau éclatante.",
    author: "Dr. Marie Laurent",
    date: "15 Février 2024",
    readTime: "5 min",
    category: "Conseils",
    image: "/api/placeholder/400/250",
    tags: ["peau", "erreurs", "étudiants", "conseils"],
    featured: true
  },
  {
    id: 2,
    title: "Routine soin express: 10 minutes par jour",
    excerpt: "Une routine complète pour les étudiants pressés qui veulent prendre soin de leur peau sans y passer des heures.",
    author: "Sophie Martin",
    date: "12 Février 2024",
    readTime: "3 min",
    category: "Routine",
    image: "/api/placeholder/400/250",
    tags: ["routine", "express", "matin", "soir"],
    featured: false
  },
  {
    id: 3,
    title: "Le stress et la peau: comment gérer les examens",
    excerpt: "Le lien entre le stress des examens et les problèmes de peau, avec des solutions pratiques.",
    author: "Dr. Pierre Dubois",
    date: "8 Février 2024",
    readTime: "7 min",
    category: "Santé",
    image: "/api/placeholder/400/250",
    tags: ["stress", "examens", "acné", "santé"],
    featured: true
  },
  {
    id: 4,
    title: "Budget étudiant: produits skincare abordables",
    excerpt: "Les meilleurs produits qui ne videront pas votre portefeuille tout en étant efficaces.",
    author: "Emma Petit",
    date: "5 Février 2024",
    readTime: "6 min",
    category: "Budget",
    image: "/api/placeholder/400/250",
    tags: ["budget", "étudiants", "prix", "produits"],
    featured: false
  },
  {
    id: 5,
    title: "Alimentation et peau: le guide étudiant",
    excerpt: "Comment une bonne alimentation peut transformer votre peau sans ruiner vos budgets courses.",
    author: "Nutritionniste Léa Blanc",
    date: "1 Février 2024",
    readTime: "8 min",
    category: "Nutrition",
    image: "/api/placeholder/400/250",
    tags: ["alimentation", "nutrition", "peau", "conseils"],
    featured: true
  },
  {
    id: 6,
    title: "Mythes skincare: ce qui marche vraiment",
    excerpt: "Démystifions les fausses croyances sur les soins de la peau qui circulent sur les réseaux sociaux.",
    author: "Dr. Marie Laurent",
    date: "28 Janvier 2024",
    readTime: "10 min",
    category: "Mythes",
    image: "/api/placeholder/400/250",
    tags: ["mythes", "soins", "vrai-faux", "réseaux"],
    featured: false
  },
  {
    id: 7,
    title: "Les secrets d'une peau nette pendant les révisions",
    excerpt: "Gardez une peau saine même pendant les périodes intenses de révisions avec ces astuces simples.",
    author: "Dr. Marie Laurent",
    date: "25 Janvier 2024",
    readTime: "6 min",
    category: "Conseils",
    image: "/api/placeholder/400/250",
    tags: ["révisions", "peau nette", "astuces", "étudiants"],
    featured: false
  },
  {
    id: 8,
    title: "Routine matin express pour les lève-tard",
    excerpt: "Une routine ultra-rapide pour ceux qui ont du mal à se lever le matin mais veulent une peau impeccable.",
    author: "Sophie Martin",
    date: "22 Janvier 2024",
    readTime: "4 min",
    category: "Routine",
    image: "/api/placeholder/400/250",
    tags: ["matin", "express", "lève-tard", "rapide"],
    featured: false
  },
  {
    id: 9,
    title: "Sommeil et peau: le lien essentiel",
    excerpt: "Comment un bon sommeil peut transformer votre peau et réduire les problèmes cutanés.",
    author: "Dr. Pierre Dubois",
    date: "18 Janvier 2024",
    readTime: "7 min",
    category: "Santé",
    image: "/api/placeholder/400/250",
    tags: ["sommeil", "peau", "santé", "conseils"],
    featured: false
  },
  {
    id: 10,
    title: "Les meilleurs produits sous 15€",
    excerpt: "Notre sélection de produits skincare efficaces qui ne dépassent pas 15€ pour les budgets serrés.",
    author: "Emma Petit",
    date: "15 Janvier 2024",
    readTime: "5 min",
    category: "Budget",
    image: "/api/placeholder/400/250",
    tags: ["produits", "15€", "budget", "sélection"],
    featured: false
  },
  {
    id: 11,
    title: "Les aliments qui font du bien à votre peau",
    excerpt: "Découvrez les aliments à privilégier pour une peau éclatante et ceux à éviter.",
    author: "Nutritionniste Léa Blanc",
    date: "12 Janvier 2024",
    readTime: "6 min",
    category: "Nutrition",
    image: "/api/placeholder/400/250",
    tags: ["aliments", "peau éclatante", "conseils", "nutrition"],
    featured: false
  },
  {
    id: 12,
    title: "Le sucre et l'acné: mythe ou réalité ?",
    excerpt: "Analyse scientifique du lien entre consommation de sucre et apparition des boutons.",
    author: "Dr. Marie Laurent",
    date: "8 Janvier 2024",
    readTime: "8 min",
    category: "Mythes",
    image: "/api/placeholder/400/250",
    tags: ["sucre", "acné", "science", "mythe"],
    featured: false
  }
];

const categories = [
  { id: "all", name: "Tous", icon: "📚", color: "blue" },
  { id: "conseils", name: "Conseils", icon: "💡", color: "green" },
  { id: "routine", name: "Routine", icon: "⏰", color: "purple" },
  { id: "sante", name: "Santé", icon: "🏥", color: "red" },
  { id: "budget", name: "Budget", icon: "💰", color: "yellow" },
  { id: "nutrition", name: "Nutrition", icon: "🥗", color: "orange" },
  { id: "mythes", name: "Mythes", icon: "🔍", color: "indigo" }
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filtrer les articles
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "all" || 
      post.category.toLowerCase() === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Trier les articles
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "popular":
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      case "shortest":
        return parseInt(a.readTime) - parseInt(b.readTime);
      case "longest":
        return parseInt(b.readTime) - parseInt(a.readTime);
      default:
        return 0;
    }
  });

  // Articles featured
  const featuredPosts = sortedPosts.filter(post => post.featured).slice(0, 3);
  const regularPosts = selectedCategory === "all" && searchTerm === "" 
    ? sortedPosts.filter(post => !post.featured)
    : sortedPosts;

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Blog PureSkin Étudiant
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Conseils d'experts, astuces pratiques et guides complets pour prendre soin de votre peau pendant vos études.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-12">
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? `bg-${category.color}-500 text-white shadow-lg`
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                  {category.id !== "all" && (
                    <span className="ml-2 bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
                      {blogPosts.filter(post => post.category.toLowerCase() === category.id).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex justify-center">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Trier par:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="recent">Plus récent</option>
                  <option value="oldest">Plus ancien</option>
                  <option value="popular">Populaire</option>
                  <option value="shortest">Plus court</option>
                  <option value="longest">Plus long</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-center mb-8">
            <p className="text-gray-600">
              {sortedPosts.length} article{sortedPosts.length > 1 ? 's' : ''} trouvé{sortedPosts.length > 1 ? 's' : ''}
              {selectedCategory !== "all" && ` dans ${categories.find(c => c.id === selectedCategory)?.name}`}
              {searchTerm && ` pour "${searchTerm}"`}
            </p>
          </div>

          {/* Featured Posts (only on "all" category and no search) */}
          {selectedCategory === "all" && searchTerm === "" && featuredPosts.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Articles en vedette
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPosts.map((post) => (
                  <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
                    <div className="relative">
                      <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                        <div className="text-gray-400 text-sm">Image placeholder</div>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          🌟 En vedette
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          {post.category}
                        </span>
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
                          className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center"
                        >
                          Lire la suite →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Regular Posts */}
          <section>
            {selectedCategory !== "all" || searchTerm !== "" ? (
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                {selectedCategory !== "all" && `Articles ${categories.find(c => c.id === selectedCategory)?.name}`}
                {searchTerm && `Résultats pour "${searchTerm}"`}
              </h2>
            ) : (
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Tous les articles
              </h2>
            )}

            {regularPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post) => (
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
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span 
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
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
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun article trouvé
                </h3>
                <p className="text-gray-600 mb-6">
                  Essayez de modifier votre recherche ou de sélectionner une autre catégorie.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchTerm("");
                  }}
                  className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors"
                  style={{ cursor: 'pointer' }}
                >
                  Voir tous les articles
                </button>
              </div>
            )}
          </section>

          {/* Load More */}
          {regularPosts.length > 6 && (
            <div className="text-center mt-12">
              <button className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors">
                Charger plus d'articles
              </button>
            </div>
          )}

          {/* Newsletter */}
          <section className="mt-16">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Restez informé des nouveaux articles
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Recevez chaque semaine les meilleurs conseils skincare directement dans votre boîte mail.
              </p>
              <div className="max-w-md mx-auto flex gap-4">
                <input
                  type="email"
                  placeholder="Votre email..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors">
                  S'inscrire
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      
      {/* Cart */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
