"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminPaymentAuth } from "@/hooks/useAdminPaymentAuth";
import { paymentService, Payment, ProjectPayment, PaymentMethod, WalletStats } from "@/lib/paymentService";
import { AdminNav } from "@/components/AdminNav";
import { 
  CreditCard, 
  Wallet, 
  DollarSign,
  TrendingUp,
  Calendar,
  Users,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Smartphone
} from "lucide-react";

export default function AdminPaiementPage() {
  const router = useRouter();
  const { accessToken, email, isAuthenticated, isLoading, logout } = useAdminPaymentAuth();
  const [payments, setPayments] = useState<ProjectPayment[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [walletStats, setWalletStats] = useState<WalletStats | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 10;

  useEffect(() => {
    console.log('🔍 Debug auth state:', { isAuthenticated, isLoading, accessToken: accessToken ? 'present' : 'missing' });
    
    if (!isAuthenticated && !isLoading) {
      // Rediriger vers la page d'authentification admin
      console.log('🔄 Redirection vers login admin - non authentifié');
      router.push('/admin/login');
      return;
    }
    
    if (isAuthenticated) {
      console.log('✅ Authentifié, récupération données...');
      fetchPaymentData();
    }
  }, [isAuthenticated, accessToken, isLoading]);

  const fetchPaymentData = async () => {
    try {
      setIsLoadingData(true);
      
      // Récupérer les paiements du projet depuis notre backend
      const projectPayments = await paymentService.getProjectPayments();
      setPayments(projectPayments);
      
      // Récupérer les statistiques des paiements du projet
      const projectStats = await paymentService.getProjectPaymentStats();
      setWalletStats({
        availableBalance: projectStats.availableBalance || 0,
        totalTransactions: projectStats.totalTransactions || 0,
        totalBalance: projectStats.totalRevenue || 0,
        pendingTransactions: projectStats.pendingTransactions || 0,
        lastUpdated: new Date().toISOString()
      });
      
      console.log('✅ Project payments loaded:', projectPayments);
      console.log('✅ Project stats loaded:', projectStats);
      
    } catch (error) {
      console.error('❌ Error fetching project payment data:', error);
      // En cas d'erreur, initialiser avec des valeurs vides
      setPayments([]);
      setWalletStats({
        availableBalance: 0,
        totalTransactions: 0,
        totalBalance: 0,
        pendingTransactions: 0,
        lastUpdated: new Date().toISOString()
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  // Filter payments based on search and status
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.orderId.toString().includes(searchTerm);
    const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'refunded': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getMethodIcon = (technicalName: string) => {
    switch(technicalName) {
      case 'stripe': case 'card': return <CreditCard className="h-4 w-4" />;
      case 'orange_money_cm': case 'mtn_mobile_money_cm': return <Smartphone className="h-4 w-4" />;
      case 'bank_transfer': return <DollarSign className="h-4 w-4" />;
      default: return <Wallet className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'refunded': return <DollarSign className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'completed': return 'Complété';
      case 'pending': return 'En attente';
      case 'failed': return 'Échoué';
      case 'refunded': return 'Remboursé';
      default: return status;
    }
  };

  const getMethodText = (technicalName: string) => {
    switch(technicalName) {
      case 'stripe': return 'Carte bancaire';
      case 'orange_money_cm': return 'Orange Money';
      case 'mtn_mobile_money_cm': return 'MTN Mobile Money';
      case 'bank_transfer': return 'Virement bancaire';
      default: return technicalName;
    }
  };

  if (!isAuthenticated || isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Paiements du Projet</h2>
              <div className="text-sm text-gray-500">
                Authentifié: {email} | Base de données locale
              </div>
            </div>
          </div>
          <div className="p-6">
            {isLoadingData ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement des méthodes de paiement...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className={`border rounded-lg p-4 ${
                    method.active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        {method.logoUrl ? (
                          <img 
                            src={method.logoUrl} 
                            alt={method.name}
                            className="w-8 h-8 object-contain mr-3"
                            onError={(e) => {
                              // Fallback si l'image ne charge pas
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`${method.logoUrl ? 'hidden' : ''}`}>
                          {getMethodIcon(method.technicalName)}
                        </div>
                        <div className="ml-2">
                          <div className="font-medium text-gray-900">{method.name}</div>
                          <div className="text-xs text-gray-500">{method.slug}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        method.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {method.active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Frais dépôt:</span>
                        <span className="font-medium">{method.depositFeeRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Frais retrait:</span>
                        <span className="font-medium">{method.withdrawalFeeRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Max transaction:</span>
                        <span className="font-medium">{method.maxTransactionAmount.toLocaleString()} {method.referenceCurrency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Devise:</span>
                        <span className="font-medium">{method.referenceCurrency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transactions:</span>
                        <span className="font-medium">{method.transactionsCount}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Cooldown: {method.transactionCooldown}h</span>
                        <span>Multi-devise: {method.supportsMultiCurrency ? 'Oui' : 'Non'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
