"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";

export default function ProductsPage() {
  const router = useRouter();

  const handleCartClick = () => {
    // Redirect to cart page when cart is clicked
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={handleCartClick} />
      <main className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Nos produits
              <span className="text-green-600 block">spécialement étudiants</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez notre gamme complète de produits skincare avec système de favoris, 
              affichage en grille ou liste, et navigation par groupe de 4 produits.
              Des formules naturelles, efficaces et adaptées à votre budget étudiant.
            </p>
          </div>
          <ProductGrid />
        </div>
      </main>
      <Footer />
    </div>
  );
}
