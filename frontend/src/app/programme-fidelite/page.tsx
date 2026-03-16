"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartButton } from "@/components/CartButton";
import { Cart } from "@/components/Cart";
import Link from "next/link";
import { 
  Gift, 
  Star, 
  Trophy, 
  Crown, 
  Zap, 
  Heart,
  ShoppingBag,
  Percent,
  Calendar,
  Check,
  ChevronRight,
  Sparkles,
  Award,
  Target,
  TrendingUp
} from "lucide-react";

const loyaltyLevels = [
  {
    name: "Débutant",
    icon: Star,
    color: "gray",
    bgColor: "bg-gray-100",
    textColor: "text-gray-600",
    borderColor: "border-gray-300",
    pointsMin: 0,
    pointsMax: 99,
    benefits: [
      "1 point = 1€ d'achat",
      "Accès aux promotions",
      "Newsletter exclusive",
      "Offre de bienvenue"
    ],
    nextReward: "10% de réduction à 100 points"
  },
  {
    name: "Étudiant Actif",
    icon: Zap,
    color: "blue",
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
    borderColor: "border-blue-300",
    pointsMin: 100,
    pointsMax: 299,
    benefits: [
      "1.2x points multiplicateur",
      "-10% sur tous les produits",
      "Accès anticipé aux nouveautés",
      "Échantillons gratuits",
      "Conseils personnalisés"
    ],
    nextReward: "15% de réduction à 300 points"
  },
  {
    name: "Expert PureSkin",
    icon: Trophy,
    color: "purple",
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
    borderColor: "border-purple-300",
    pointsMin: 300,
    pointsMax: 599,
    benefits: [
      "1.5x points multiplicateur",
      "-15% sur tous les produits",
      "Livraison offerte",
      "Produits en avant-première",
      "Service client prioritaire",
      "Invitations événements"
    ],
    nextReward: "20% de réduction à 600 points"
  },
  {
    name: "Ambassadeur",
    icon: Crown,
    color: "yellow",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-600",
    borderColor: "border-yellow-300",
    pointsMin: 600,
    pointsMax: Infinity,
    benefits: [
      "2x points multiplicateur",
      "-20% sur tous les produits",
      "Livraison offerte express",
      "Box surprise exclusive",
      "Coach personnel",
      "Programme parrainage premium",
      "Cadeaux d'anniversaire"
    ],
    nextReward: "Statut à vie à 1000 points"
  }
];

const rewards = [
  {
    id: 1,
    title: "-10% sur votre prochaine commande",
    points: 100,
    category: "Réduction",
    icon: Percent,
    description: "Valable 3 mois sur tous les produits",
    popular: true
  },
  {
    id: 2,
    title: "Échantillon Sérum Premium",
    points: 50,
    category: "Produit",
    icon: Gift,
    description: "Sérum anti-âge 7 jours d'utilisation",
    popular: false
  },
  {
    id: 3,
    title: "Livraison offerte",
    points: 75,
    category: "Service",
    icon: ShoppingBag,
    description: "Livraison standard offerte sur votre prochaine commande",
    popular: false
  },
  {
    id: 4,
    title: "Box Découverte",
    points: 200,
    category: "Produit",
    icon: Gift,
    description: "5 produits full-size de notre gamme",
    popular: true
  },
  {
    id: 5,
    title: "Conseil personnalisé",
    points: 150,
    category: "Service",
    icon: Heart,
    description: "30 min avec notre experte dermatologique",
    popular: false
  },
  {
    id: 6,
    title: "-20% sur commande illimitée",
    points: 300,
    category: "Réduction",
    icon: Percent,
    description: "Réduction valable 6 mois sans minimum d'achat",
    popular: true
  }
];

const waysToEarn = [
  {
    title: "Achat de produits",
    points: "1 point par 1€",
    icon: ShoppingBag,
    description: "Gagnez des points sur chaque achat"
  },
  {
    title: "Avis produit",
    points: "10 points",
    icon: Star,
    description: "Laissez un avis sur vos produits"
  },
  {
    title: "Parrainage",
    points: "50 points",
    icon: Heart,
    description: "Parrainez un ami et gagnez des points"
  },
  {
    title: "Anniversaire",
    points: "25 points",
    icon: Calendar,
    description: "Points bonus chaque année"
  },
  {
    title: "Partage réseaux",
    points: "5 points",
    icon: TrendingUp,
    description: "Partagez nos publications"
  },
  {
    title: "Quiz beauté",
    points: "15 points",
    icon: Target,
    description: "Participez à nos quiz mensuels"
  }
];

