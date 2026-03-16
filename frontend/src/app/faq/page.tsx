"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartButton } from "@/components/CartButton";
import { Cart } from "@/components/Cart";
import Link from "next/link";
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  MessageCircle, 
  Phone, 
  Mail,
  Package,
  CreditCard,
  Truck,
  Shield,
  User,
  Clock,
  Check,
  Star,
  TrendingUp,
  AlertCircle,
  ShoppingBag
} from "lucide-react";

const faqCategories = [
  {
    id: "general",
    name: "Questions Générales",
    icon: HelpCircle,
    color: "blue",
    bgColor: "bg-blue-100",
    textColor: "text-blue-600"
  },
  {
    id: "products",
    name: "Produits",
    icon: Package,
    color: "green",
    bgColor: "bg-green-100",
    textColor: "text-green-600"
  },
  {
    id: "orders",
    name: "Commandes",
    icon: ShoppingBag,
    color: "purple",
    bgColor: "bg-purple-100",
    textColor: "text-purple-600"
  },
  {
    id: "payment",
    name: "Paiement",
    icon: CreditCard,
    color: "yellow",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-600"
  },
  {
    id: "delivery",
    name: "Livraison",
    icon: Truck,
    color: "red",
    bgColor: "bg-red-100",
    textColor: "text-red-600"
  },
  {
    id: "returns",
    name: "Retours",
    icon: Shield,
    color: "indigo",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-600"
  }
];

