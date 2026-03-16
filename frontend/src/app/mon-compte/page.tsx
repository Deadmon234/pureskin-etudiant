"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { User, Package, Heart, Settings, LogOut, MapPin, CreditCard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MonComptePage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleCartClick = () => {
    // Handle cart click - you can navigate to cart or open cart modal
    console.log("Cart clicked");
  };

  const orders = [
    {
      id: "CMD-2024-001",
      date: "15 Février 2024",
      status: "Livrée",
      total: 47.70,
      products: ["Gel Nettoyant", "Sérum Anti-Imperfections"]
    },
    {
      id: "CMD-2024-002", 
      date: "28 Janvier 2024",
      status: "En cours de livraison",
      total: 35.80,
      products: ["Crème Hydratante", "Gel Nettoyant"]
    }
  ];

  const addresses = [
    {
      id: 1,
      name: "Domicile",
      street: "123 Rue de la République",
      city: "75001 Paris",
      phone: "06 12 34 56 78",
      isDefault: true
    },
    {
      id: 2,
      name: "Coloc",
      street: "45 Avenue des Étudiants", 
      city: "75005 Paris",
      phone: "06 98 76 54 32",
      isDefault: false
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-green-600 font-semibold mb-2">5</div>
                <div className="text-gray-600">Commandes totales</div>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-blue-600 font-semibold mb-2">234.50 €</div>
                <div className="text-gray-600">Total économisé</div>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="text-purple-600 font-semibold mb-2">150 pts</div>
                <div className="text-gray-600">Points fidélité</div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Dernières commandes</h3>
              <div className="space-y-4">
                {orders.slice(0, 2).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{order.id}</div>
                      <div className="text-sm text-gray-600">{order.date}</div>
                      <div className="text-sm text-gray-600">{order.products.join(", ")}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{order.total.toFixed(2)} €</div>
                      <div className={`text-sm ${
                        order.status === "Livrée" ? "text-green-600" : "text-blue-600"
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                href="/mon-compte/commandes"
                className="text-green-600 hover:text-green-700 font-medium mt-4 inline-block"
              >
                Voir toutes les commandes →
              </Link>
            </div>
          </div>
        );

      case "orders":
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes commandes</h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{order.id}</h3>
                      <p className="text-gray-600">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg">{order.total.toFixed(2)} €</div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                        order.status === "Livrée" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-600 mb-4">
                    {order.products.join(" • ")}
                  </div>
                  <div className="flex gap-3">
                    <button className="text-green-600 hover:text-green-700 font-medium">
                      Suivre la commande
                    </button>
                    <button className="text-gray-600 hover:text-gray-700 font-medium">
                      Télécharger la facture
                    </button>
                    <button className="text-gray-600 hover:text-gray-700 font-medium">
                      Commander à nouveau
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "addresses":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Mes adresses</h2>
              <button className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors">
                Ajouter une adresse
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {addresses.map((address) => (
                <div key={address.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{address.name}</h3>
                    {address.isDefault && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        Par défaut
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 space-y-1 mb-4">
                    <div>{address.street}</div>
                    <div>{address.city}</div>
                    <div>{address.phone}</div>
                  </div>
                  <div className="flex gap-3">
                    <button className="text-green-600 hover:text-green-700 font-medium">
                      Modifier
                    </button>
                    {!address.isDefault && (
                      <button className="text-red-600 hover:text-red-700 font-medium">
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "wishlist":
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ma liste d'envies</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-gray-400 text-sm">Image produit</div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Produit {item}</h3>
                  <p className="text-gray-600 text-sm mb-4">Description du produit</p>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-green-600">19.90 €</div>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors text-sm">
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "settings":
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Paramètres du compte</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-6">Informations personnelles</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    defaultValue="Marie"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    defaultValue="Martin"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    defaultValue="marie.martin@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    defaultValue="06 12 34 56 78"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    defaultValue="2002-03-15"
                  />
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-4">Préférences</h3>
              <div className="space-y-3 mb-6">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span>Recevoir la newsletter</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span>Alertes promotions étudiantes</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" />
                  <span>Nouveaux produits</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors">
                  Sauvegarder les modifications
                </button>
                <button className="text-red-600 hover:text-red-700 font-medium">
                  Supprimer mon compte
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={handleCartClick} />
      <main>
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Marie Martin</div>
                    <div className="text-sm text-gray-600">marie.martin@email.com</div>
                  </div>
                </div>
                
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === "dashboard"
                        ? "bg-green-100 text-green-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Tableau de bord
                  </button>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === "orders"
                        ? "bg-green-100 text-green-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Package className="w-4 h-4 mr-3" />
                    Mes commandes
                  </button>
                  <button
                    onClick={() => setActiveTab("addresses")}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === "addresses"
                        ? "bg-green-100 text-green-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <MapPin className="w-4 h-4 mr-3" />
                    Adresses
                  </button>
                  <button
                    onClick={() => setActiveTab("wishlist")}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === "wishlist"
                        ? "bg-green-100 text-green-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Heart className="w-4 h-4 mr-3" />
                    Liste d'envies
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === "settings"
                        ? "bg-green-100 text-green-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Paramètres
                  </button>
                  <button className="w-full flex items-center px-3 py-2 rounded-lg text-left text-red-600 hover:bg-red-50">
                    <LogOut className="w-4 h-4 mr-3" />
                    Déconnexion
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
