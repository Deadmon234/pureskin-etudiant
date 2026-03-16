"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckCircle, ArrowLeft, Package, Truck } from "lucide-react";
import Link from "next/link";

export default function OrderSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home after 5 seconds
    const timer = setTimeout(() => {
      router.push("/produits");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleCartClick = () => {
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCartClick={handleCartClick} />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Commande Confirmée !
            </h1>
            
            <p className="text-gray-600 mb-6">
              Votre commande a été traitée avec succès et votre stock a été mis à jour.
            </p>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <Package className="w-4 h-4" />
                <span>Les produits ont été retirés du stock</span>
              </div>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mt-2">
                <Truck className="w-4 h-4" />
                <span>Livraison en cours de préparation</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/produits"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
              >
                Continuer mes achats
              </Link>
              
              <Link
                href="/cart"
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au panier
              </Link>
            </div>

            {/* Auto-redirect notice */}
            <div className="mt-6 text-xs text-gray-500">
              Vous serez redirigé automatiquement vers la boutique dans 5 secondes...
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
