"use client";

import { useState } from "react";
import { Hero } from "@/components/Hero";
import { VideoRow } from "@/components/VideoRow";
import { ProductRow } from "@/components/ProductRow";
import { Routine } from "@/components/Routine";
import { Testimonials } from "@/components/Testimonials";
import { Newsletter } from "@/components/Newsletter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Cart from "@/components/Cart";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main>
        <Hero />
        <VideoRow />
        <ProductRow />
        <Routine />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
      
      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
