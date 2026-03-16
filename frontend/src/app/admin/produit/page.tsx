"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { getProductImageUrl } from "@/utils/imageUtils";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Package,
  DollarSign,
  TrendingUp,
  Eye,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { apiService, Product, Category } from "@/lib/api";
import { AdminNav } from "@/components/AdminNav";

export default function AdminProduitsPage() {
  const router = useRouter();
  const { adminUser, isLoading, isAuthenticated, logout } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 30;

  // Charger les données uniquement si authentifié et pas encore chargées
  useEffect(() => {
    if (!isLoading && isAuthenticated && !dataLoaded) {
      loadInitialData();
    }
  }, [isLoading, isAuthenticated, dataLoaded]);

  const loadInitialData = async () => {
    try {
      setIsLoadingProducts(true);
      
      // Charger les produits et catégories en parallèle
      const [productsData, categoriesData] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories()
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
      setDataLoaded(true);
      console.log('✅ Données produits chargées:', productsData.length, 'produits');
    } catch (error) {
      console.error('❌ Erreur chargement données:', error);
      // En cas d'erreur, charger des données vides pour éviter le blocage
      setProducts([]);
      setCategories([]);
      setDataLoaded(true);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    setDataLoaded(false); // Forcer le rechargement
    await loadInitialData();
    setIsRefreshing(false);
  };

  // Calculate statistics
  const totalValue = products.reduce((sum, product) => sum + (product.price || 0), 0);
  const averagePrice = products.length > 0 ? totalValue / products.length : 0;
  
  // Check for low stock products
  const lowStockProducts = products.filter(product => (product.stockQuantity || 0) <= 5 && (product.stockQuantity || 0) > 0);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Rediriger si non authentifié (vérification simple)
  if (!isLoading && !isAuthenticated) {
    router.push("/admin/login");
    return null;
  }

  const handleEditProduct = (productId: number) => {
    router.push(`/admin/produit/edit/${productId}`);
  };

  const handleDeleteProduct = async (productId: number) => {
    const product = products.find(p => p.id === productId);
    const productName = product?.name || 'ce produit';
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${productName}" ? Cette action est irréversible.`)) {
      try {
        await apiService.deleteProduct(productId);
        setProducts(products.filter(p => p.id !== productId));
        alert(`Produit "${productName}" supprimé avec succès`);
      } catch (error) {
        console.error("Erreur lors de la suppression du produit:", error);
        alert("Erreur lors de la suppression du produit");
      }
    }
  };

  const handleIncreaseStock = async (productId: number, currentStock: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const productName = product.name || 'ce produit';
    
    const newStock = prompt(`Augmenter le stock pour "${productName}"`, currentStock.toString());
    
    if (newStock !== null && !isNaN(Number(newStock)) && Number(newStock) > currentStock) {
      try {
        // Mettre à jour le produit avec le nouveau stock et le rendre actif
        const updatedProduct: Product = {
          ...product,
          stockQuantity: Number(newStock),
          isActive: true
        };
        
        await apiService.updateProduct(productId, updatedProduct);
        setProducts(products.map(p => p.id === productId ? updatedProduct : p));
        alert(`Stock de "${productName}" mis à jour avec succès`);
      } catch (error) {
        console.error("Erreur lors de la mise à jour du stock:", error);
        alert("Erreur lors de la mise à jour du stock");
      }
    } else if (newStock !== null) {
      alert("Veuillez entrer un nombre supérieur au stock actuel");
    }
  };

  const handleViewProduct = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification authentification...</p>
        </div>
      </div>
    );
  }

  if (isLoadingProducts) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des produits...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec bouton de rafraîchissement */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Produits</h1>
            <p className="text-gray-600 mt-1">
              {products.length} produit{products.length > 1 ? 's' : ''} • 
              {categories.length} catégorie{categories.length > 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isRefreshing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Actualisation...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Actualiser
                </>
              )}
            </button>
            
            <button
              onClick={() => router.push("/admin/produit/new")}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Produit
            </button>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Produits</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valeur Totale</p>
                <p className="text-2xl font-bold text-gray-900">{totalValue.toFixed(2)} €</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Prix Moyen</p>
                <p className="text-2xl font-bold text-gray-900">{averagePrice.toFixed(2)} €</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Plus className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Actions</p>
                <button
                  onClick={() => router.push("/admin/produit/new")}
                  className="text-sm bg-orange-600 text-white px-3 py-1 rounded-md hover:bg-orange-700 transition-colors"
                >
                  Ajouter Produit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alert for low stock */}
        {lowStockProducts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58-9.92c.75-1.334 2.722-1.334 3.486 0l5.58 9.92a11.813 11.813 0 01-3.486 2.722l-5.58-9.92zM11.13 10.607l-1.571 1.571a4 4 0 01-5.657 0l-4.714-4.714a4 4 0 010-5.657 0l1.571-1.571zM10.607 8.87l1.571-1.571a4 4 0 015.657 0l4.714 4.714a4 4 0 010 5.657l-1.571 1.571z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  ⚠️ Alerte de stock bas
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>{lowStockProducts.length} produit(s) ont 5 unités ou moins en stock :</p>
                  <ul className="mt-1 list-disc list-inside">
                    {lowStockProducts.slice(0, 3).map(product => (
                      <li key={product.id}>{product.name} ({product.stockQuantity} restants)</li>
                    ))}
                    {lowStockProducts.length > 3 && <li>... et {lowStockProducts.length - 3} autre(s)</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher des produits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              <button className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </button>
              
              <button 
                onClick={refreshData}
                disabled={isRefreshing}
                className="flex items-center px-4 py-2 text-green-600 border border-green-300 rounded-lg hover:bg-green-50 disabled:opacity-50"
              >
                {isRefreshing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                    Rafraîchissement...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Rafraîchir
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {(() => {
                          const imageUrl = getProductImageUrl(product);
                          if (!imageUrl) {
                            return (
                              <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                                <span className="text-xs text-gray-500">No img</span>
                              </div>
                            );
                          }
                          
                          return (
                            <img
                              className="h-10 w-10 rounded-lg object-cover mr-3"
                              src={imageUrl}
                              alt={product.name}
                            />
                          );
                        })()}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.price.toFixed(2)} €</div>
                      {product.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          {product.originalPrice.toFixed(2)} €
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-gray-900">{product.stockQuantity || 0}</div>
                        <button
                          onClick={() => handleIncreaseStock(product.id, (product.stockQuantity || 0))}
                          className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                          title="Augmenter le stock"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        {isRefreshing && (
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" title="Mise à jour en cours..."></div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewProduct(product.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditProduct(product.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredProducts.length > productsPerPage && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Affichage de <span className="font-medium">{indexOfFirstProduct + 1}</span> à{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastProduct, filteredProducts.length)}
                      </span>{' '}
                      sur <span className="font-medium">{filteredProducts.length}</span> résultats
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      {/* Page numbers */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => paginate(pageNum)}
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
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
