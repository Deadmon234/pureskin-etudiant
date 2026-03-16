"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartButton } from "@/components/CartButton";
import { Cart } from "@/components/Cart";
import Link from "next/link";
import { 
  Truck, 
  Clock, 
  Package, 
  Shield, 
  MapPin, 
  Phone, 
  Mail, 
  Check,
  AlertCircle,
  CreditCard,
  Home,
  Store
} from "lucide-react";

const deliveryOptions = [
  {
    id: "standard",
    name: "Livraison Standard",
    description: "Livraison à domicile ou point relais",
    price: "4,99€",
    delay: "3-5 jours ouvrés",
    icon: Truck,
    features: [
      "Suivi de colis en temps réel",
      "Notification SMS et email",
      "Livraison sécurisée",
      "Signature requise"
    ],
    popular: false
  },
  {
    id: "express",
    name: "Livraison Express",
    description: "Livraison prioritaire à domicile",
    price: "9,99€",
    delay: "24-48h ouvrées",
    icon: Clock,
    features: [
      "Livraison en 24-48h",
      "Suivi premium",
      "Créneau horaire 2h",
      "Priorité absolue"
    ],
    popular: true
  },
  {
    id: "relais",
    name: "Point Relais",
    description: "Retrait dans votre commerce de proximité",
    price: "3,99€",
    delay: "2-4 jours ouvrés",
    icon: Store,
    features: [
      "2500+ points relais",
      "Horaires étendus",
      "Pas d'attente à domicile",
      "Écologique"
    ],
    popular: false
  },
  {
    id: "mondial",
    name: "Mondial Relay",
    description: "Réseau de points relais économique",
    price: "2,99€",
    delay: "4-6 jours ouvrés",
    icon: Package,
    features: [
      "6000+ points en France",
      "Tarif imbattable",
      "Ouvert 6j/7",
      "Simple et rapide"
    ],
    popular: false
  }
];

const deliverySteps = [
  {
    step: 1,
    title: "Validation de la commande",
    description: "Votre commande est confirmée et préparée",
    icon: Check,
    duration: "Instantané"
  },
  {
    step: 2,
    title: "Préparation du colis",
    description: "Nos équipes préparent soigneusement vos produits",
    icon: Package,
    duration: "1-2h"
  },
  {
    step: 3,
    title: "Expédition",
    description: "Votre colis est confié à notre transporteur",
    icon: Truck,
    duration: "Le jour même"
  },
  {
    step: 4,
    title: "Livraison",
    description: "Vous recevez vos produits PureSkin",
    icon: Home,
    duration: "Selon option choisie"
  }
];

const restrictions = [
  {
    title: "Poids et dimensions",
    icon: Package,
    items: [
      "Poids maximum : 30kg par colis",
      "Dimensions maximum : 60x40x30cm",
      "Plusieurs colis pour commandes volumineuses"
    ]
  },
  {
    title: "Zones géographiques",
    icon: MapPin,
    items: [
      "France métropolitaine : toutes les options",
      "Corse : surcharge 5€",
      "DOM-TOM : contactez-nous",
      "International : bientôt disponible"
    ]
  },
  {
    title: "Produits spécifiques",
    icon: AlertCircle,
    items: [
      "Produits liquides : transport sécurisé",
      "Échantillons gratuits inclus",
      "Produits sensibles : emballage renforcé"
    ]
  }
];

export default function LivraisonPage() {
  const [selectedOption, setSelectedOption] = useState("express");
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Livraison Rapide et Sécurisée
              </h1>
              <p className="text-xl text-green-50 mb-8">
                Recevez vos produits PureSkin en toute tranquillité avec nos solutions de livraison adaptées à votre rythme de vie étudiant.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center space-x-2">
                  <Truck className="w-6 h-6" />
                  <span>24-48h Express</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-6 h-6" />
                  <span>Livraison Garantie</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-6 h-6" />
                  <span>2500+ Points Relais</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Delivery Options */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Choisissez votre mode de livraison
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Flexibilité, rapidité et prix : sélectionnez l'option qui vous convient le mieux
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {deliveryOptions.map((option) => (
                <div
                  key={option.id}
                  className={`relative bg-white border-2 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer ${
                    selectedOption === option.id
                      ? 'border-green-500 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedOption(option.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {option.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Plus populaire
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      selectedOption === option.id ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <option.icon className={`w-8 h-8 ${
                        selectedOption === option.id ? 'text-green-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {option.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {option.description}
                    </p>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {option.price}
                    </div>
                    <p className="text-sm text-gray-500">
                      {option.delay}
                    </p>
                  </div>

                  <ul className="space-y-2">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {selectedOption === option.id && (
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <div className="text-center">
                        <span className="text-green-600 font-medium text-sm">
                          ✓ Option sélectionnée
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Delivery Process */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Votre livraison en 4 étapes simples
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Suivez votre commande de la validation à la réception
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {deliverySteps.map((step, index) => (
                <div key={step.step} className="text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <step.icon className="w-8 h-8 text-green-600" />
                    </div>
                    {index < deliverySteps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-green-200 -translate-x-8"></div>
                    )}
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Étape {step.step}
                    </h3>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {step.description}
                    </p>
                    <span className="text-xs text-green-600 font-medium">
                      {step.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Restrictions and Conditions */}
          <section className="mb-16">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Conditions et restrictions
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {restrictions.map((restriction, index) => (
                  <div key={index} className="bg-white rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <restriction.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">
                        {restriction.title}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {restriction.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Tracking Section */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Suivez votre colis en temps réel
                  </h2>
                  <p className="text-gray-700 mb-6">
                    Recevez des notifications à chaque étape de votre livraison et suivez votre colis 
                    sur notre carte interactive. Plus de stress, juste de la transparence !
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span>Suivi GPS précis de votre livraison</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span>Notifications SMS et email en temps réel</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span>Estimation de livraison mise à jour</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span>Photo de livraison à la réception</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Truck className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Numéro de suivi
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Entrez votre numéro de suivi pour suivre votre colis
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="EX: FR123456789"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                        Suivre
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Customer Service */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Une question sur votre livraison ?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Notre service client est là pour vous aider 7j/7
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Par téléphone
                </h3>
                <p className="text-gray-600 mb-4">
                  Du lundi au samedi, 9h-19h
                </p>
                <a href="tel:0800123456" className="text-green-600 font-medium hover:text-green-700">
                  0800 123 456
                </a>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Par email
                </h3>
                <p className="text-gray-600 mb-4">
                  Réponse sous 2h en semaine
                </p>
                <a href="mailto:livraison@pureskin.fr" className="text-blue-600 font-medium hover:text-blue-700">
                  livraison@pureskin.fr
                </a>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  FAQ Livraison
                </h3>
                <p className="text-gray-600 mb-4">
                  Réponses instantanées 24/7
                </p>
                <Link href="/faq" className="text-purple-600 font-medium hover:text-purple-700">
                  Consulter la FAQ
                </Link>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">
                Prêt(e) à recevoir vos produits PureSkin ?
              </h2>
              <p className="text-green-50 mb-6 max-w-2xl mx-auto">
                Commandez maintenant et bénéficiez d'une livraison offerte dès 25€ d'achat
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/produits"
                  className="inline-flex items-center bg-white text-green-600 px-6 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium"
                  style={{ cursor: 'pointer' }}
                >
                  Voir les produits
                </Link>
                <Link 
                  href="/panier"
                  className="inline-flex items-center bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors font-medium"
                  style={{ cursor: 'pointer' }}
                >
                  Mon panier
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
