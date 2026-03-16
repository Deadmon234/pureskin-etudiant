"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartButton } from "@/components/CartButton";
import { Cart } from "@/components/Cart";
import Link from "next/link";
import { Calendar, User, Clock, ArrowLeft, Share2, Heart, Bookmark, ShoppingCart } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Les 5 erreurs à éviter pour une peau parfaite",
    excerpt: "Découvrez les erreurs communes que font les étudiants et comment les éviter pour avoir une peau éclatante.",
    author: "Dr. Marie Laurent",
    date: "15 Février 2024",
    readTime: "5 min",
    category: "Conseils",
    image: "/api/placeholder/800/400",
    content: `
# Les 5 erreurs à éviter pour une peau parfaite

En tant qu'étudiant, il est facile de négliger sa peau entre les cours, les révisions et les soirées. Pourtant, certaines erreurs peuvent transformer votre peau en véritable champ de bataille. Voici les 5 erreurs les plus courantes et comment les éviter.

## Erreur 1: Ne pas se démaquiller le soir

**Le problème:** Après une longue journée de cours, la tentation de s'endormir sans se démaquiller est grande. Mais c'est probablement la pire erreur que vous puissiez faire.

**Pourquoi c'est grave:** Le maquillage, la pollution et le sébum accumulés pendant la journée bouchent les pores et provoquent des boutons.

**La solution:** Gardez des lingettes démaquillantes près de votre lit. En 30 secondes, votre peau est propre et prête à se régénérer.

## Erreur 2: Utiliser des produits trop agressifs

**Le problème:** Penser que "plus ça pique, plus c'est efficace" est une croyance dangereuse pour votre peau.

**Pourquoi c'est grave:** Les produits trop agressifs détruisent la barrière cutanée, provoquant irritations, rougeurs et une production accrue de sébum.

**La solution:** Optez pour des nettoyants doux, sans sulfates, avec un pH adapté (entre 5.5 et 6.5).

## Erreur 3: Sauter l'hydratation

**Le problème:** "Ma peau est grasse, je n'ai pas besoin d'hydratant" - erreur classique !

**Pourquoi c'est grave:** Une peau déshydratée produit encore plus de sébum pour se protéger, créant un cercle vicieux.

**La solution:** Utilisez une crème hydratante légère, non comédogène. Même les peaux grasses ont besoin d'hydratation.

## Erreur 4: Changer de produits trop souvent

**Le problème:** Essayer tous les nouveaux produits miracles que vous voyez sur Instagram.

**Pourquoi c'est grave:** Votre peau a besoin de temps pour s'adapter à un produit (3-4 semaines minimum). Changer trop souvent provoque des irritations.

**La solution:** Donnez 6 semaines à chaque routine avant de juger son efficacité.

## Erreur 5: Négliger la protection solaire

**Le problème:** "Je suis en cours toute la journée, je ne m'expose pas au soleil."

**Pourquoi c'est grave:** Les rayons UV traversent les fenêtres et causent un vieillissement prématuré, même à l'intérieur.

**La solution:** Utilisez un SPF 30 quotidien, même en hiver, même quand il pleut.

## La routine étudiante idéale

**Matin (2 minutes):**
- Eau thermale pour rafraîchir
- Crème hydratante avec SPF 30

**Soir (3 minutes):**
- Démaquillant (si maquillage)
- Nettoyant doux
- Crème hydratante légère

**Budget étudiant:** 15-25€ par mois pour des produits efficaces.

## Conclusion

Prendre soin de sa peau n'a pas besoin d'être compliqué ou cher. En évitant ces 5 erreurs, vous aurez une peau saine sans y passer des heures précieuses.

Rappelez-vous: la régularité vaut mieux que la perfection !
    `,
    tags: ["conseils", "erreurs", "étudiants", "routine"],
    likes: 234,
    shares: 89
  },
  {
    id: 2,
    title: "Routine soin express: 10 minutes par jour",
    excerpt: "Une routine complète pour les étudiants pressés qui veulent prendre soin de leur peau sans y passer des heures.",
    author: "Sophie Martin",
    date: "12 Février 2024",
    readTime: "3 min",
    category: "Routine",
    image: "/api/placeholder/800/400",
    content: `
# Routine soin express: 10 minutes par jour

Entre les cours, les révisions et les soirées, trouver du temps pour sa peau peut sembler impossible. Pourtant, 10 minutes par jour suffisent pour une peau éclatante.

## Le concept du "less is more"

En soin de la peau, plus n'est pas toujours mieux. Une routine simple et régulière est plus efficace qu'une routine complexe et sporadique.

## Routine Matin (3 minutes maximum)

**Étape 1: Nettoyage express (1 minute)**
- Eau micellaire sur un coton
- Insister sur la zone T si peau grasse
- Rincer n'est pas obligatoire

**Étape 2: Hydratation + Protection (2 minutes)**
- Crème hydratante légère
- SPF 30 (même en hiver!)
- Massage circulaire pour stimuler la circulation

## Routine Soir (7 minutes maximum)

**Étape 1: Double nettoyage (3 minutes)**
- Huile démaquillante (1 minute)
- Nettoyant moussant doux (2 minutes)
- Rincer à l'eau tiède

**Étape 2: Soir ciblé (2 minutes)**
- Sérum (optionnel, 2x par semaine)
- Contour des yeux (tapotements doux)

**Étape 3: Hydratation (2 minutes)**
- Crème de nuit plus riche
- Massage du visage pour la détente

## Les produits multi-fonctions

Pour optimiser votre temps, choisissez des produits 2-en-1:
- BB crème (hydratation + SPF + teinte légère)
- Lingettes démaquillantes imprégnées
- Masques hydratants de nuit

## L'astuce du week-end

Profitez du week-end pour:
- Masques nourrissants (15 minutes)
- Gommages doux (1x par semaine)
- Soins ciblés (points noirs, boutons)

## Budget étudiant optimisé

**Produits indispensables (15-20€/ mois):**
- Nettoyant doux: 5-8€
- Crème hydratante: 8-12€
- Protection solaire: 5-10€

**Produits optionnels (10-15€/ mois):**
- Sérum: 10-15€
- Masques: 5-8€

## Conclusion

10 minutes par jour, c'est tout ce qu'il vous faut pour une peau magnifique. La clé? La régularité et la simplicité.

Votre peau vous remerciera, et vos notes aussi !
    `,
    tags: ["routine", "express", "étudiants", "budget"],
    likes: 189,
    shares: 67
  },
  {
    id: 3,
    title: "Le stress et la peau: comment gérer les examens",
    excerpt: "Le lien entre le stress des examens et les problèmes de peau, avec des solutions pratiques.",
    author: "Dr. Pierre Dubois",
    date: "8 Février 2024",
    readTime: "7 min",
    category: "Santé",
    image: "/api/placeholder/800/400",
    content: `
# Le stress et la peau: comment gérer les examens

La période des examens est un véritable cauchemar pour votre peau. Boutons, rougeurs, cernes... le stress se lit sur votre visage. Mais pourquoi et comment y remédier?

## Le mécanisme stress-peau

**Le cortisol, l'ennemi n°1**
Quand vous stressez, votre corps produit du cortisol. Cette hormone augmente:
- La production de sébum (peau grasse)
- L'inflammation (boutons, rougeurs)
- La dégradation du collagène (vieillissement)

**Le cercle vicieux**
Plus vous avez de boutons, plus vous stressez → plus vous stressez, plus vous avez de boutons.

## Les problèmes courants pendant les examens

### Acné de stress
- Localisée: front, menton, mâchoires
- Inflammatoire: rouge, douloureuse
- Soudaine: apparaît en 24-48h

### Cernes et poches
- Manque de sommeil aggravé par le stress
- Mauvaise circulation sanguine
- Rétention d'eau

### Peau terne et fatiguée
- Mauvaise oxygénation
- Déshydratation
- Manque de nutriments

## La routine anti-stress

### Matin (2 minutes express)
**Étape 1: Rafraîchissement**
- Eau thermale en spray
- Tapotements pour stimuler

**Étape 2: Protection**
- Crème hydratante apaisante
- SPF 30 (indispensable!)

### Soir (5 minutes maximum)
**Étape 1: Nettoyage doux**
- Huile végétale (calendula, camomille)
- Eau micellaire
- Pas de frottements!

**Étape 2: Soins ciblés**
- Sérum apaisant (centella asiatica)
- Crème réparatrice
- Contour des yeux (concombre, thé vert)

## Les gestes anti-stress

### Massage du visage (2 minutes)
- Mouvements lents et circulaires
- Pressions douces sur les tempes
- Étirements des muscles du cou

### Respiration (1 minute)
- Inspirez 4 secondes par le nez
- Retenez 4 secondes
- Expirez 6 secondes par la bouche
- Répétez 5 fois

### Glaçage express (30 secondes)
- Glaçons enveloppés dans un mouchoir
- Sur les zones enflammées
- 30 secondes maximum

## L'alimentation anti-stress

### À privilégier
- Oméga-3: poissons gras, noix
- Antioxydants: fruits rouges, thé vert
- Magnésium: chocolat noir, amandes
- Vitamine C: agrumes, kiwis

### À éviter
- Sucre rapide: bonbons, sodas
- Produits laitiers: aggravent l'inflammation
- Caféine: augmente le cortisol
- Alcool: déshydrate la peau

## Le plan d'action examens

### 1 semaine avant
- Commencer la routine apaisante
- Booster l'hydratation
- Réduire le sucre

### Pendant les examens
- Routine minimale mais régulière
- Glaçage des boutons émergents
- Massage déstressant quotidien

### 1 semaine après
- Routine détox
- Masques nourrissants
- Retour à la normale progressive

## Les produits SOS

### Pour les boutons express
- Patchs hydrocolloïdes
- Stick asséchant
- Tea tree oil (1 goutte max)

### Pour les cernes
- Rouleau froid
- Contour des yeux à la caféine
- Patchs de concombre

### Pour la peau terne
- Gommage enzymatique doux
- Masque hydratant express
- Sérum éclatant

## Conclusion

Le stress et la peau sont intimement liés, mais une bonne routine peut minimiser les dégâts. Soyez indulgent avec vous-même: une peau parfaite pendant les examens, c'est mission impossible!

L'important? Continuer les bases et se détendre. Votre peau (et vos notes) vous remercieront.

Bon courage pour vos examens! 🎓
    `,
    tags: ["stress", "examens", "acné", "santé"],
    likes: 312,
    shares: 145
  }
];

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<typeof blogPosts[0] | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const postId = parseInt(params.id as string);
    const foundPost = blogPosts.find(p => p.id === postId);
    setPost(foundPost || null);
  }, [params.id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Header onCartClick={() => setIsCartOpen(true)} />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
            <p className="text-gray-600 mb-8">Cet article n'existe pas ou a été supprimé.</p>
            <Link 
              href="/blog"
              className="inline-flex items-center bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors"
              style={{ cursor: 'pointer' }}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour au blog
            </Link>
          </div>
        </main>
        <Footer />
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main>
        {/* Hero Image */}
        <div className="relative h-64 md:h-96 bg-gradient-to-br from-green-100 to-blue-100">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <Link 
                href="/blog"
                className="inline-flex items-center text-white mb-4 hover:text-green-200 transition-colors"
                style={{ cursor: 'pointer' }}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour au blog
              </Link>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {post.category}
                </span>
                <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm">
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <article className="prose prose-lg max-w-none">
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4 pb-6 border-b">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isLiked 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{ cursor: 'pointer' }}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{post.likes + (isLiked ? 1 : 0)}</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  style={{ cursor: 'pointer' }}
                >
                  <Share2 className="w-5 h-5" />
                  <span>{post.shares}</span>
                </button>
                
                <button
                  onClick={handleBookmark}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isBookmarked 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{ cursor: 'pointer' }}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span>Sauvegarder</span>
                </button>
              </div>
            </header>

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-12">
              {post.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('# ')) {
                  return <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{paragraph.slice(2)}</h1>;
                } else if (paragraph.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-3">{paragraph.slice(3)}</h2>;
                } else if (paragraph.startsWith('### ')) {
                  return <h3 key={index} className="text-xl font-bold text-gray-900 mt-4 mb-2">{paragraph.slice(4)}</h3>;
                } else if (paragraph.startsWith('- ')) {
                  return <li key={index} className="ml-4 text-gray-700">{paragraph.slice(2)}</li>;
                } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return <p key={index} className="font-semibold text-gray-900 mb-3">{paragraph.slice(2, -2)}</p>;
                } else if (paragraph.trim() === '') {
                  return <br key={index} />;
                } else {
                  return <p key={index} className="text-gray-700 mb-4 leading-relaxed">{paragraph}</p>;
                }
              })}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-12">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Related Products */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                🧴 Produits recommandés pour cet article
              </h3>
              <p className="text-gray-700 mb-6">
                Découvrez les produits mentionnés dans cet article pour mettre en pratique nos conseils.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🧼</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Nettoyant Doux</h4>
                  <p className="text-gray-600 text-sm mb-4">Parfait pour les peaux sensibles</p>
                  <button 
                    onClick={() => setIsCartOpen(true)}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                    style={{ cursor: 'pointer' }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Ajouter</span>
                  </button>
                </div>
                
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💧</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Sérum Apaisant</h4>
                  <p className="text-gray-600 text-sm mb-4">Anti-inflammatoire naturel</p>
                  <button 
                    onClick={() => setIsCartOpen(true)}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                    style={{ cursor: 'pointer' }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Ajouter</span>
                  </button>
                </div>
                
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌿</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Crème SPF 30</h4>
                  <p className="text-gray-600 text-sm mb-4">Protection quotidienne</p>
                  <button 
                    onClick={() => setIsCartOpen(true)}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                    style={{ cursor: 'pointer' }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Author Bio */}
            <div className="border-t pt-8">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{post.author}</h4>
                  <p className="text-gray-600 mb-4">
                    Expert en dermatologie avec plus de 10 ans d'expérience. Spécialisé dans les soins pour peaux jeunes et les problématiques étudiantes.
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>📧 contact@pureskin.fr</span>
                    <span>🔗 @pureskin_expert</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
      
      {/* Cart */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
