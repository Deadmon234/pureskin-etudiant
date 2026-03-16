"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Routine } from "@/components/Routine";

export default function RoutinePage() {
  const router = useRouter();

  const handleCartClick = () => {
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={handleCartClick} />
      <main>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
            Routine de Soin Étudiant
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Découvrez notre routine complète adaptée au mode de vie étudiant. 
            Simple, efficace et abordable pour une peau en pleine santé.
          </p>
        </div>
        <Routine />
      </main>
      <Footer />
    </div>
  );
}
