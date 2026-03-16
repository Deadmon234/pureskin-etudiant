"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminNav } from "@/components/AdminNav";
import { 
  Wallet, 
  DollarSign,
  TrendingUp,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ArrowDownCircle,
  AlertCircle,
  RefreshCw,
  Package,
  Loader2
} from "lucide-react";
import { paymentService } from "@/lib/paymentService";

// Interface pour les paiements du projet
interface ProjectPayment {
  id: number;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number;
  currency: string;
  paymentMethod?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  paymentReference?: string;
  products: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  createdAt: string;
  processedAt?: string;
}

// Interface pour les statistiques de paiements
interface PaymentStats {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  totalRevenue: number;
  successfulRevenue: number;
  availableBalance: number;
  totalProductsSold: number;
  todayTransactions: number;
}

export default function AdminTransactionsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<ProjectPayment[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [dataSource, setDataSource] = useState<'project'>('project');
  const [email, setEmail] = useState("admin@pureskin.com"); // Valeur par défaut
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<ProjectPayment | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | ''>('');
  const [statsJustUpdated, setStatsJustUpdated] = useState(false);
  
  // Configuration du compte admin
  const adminAccountId = "816ac7c4-f55d-4c90-9772-92ca78e2ab17";
  const adminWalletId = "9c3cdf3b-ff0b-44d9-8aa0-4e638c88f660";
  
  // Pagination states
  const paymentsPerPage = 10;

  useEffect(() => {
    // Charger directement les données
    fetchTransactionData();
  }, []);

  const fetchTransactionData = async () => {
    try {
      setIsLoadingData(true);
      console.log('🔄 Fetching transaction data...');
      
      // Récupérer uniquement les paiements du projet
      const [paymentsData, statsData] = await Promise.all([
        paymentService.getProjectPayments(),
        paymentService.getProjectPaymentStats()
      ]);
      
      console.log('✅ Payments data received:', paymentsData);
      console.log('✅ Stats data received:', statsData);
      console.log('📊 Payments count:', paymentsData?.length || 0);
      
      // S'assurer que les paiements sont au bon format
      const formattedPayments = (paymentsData || []).map((payment: any) => {
        console.log('🔍 Processing payment:', payment);
        return {
          id: payment.id || 0,
          orderId: payment.orderId || payment.paymentReference || `PS-${payment.id}`,
          customerName: payment.customerName || 'Client',
          customerEmail: payment.customerEmail || 'client@example.com',
          customerPhone: payment.customerPhone,
          amount: parseFloat(payment.amount) || 0,
          currency: payment.currency || 'XAF',
          paymentMethod: payment.paymentMethod || 'wallet',
          status: payment.status || 'PENDING',
          paymentReference: payment.paymentReference || payment.orderId,
          products: payment.products || [],
          createdAt: payment.createdAt || new Date().toISOString(),
          processedAt: payment.processedAt
        };
      });
      
      console.log('✅ Formatted payments:', formattedPayments);
      setPayments(formattedPayments);
      setPaymentStats(statsData);
      setLastRefresh(new Date());
      
      // Logs détaillés pour diagnostiquer le solde
      console.log('🔍 DÉTAIL DES STATISTIQUES REÇUES:');
      console.log('  - totalTransactions:', statsData?.totalTransactions);
      console.log('  - successfulTransactions:', statsData?.successfulTransactions);
      console.log('  - failedTransactions:', statsData?.failedTransactions);
      console.log('  - pendingTransactions:', statsData?.pendingTransactions);
      console.log('  - totalRevenue:', statsData?.totalRevenue);
      console.log('  - successfulRevenue:', statsData?.successfulRevenue);
      console.log('  - availableBalance:', statsData?.availableBalance);
      console.log('  - totalProductsSold:', statsData?.totalProductsSold);
      console.log('  - todayTransactions:', statsData?.todayTransactions);
      
      // Vérifier si availableBalance existe et est valide
      if (statsData?.availableBalance === undefined || statsData?.availableBalance === null) {
        console.warn('⚠️ availableBalance est null ou undefined!');
      } else if (typeof statsData.availableBalance !== 'number') {
        console.warn('⚠️ availableBalance n\'est pas un nombre:', typeof statsData.availableBalance);
      } else {
        console.log('✅ availableBalance valide:', statsData.availableBalance);
      }
      
      console.log('✅ Transaction data loaded successfully');
      console.log(`📈 Final stats: ${formattedPayments.length} payments loaded`);
      
    } catch (error) {
      console.error('❌ Error fetching transaction data:', error);
      // En cas d'erreur, initialiser avec des valeurs vides
      setPayments([]);
      setPaymentStats({
        totalTransactions: 0,
        successfulTransactions: 0,
        failedTransactions: 0,
        pendingTransactions: 0,
        totalRevenue: 0,
        successfulRevenue: 0,
        availableBalance: 0,
        totalProductsSold: 0,
        todayTransactions: 0
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('Veuillez entrer un montant valide');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    
    // Pour l'instant, afficher un message car les retraits nécessitent une intégration bancaire
    alert(`Fonctionnalité de retrait de ${amount} XAF en cours de développement. Veuillez contacter l'administrateur système.`);
    setShowWithdrawModal(false);
    setWithdrawAmount("");
  };

  // Filtrer les paiements
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * paymentsPerPage,
    currentPage * paymentsPerPage
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClass = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'SUCCESS':
      case 'COMPLETED':
        return `${baseClass} bg-green-100 text-green-800`;
      case 'FAILED':
        return `${baseClass} bg-red-100 text-red-800`;
      case 'PENDING':
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case 'CANCELLED':
        return `${baseClass} bg-gray-100 text-gray-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  const handleShowDetails = (payment: ProjectPayment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  const handleRefresh = () => {
    fetchTransactionData();
  };

  const refreshStatsOnly = async () => {
    try {
      console.log('🔄 Refreshing stats only...');
      const statsData = await paymentService.getProjectPaymentStats();
      
      // Logs détaillés pour le solde
      console.log('🔍 STATISTIQUES RAFRAÎCHIES:');
      console.log('  - availableBalance:', statsData?.availableBalance);
      console.log('  - Type:', typeof statsData?.availableBalance);
      console.log('  - successfulRevenue:', statsData?.successfulRevenue);
      console.log('  - totalRevenue:', statsData?.totalRevenue);
      
      setPaymentStats(statsData);
      setLastRefresh(new Date());
      setStatsJustUpdated(true);
      console.log('✅ Stats refreshed successfully');
      
      // Masquer l'indicateur après 2 secondes
      setTimeout(() => {
        setStatsJustUpdated(false);
      }, 2000);
    } catch (error) {
      console.error('❌ Error refreshing stats:', error);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedPayment || !newStatus) return;

    setIsUpdatingStatus(true);
    try {
      console.log('🔄 Updating payment status:', {
        orderId: selectedPayment.orderId,
        newStatus: newStatus
      });

      const response = await fetch(`http://localhost:8080/api/payments/${selectedPayment.orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          farotyTransactionId: selectedPayment.paymentReference
        })
      });

      if (response.ok) {
        console.log('✅ Status updated successfully');
        
        // Mettre à jour le paiement local
        setSelectedPayment({
          ...selectedPayment,
          status: newStatus as 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED',
          processedAt: new Date().toISOString()
        });

        // Mettre à jour la liste des paiements
        setPayments(prevPayments => 
          prevPayments.map(p => 
            p.orderId === selectedPayment.orderId 
              ? { ...p, status: newStatus as 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED', processedAt: new Date().toISOString() }
              : p
          )
        );

        // Rafraîchir les données
        fetchTransactionData();
        
        // Rafraîchir les statistiques uniquement pour une mise à jour rapide
        setTimeout(() => {
          refreshStatsOnly();
        }, 500);
        
        // Afficher un message de succès
        alert(`Statut mis à jour: ${newStatus}`);
      } else {
        const errorText = await response.text();
        console.error('❌ Error updating status:', errorText);
        alert(`Erreur lors de la mise à jour: ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Error updating status:', error);
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setIsUpdatingStatus(false);
      setNewStatus('');
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos transactions et suivez vos revenus
          </p>
        </div>

        {/* Statistiques */}
        {paymentStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Wallet className={`w-6 h-6 text-blue-600 ${statsJustUpdated ? 'animate-pulse' : ''}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Solde disponible</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {paymentStats?.availableBalance !== undefined && paymentStats?.availableBalance !== null 
                      ? paymentStats.availableBalance.toLocaleString() 
                      : '0'} XAF
                  </p>
                  {/* Affichage de débogage temporaire */}
                  {process.env.NODE_ENV === 'development' && (
                    <p className="text-xs text-gray-500">
                      Debug: {JSON.stringify(paymentStats?.availableBalance)}
                    </p>
                  )}
                  {statsJustUpdated && (
                    <span className="text-xs text-green-600 font-medium">📈 Mis à jour</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className={`w-6 h-6 text-green-600 ${statsJustUpdated ? 'animate-pulse' : ''}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenu total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {paymentStats.totalRevenue.toLocaleString()} XAF
                  </p>
                  {statsJustUpdated && (
                    <span className="text-xs text-green-600 font-medium">📈 Mis à jour</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Package className={`w-6 h-6 text-purple-600 ${statsJustUpdated ? 'animate-pulse' : ''}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Produits vendus</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {paymentStats.totalProductsSold}
                  </p>
                  {statsJustUpdated && (
                    <span className="text-xs text-green-600 font-medium">📈 Mis à jour</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className={`w-6 h-6 text-orange-600 ${statsJustUpdated ? 'animate-pulse' : ''}`} />
                </div>
                <div className="ml-4">
                  <p className="text font-medium text-gray-600">Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {paymentStats.totalTransactions}
                  </p>
                  {statsJustUpdated && (
                    <span className="text-xs text-green-600 font-medium">📈 Mis à jour</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Recherche */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par commande, client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filtre par statut */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="SUCCESS">Succès</option>
              <option value="FAILED">Échec</option>
              <option value="PENDING">En attente</option>
              <option value="CANCELLED">Annulé</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            {/* État de la connexion */}
            <div className="text-sm text-gray-500">
              {lastRefresh ? (
                <span>Dernière mise à jour: {lastRefresh.toLocaleTimeString('fr-FR')}</span>
              ) : (
                <span>Chargement...</span>
              )}
            </div>

            {/* Bouton de retrait */}
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <ArrowDownCircle className="w-4 h-4" />
              Effectuer un retrait
            </button>

            {/* Bouton de rafraîchissement */}
            <button
              onClick={handleRefresh}
              disabled={isLoadingData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
              Rafraîchir
            </button>
          </div>
        </div>

        {/* Tableau des transactions */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commande
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Méthode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedPayments.length > 0 ? (
                  paginatedPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{payment.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{payment.customerName}</div>
                          <div className="text-sm text-gray-500">{payment.customerEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {payment.products && payment.products.length > 0 ? (
                            <div className="space-y-1">
                              {payment.products.slice(0, 2).map((product, index) => (
                                <div key={index} className="text-xs">
                                  {product.quantity}x {product.name}
                                </div>
                              ))}
                              {payment.products.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{payment.products.length - 2} autre(s)
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">Aucun produit</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.amount.toLocaleString()} XAF
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.paymentMethod || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(payment.status)}
                          <span className={getStatusBadge(payment.status)}>
                            {payment.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleShowDetails(payment)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Wallet className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Aucune transaction trouvée
                        </h3>
                        <p className="text-gray-500 mb-4">
                          {searchTerm || statusFilter !== 'all' 
                            ? 'Aucune transaction ne correspond à vos critères de recherche.'
                            : 'Aucune transaction n\'a été effectuée pour le moment.'
                          }
                        </p>
                        {(searchTerm || statusFilter !== 'all') && (
                          <button
                            onClick={() => {
                              setSearchTerm('');
                              setStatusFilter('all');
                            }}
                            className="text-green-600 hover:text-green-700 font-medium"
                          >
                            Réinitialiser les filtres
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Affichage de{' '}
                    <span className="font-medium">
                      {(currentPage - 1) * paymentsPerPage + 1}
                    </span>{' '}
                    à{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * paymentsPerPage, filteredPayments.length)}
                    </span>{' '}
                    sur{' '}
                    <span className="font-medium">{filteredPayments.length}</span> résultats
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Précédent
                    </button>
                    
                    {/* Numéros de page */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-green-50 border-green-500 text-green-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Suivant
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal de retrait */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Effectuer un retrait
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant à retirer (XAF)
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Entrez le montant"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowWithdrawModal(false);
                    setWithdrawAmount("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleWithdraw}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {isLoading ? 'Traitement...' : 'Confirmer le retrait'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de détails de transaction */}
      {showDetailsModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Détails de la transaction #{selectedPayment.orderId}
                </h3>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedPayment(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Informations client */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Informations client</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Nom:</span> 
                      <span className="font-semibold text-gray-600"> {selectedPayment.customerName}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Email:</span> 
                      <span className="font-semibold text-gray-600"> {selectedPayment.customerEmail}</span>
                    </div>
                    {selectedPayment.customerPhone && (
                      <div className="col-span-2">
                        <span className="font-medium text-gray-600">Téléphone:</span> 
                        <span className="font-semibold text-gray-600"> {selectedPayment.customerPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Informations paiement */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Informations paiement</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Montant:</span> 
                      <span className="font-semibold text-gray-600"> {selectedPayment.amount.toLocaleString()} XAF</span> 
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Devise:</span> 
                      <span className="font-semibold text-gray-600"> {selectedPayment.currency}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Méthode:</span> 
                      <span className="font-semibold text-gray-600"> {selectedPayment.paymentMethod || 'N/A'} </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Statut:</span> 
                      <span className={`ml-2 ${getStatusBadge(selectedPayment.status)}`}>
                        {selectedPayment.status}
                      </span>
                    </div>
                    {selectedPayment.paymentReference && (
                      <div className="col-span-2">
                        <span className="font-medium text-gray-600">Référence:</span> 
                        <span className="font-semibold text-gray-600"> {selectedPayment.paymentReference}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Produits commandés */}
                {selectedPayment.products && selectedPayment.products.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Produits commandés</h4>
                    <div className="space-y-2">
                      {selectedPayment.products.map((product, index) => (
                        <div key={index} className="flex justify-between items-center text-sm bg-white p-2 rounded border">
                          <div>
                            <span className="font-medium text-gray-600">{product.name}</span>
                            <span className="text-gray-500 ml-2">x{product.quantity}</span>
                          </div>
                          <span className="font-medium text-gray-600">
                            {((product.price || 0) * (product.quantity || 0)).toLocaleString()} XAF
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dates */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Dates</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 font-semibold">
                    <div>
                      <span className="font-medium text-gray-600">Créé le:</span> {new Date(selectedPayment.createdAt).toLocaleString()}
                    </div>
                    {selectedPayment.processedAt && (
                      <div>
                        <span className="font-medium text-gray-600">Traité le:</span> {new Date(selectedPayment.processedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mise à jour du statut */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Mettre à jour le statut</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nouveau statut
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | '')}
                        className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Sélectionner un statut</option>
                        <option value="PENDING">En attente</option>
                        <option value="SUCCESS">Succès</option>
                        <option value="FAILED">Échec</option>
                        <option value="CANCELLED">Annulé</option>
                        <option value="PROCESSING">En traitement</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateStatus}
                        disabled={!newStatus || isUpdatingStatus}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUpdatingStatus ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                            Mise à jour...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 inline mr-2" />
                            Mettre à jour
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setNewStatus('')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Annuler
                      </button>
                    </div>
                    <div className="text-xs text-gray-500">
                      ⚠️ La mise à jour du statut affectera immédiatement le paiement dans la base de données
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedPayment(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
