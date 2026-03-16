"use client";

import { useState, useEffect } from "react";
import { cartService } from "@/lib/cart";
import { ShoppingCart } from "lucide-react";

export function CartButton({ onClick }: { onClick: () => void }) {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const cart = cartService.getCart();
      setItemCount(cart.itemCount);
    };

    updateCount();
    
    // Écouter les changements de panier
    const interval = setInterval(updateCount, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors group"
      style={{ cursor: 'pointer' }}
    >
      <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-green-600 transition-colors" />
      
      {/* Badge */}
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-green-100 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity" />
    </button>
  );
}
