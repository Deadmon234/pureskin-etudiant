"use client";

import { ReactNode } from "react";
import { AdminPaymentAuthProvider } from "@/hooks/useAdminPaymentAuth";

interface AdminPaymentLayoutProps {
  children: ReactNode;
}

export default function AdminPaymentLayout({ children }: AdminPaymentLayoutProps) {
  return (
    <AdminPaymentAuthProvider>
      {children}
    </AdminPaymentAuthProvider>
  );
}