const faqData = [
  {
    category: "general",
    question: "Qu'est-ce que PureSkin Étudiant ?",
    answer: "PureSkin Étudiant est une marque de produits skincare spécialement conçus pour les étudiants. Nos formules sont adaptées aux problématiques jeunes (acné, stress, budget limité) avec des produits efficaces, abordables et simples d'utilisation.",
    helpful: 45
  },
  {
    category: "general",
    question: "Les produits sont-ils testés sur animaux ?",
    answer: "Non, absolument pas. PureSkin est une marque cruelty-free. Aucun de nos produits ni ingrédients n'est testé sur animaux. Nous sommes également certifiés vegan pour la plupart de nos produits.",
    helpful: 67
  },
  {
    category: "general",
    question: "Quelle est la différence avec les autres marques ?",
    answer: "PureSkin se différencie par : 1) Des formules adaptées aux peaux jeunes, 2) Des prix étudiants accessibles, 3) Une routine simple en 3 étapes, 4) Des conseils personnalisés gratuits, 5) Un programme fidélité avantageux.",
    helpful: 38
  },
  {
    category: "products",
    question: "Quels produits pour peau grasse à tendance acnéique ?",
    answer: "Pour peau grasse/acnéique, nous recommandons : 1) Nettoyant Purifiant (matifiant), 2) Sérum Anti-Boutons (localisé), 3) Crème Hydratante Légère non comédogène. Commencez avec le Kit Express Peau Grasse.",
    helpful: 89
  },
  {
    category: "products",
    question: "Les produits conviennent-ils aux peaux sensibles ?",
    answer: "Oui, toute notre gamme est hypoallergénique et testée dermatologiquement. Pour peaux sensibles, privilégiez : 1) Nettoyant Doux sans sulfates, 2) Sérum Apaisant à la centella, 3) Crème Réparatrice. Faites toujours un test 24h sur une petite zone.",
    helpful: 56
  },
  {
    category: "products",
    question: "Combien de temps avant de voir des résultats ?",
    answer: "Les premiers résultats visibles apparaissent généralement : 1) Hydratation : 2-3 jours, 2) Texture peau : 1-2 semaines, 3) Boutons : 2-4 semaines, 4) Cicatrices : 6-8 semaines. La régularité est la clé du succès !",
    helpful: 72
  },
  {
    category: "products",
    question: "Puis-je combiner plusieurs produits ?",
    answer: "Oui, nos produits sont conçus pour fonctionner en synergie. Évitez cependant d'utiliser plus de 5 produits simultanément. Suivez notre guide : Nettoyant → Sérum → Crème. Le matin, ajoutez un SPF.",
    helpful: 41
  },
  {
    category: "orders",
    question: "Comment passer commande ?",
    answer: "Simple en 3 étapes : 1) Choisissez vos produits et ajoutez au panier, 2) Créez votre compte ou connectez-vous, 3) Choisissez livraison et paiement. La commande prend 2 minutes maximum !",
    helpful: 63
  },
  {
    category: "orders",
    question: "Puis-je modifier ma commande ?",
    answer: "Oui, vous pouvez modifier votre commande dans les 2 heures suivant la validation. Contactez-nous vite par email ou téléphone. Après expédition, il faudra attendre la réception pour faire un retour.",
    helpful: 29
  },
  {
    category: "orders",
    question: "Comment suivre ma commande ?",
    answer: "Vous recevrez un email avec votre numéro de suivi 24h après la commande. Utilisez notre page 'Suivi colis' ou le lien direct dans l'email pour suivre en temps réel votre livraison.",
    helpful: 58
  },
  {
    category: "payment",
    question: "Quels moyens de paiement acceptez-vous ?",
    answer: "Nous acceptons : Carte bancaire (Visa, Mastercard, CB), PayPal, Apple Pay, Google Pay, PayPal en 4x, Alma (3x/4x sans frais), chèque (pour réservations en magasin). 100% sécurisé SSL.",
    helpful: 47
  },
  {
    category: "payment",
    question: "Puis-je payer en plusieurs fois ?",
    answer: "Oui ! Nous proposons : 1) PayPal en 4x (sans frais à partir de 30€), 2) Alma 3x/4x (sans frais à partir de 50€), 3) Notre propre programme 3x (étudiants uniquement). Le paiement est instantané et sécurisé.",
    helpful: 71
  },
  {
    category: "payment",
    question: "Ma carte a été refusée, que faire ?",
    answer: "Vérifiez : 1) Solde suffisant, 2) Plafond non dépassé, 3) Carte activée pour paiement en ligne, 4) Infos correctes. Si problème persiste, essayez PayPal ou contactez votre banque. Notre service client peut aider aussi.",
    helpful: 33
  },
  {
    category: "delivery",
    question: "Quels sont les délais de livraison ?",
    answer: "Livraison Standard : 3-5 jours ouvrés (4,99€), Express : 24-48h (9,99€), Point Relais : 2-4 jours (3,99€), Mondial Relay : 4-6 jours (2,99€). Livraison offerte dès 25€ d'achat !",
    helpful: 85
  },
  {
    category: "delivery",
    question: "Livrez-vous à l'étranger ?",
    answer: "Actuellement : France métropolitaine, Corse, Belgique, Luxembourg. Bientôt : Suisse, Espagne, Italie. Pour DOM-TOM et autres pays, contactez-nous pour un devis personnalisé.",
    helpful: 22
  },
  {
    category: "delivery",
    question: "Que faire si je suis absent à la livraison ?",
    answer: "Pas de panique ! Le transporteur laisse un avis de passage. Vous pouvez : 1) Reprogrammer la livraison en ligne, 2) Retirer au point relais, 3) Demander une deuxième tentative le lendemain. Vous avez 15 jours pour récupérer votre colis.",
    helpful: 39
  },
  {
    category: "returns",
    question: "Puis-je retourner un produit ?",
    answer: "Oui, vous avez 14 jours pour retourner un produit non utilisé, dans son emballage d'origine. Contactez-nous pour obtenir un étiquette retour gratuite. Remboursement sous 5-7 jours ou échange immédiat.",
    helpful: 54
  },
  {
    category: "returns",
    question: "Les produits ouverts sont-ils remboursables ?",
    answer: "Pour des raisons d'hygiène, les produits ouverts ne peuvent être remboursés SAUF : 1) Produit défectueux, 2) Réaction allergique (certificat médical demandé), 3) Erreur de notre part. Dans ces cas, nous remboursons sans problème.",
    helpful: 31
  },
  {
    category: "returns",
    question: "Comment faire un retour ?",
    answer: "Simple : 1) Connectez-vous à votre compte → 'Mes retours', 2) Sélectionnez le produit et la raison, 3) Imprimez l'étiquette retour (gratuite), 4) Déposez dans un point relais. Suivez le retour en temps réel !",
    helpful: 48
  }
];

