"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserPaymentRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers la page de connexion
    router.replace('/auth/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection vers la page de connexion...</p>
      </div>
    </div>
  );
}