export default function ProgrammeFidelitePage() {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [userPoints, setUserPoints] = useState(245);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const currentLevel = loyaltyLevels.find(level => 
    userPoints >= level.pointsMin && userPoints <= level.pointsMax
  ) || loyaltyLevels[0];

  const nextLevel = loyaltyLevels[loyaltyLevels.indexOf(currentLevel) + 1];
  const progressToNext = nextLevel ? 
    ((userPoints - currentLevel.pointsMin) / (nextLevel.pointsMin - currentLevel.pointsMin)) * 100 : 100;

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-6">
                <Crown className="w-12 h-12 mr-3" />
                <h1 className="text-4xl md:text-5xl font-bold">
                  Programme de Fidélité
                </h1>
              </div>
              <p className="text-xl text-purple-50 mb-8">
                Soyez récompensé à chaque achat. Gagnez des points, débloquez des avantages exclusifs 
                et profitez d'une expérience PureSkin unique.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-6 h-6" />
                  <span>Gagnez des points</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Gift className="w-6 h-6" />
                  <span>Récompenses exclusives</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Crown className="w-6 h-6" />
                  <span>Statuts premium</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* User Status */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Votre statut fidélité
                  </h2>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-16 h-16 ${currentLevel.bgColor} rounded-full flex items-center justify-center`}>
                      <currentLevel.icon className={`w-8 h-8 ${currentLevel.textColor}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {currentLevel.name}
                      </h3>
                      <p className="text-gray-600">
                        {userPoints} points accumulés
                      </p>
                    </div>
                  </div>
                  
                  {nextLevel && (
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Prochain niveau</span>
                        <span>{nextLevel.pointsMin - userPoints} points restants</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${progressToNext}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Vos avantages actuels
                  </h3>
                  <ul className="space-y-3">
                    {currentLevel.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Loyalty Levels */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Les niveaux de fidélité
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Montez de niveau et débloquez des avantages toujours plus exclusifs
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loyaltyLevels.map((level, index) => (
                <div
                  key={level.name}
                  className={`relative bg-white border-2 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer ${
                    userPoints >= level.pointsMin && userPoints <= level.pointsMax
                      ? `${level.borderColor} shadow-lg`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedLevel(index)}
                  style={{ cursor: 'pointer' }}
                >
                  {userPoints >= level.pointsMin && userPoints <= level.pointsMax && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Votre niveau
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <div className={`w-16 h-16 ${level.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <level.icon className={`w-8 h-8 ${level.textColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {level.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {level.pointsMin === 0 ? '0-99 points' : 
                       level.pointsMax === Infinity ? `${level.pointsMin}+ points` : 
                       `${level.pointsMin}-${level.pointsMax} points`}
                    </p>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {level.benefits.slice(0, 3).map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-xs text-gray-600">
                        <Check className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                    {level.benefits.length > 3 && (
                      <li className="text-xs text-gray-500">
                        +{level.benefits.length - 3} autres avantages
                      </li>
                    )}
                  </ul>

                  {level.nextReward && (
                    <div className="text-center pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {level.nextReward}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Ways to Earn */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Comment gagner des points ?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Plusieurs façons simples et rapides d'accumuler des points
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {waysToEarn.map((way, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <way.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {way.title}
                      </h3>
                      <span className="text-purple-600 font-medium">
                        {way.points}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {way.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Rewards Shop */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Boutique de récompenses
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Échangez vos points contre des avantages exclusifs
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <div key={reward.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-purple-600 bg-purple-200 px-2 py-1 rounded-full">
                        {reward.category}
                      </span>
                      {reward.popular && (
                        <span className="text-xs font-medium text-pink-600 bg-pink-200 px-2 py-1 rounded-full">
                          Populaire
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                        <reward.icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {reward.title}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-4">
                      {reward.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Sparkles className="w-4 h-4 text-purple-500 mr-1" />
                        <span className="font-semibold text-purple-600">
                          {reward.points} points
                        </span>
                      </div>
                      <button 
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          userPoints >= reward.points
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={userPoints < reward.points}
                        style={{ cursor: userPoints >= reward.points ? 'pointer' : 'not-allowed' }}
                      >
                        {userPoints >= reward.points ? 'Échanger' : 'Points insuffisants'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">
                Rejoignez notre programme fidélité dès maintenant !
              </h2>
              <p className="text-purple-50 mb-6 max-w-2xl mx-auto">
                Commencez à accumuler des points dès votre premier achat et profitez d'avantages exclusifs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/produits"
                  className="inline-flex items-center bg-white text-purple-600 px-6 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium"
                  style={{ cursor: 'pointer' }}
                >
                  Commencer mes achats
                </Link>
                <Link 
                  href="/compte/fidelite"
                  className="inline-flex items-center bg-purple-500 text-white px-6 py-3 rounded-full hover:bg-purple-600 transition-colors font-medium"
                  style={{ cursor: 'pointer' }}
                >
                  Mon compte fidélité
                </Link>
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