const popularQuestions = [
  {
    question: "Quelle routine pour peau acnéique ?",
    category: "products",
    views: 1234
  },
  {
    question: "Livraison offerte à partir de combien ?",
    category: "delivery",
    views: 987
  },
  {
    question: "Paiement en plusieurs fois possible ?",
    category: "payment",
    views: 856
  },
  {
    question: "Combien de temps pour voir des résultats ?",
    category: "products",
    views: 743
  }
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleQuestion = (index: number) => {
    setExpandedQuestions(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const markHelpful = (index: number) => {
    // In a real app, this would make an API call
    console.log(`Marked question ${index} as helpful`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-6">
                <HelpCircle className="w-12 h-12 mr-3" />
                <h1 className="text-4xl md:text-5xl font-bold">
                  Centre d'Aide
                </h1>
              </div>
              <p className="text-xl text-blue-50 mb-8">
                Trouvez des réponses à toutes vos questions sur PureSkin Étudiant. 
                Notre FAQ complète et notre service client sont là pour vous aider.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Recherchez votre question..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Popular Questions */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Questions les plus populaires
              </h2>
              <p className="text-gray-600">
                Les réponses les plus consultées par notre communauté
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularQuestions.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.views} vues
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm">
                    {item.question}
                  </h3>
                </div>
              ))}
            </div>
          </section>

          {/* Categories */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Parcourir par catégorie
              </h2>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                style={{ cursor: 'pointer' }}
              >
                Toutes les catégories
              </button>
              
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors flex items-center space-x-2 ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  style={{ cursor: 'pointer' }}
                >
                  <category.icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* FAQ Items */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto">
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Aucune réponse trouvée
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Essayez de modifier votre recherche ou contactez notre service client.
                  </p>
                  <Link 
                    href="/contact"
                    className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
                    style={{ cursor: 'pointer' }}
                  >
                    Contacter le support
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFAQs.map((faq, index) => {
                    const originalIndex = faqData.indexOf(faq);
                    const isExpanded = expandedQuestions.includes(originalIndex);
                    const category = faqCategories.find(cat => cat.id === faq.category);
                    
                    return (
                      <div key={originalIndex} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <button
                          onClick={() => toggleQuestion(originalIndex)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="flex items-center space-x-4 flex-1">
                            {category && (
                              <div className={`w-10 h-10 ${category.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                                <category.icon className={`w-5 h-5 ${category.textColor}`} />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {faq.question}
                              </h3>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-xs text-gray-500">
                                  {faq.helpful} personnes ont trouvé cette réponse utile
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </button>
                        
                        {isExpanded && (
                          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <div className="prose prose-sm max-w-none">
                              <p className="text-gray-700 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                              <button
                                onClick={() => markHelpful(originalIndex)}
                                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-green-600 transition-colors"
                                style={{ cursor: 'pointer' }}
                              >
                                <Check className="w-4 h-4" />
                                <span>Utile</span>
                              </button>
                              
                              <div className="flex items-center space-x-4">
                                <button
                                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                                  style={{ cursor: 'pointer' }}
                                >
                                  Partager
                                </button>
                                <button
                                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                                  style={{ cursor: 'pointer' }}
                                >
                                  Imprimer
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Contact Support */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Vous ne trouvez pas votre réponse ?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Notre service client est disponible 7j/7 pour vous aider. 
                  Contactez-nous par téléphone, email ou chat instantané.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Par téléphone
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Du lundi au samedi, 9h-19h
                  </p>
                  <a href="tel:0800123456" className="text-blue-600 font-medium hover:text-blue-700">
                    0800 123 456
                  </a>
                </div>

                <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Par email
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Réponse sous 2h en semaine
                  </p>
                  <a href="mailto:contact@pureskin.fr" className="text-green-600 font-medium hover:text-green-700">
                    contact@pureskin.fr
                  </a>
                </div>

                <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Chat instantané
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Disponible 24/7
                  </p>
                  <button className="text-purple-600 font-medium hover:text-purple-700">
                    Démarrer le chat
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Links */}
          <section className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Liens rapides
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              <Link 
                href="/livraison"
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                style={{ cursor: 'pointer' }}
              >
                <Truck className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Livraison</h3>
              </Link>
              
              <Link 
                href="/programme-fidelite"
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                style={{ cursor: 'pointer' }}
              >
                <Star className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Programme fidélité</h3>
              </Link>
              
              <Link 
                href="/paiement-securise"
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                style={{ cursor: 'pointer' }}
              >
                <Shield className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Paiement sécurisé</h3>
              </Link>
              
              <Link 
                href="/contact"
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                style={{ cursor: 'pointer' }}
              >
                <User className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Contact</h3>
              </Link>
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
