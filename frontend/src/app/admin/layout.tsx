"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAdminAuth, AdminAuthProvider } from "@/hooks/useAdminAuth";
import { AdminPaymentAuthProvider } from "@/hooks/useAdminPaymentAuth";

interface AdminLayoutProps {
  children: ReactNode;
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const { adminUser, isLoading, isAuthenticated } = useAdminAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Ne pas bloquer l'accès à la page de login et paiement auth
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isLoginPage = pathname.includes('/admin/login');
  const isPaymentAuthPage = pathname.includes('/admin/paiement/auth');

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (isLoading && !isLoginPage && !isPaymentAuthPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'administration...</p>
        </div>
      </div>
    );
  }

  // Permettre l'accès aux pages de login et paiement auth sans authentification
  if (isLoginPage || isPaymentAuthPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated && !isLoginPage && !isPaymentAuthPage) {
    return null; // Le hook gère la redirection automatique
  }

  return <>{children}</>;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminAuthProvider>
      <AdminPaymentAuthProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </AdminPaymentAuthProvider>
    </AdminAuthProvider>
  );
}
