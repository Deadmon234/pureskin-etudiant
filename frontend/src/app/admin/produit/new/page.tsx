"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { apiService, Category } from "@/lib/api";
import { ArrowLeft, Save, Upload, X, Plus, Trash2 } from "lucide-react";

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: string;
  original_price: string;
  category_id: string;
  badge: string;
  stock_quantity: string;
  is_active: boolean;
  is_featured: boolean;
  image: File | null;
  categoryIds: string[];
}

export default function NewProductPage() {
  const { adminUser, isAuthenticated, logout } = useAdminAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    slug: "",
    description: "",
    price: "",
    original_price: "",
    category_id: "",
    badge: "",
    stock_quantity: "0",
    is_active: true,
    is_featured: false,
    image: null,
    categoryIds: []
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    const loadCategories = async () => {
      try {
        const categoriesData = await apiService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    loadCategories();
  }, [isAuthenticated, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Auto-generate slug from name
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId];
      
      setFormData(prev => ({ 
        ...prev, 
        category_id: newCategories[0] || "", 
        categoryIds: newCategories 
      }));
      
      return newCategories;
    });
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // 1. Créer le produit directement avec l'API admin qui gère l'image
      const formDataAdmin = new FormData();
      formDataAdmin.append('name', formData.name);
      formDataAdmin.append('slug', formData.slug);
      formDataAdmin.append('description', formData.description);
      formDataAdmin.append('price', formData.price);
      formDataAdmin.append('category', formData.category_id || '');
      formDataAdmin.append('stock', formData.stock_quantity || '0');
      formDataAdmin.append('active', 'true');
      
      if (formData.badge) {
        formDataAdmin.append('badge', formData.badge);
      }
      
      // Ajouter l'image si elle existe
      if (formData.image) {
        formDataAdmin.append('image', formData.image);
      }

      // 2. Sauvegarder dans la base de données via l'API admin products
      const productResponse = await fetch('http://localhost:8080/api/admin/products', {
        method: 'POST',
        body: formDataAdmin, // Pas de Content-Type header, FormData le définit automatiquement
      });

      if (productResponse.ok) {
        const result = await productResponse.json();
        console.log('✅ Product created in database:', result);
        
        // Message de succès
        const successMessage = `Produit "${formData.name}" ajouté avec succès dans la base de données pureSkin !`;
        
        alert(successMessage);
        router.push('/admin/produit');
      } else {
        const error = await productResponse.text();
        console.error('Error creating product:', error);
        alert('Erreur lors de la création du produit dans la base de données');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la création du produit');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Retour</span>
              </button>
              <div className="ml-6">
                <h1 className="text-xl font-bold text-gray-900">Nouveau Produit</h1>
                <p className="text-xs text-gray-500">Ajouter un nouveau produit</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {adminUser?.fullName || adminUser?.email || 'Admin'}
                  </p>
                  <p className="text-xs text-green-600">En ligne</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
              >
                <span className="text-sm">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de base</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom du produit *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Ex: Sérum Hydratant"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slug *
                      </label>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Ex: serum-hydratant"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Description détaillée du produit..."
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Prix</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prix de vente *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="24.99"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prix original
                      </label>
                      <input
                        type="number"
                        name="original_price"
                        value={formData.original_price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="34.99"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Catégories</h3>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id.toString())}
                          onChange={() => handleCategoryToggle(category.id.toString())}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                  
                  {selectedCategories.length === 0 && (
                    <p className="text-sm text-gray-500">Sélectionnez au moins une catégorie</p>
                  )}
                </div>

                {/* Product Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails du produit</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Badge
                      </label>
                      <select
                        name="badge"
                        value={formData.badge}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Aucun</option>
                        <option value="new">Nouveau</option>
                        <option value="best-seller">Best-seller</option>
                        <option value="promo">Promotion</option>
                        <option value="premium">Premium</option>
                        <option value="essentiel">Essentiel</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantité en stock
                      </label>
                      <input
                        type="number"
                        name="stock_quantity"
                        value={formData.stock_quantity}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="100"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="is_active"
                          checked={formData.is_active}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">Produit actif</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="is_featured"
                          checked={formData.is_featured}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">Produit vedette</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Image du produit</h3>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <label className="cursor-pointer">
                          <span className="text-sm text-gray-600">
                            Cliquez pour télécharger une image
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          PNG, JPG, GIF jusqu'à 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading || selectedCategories.length === 0}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Création...' : 'Créer le produit'}</span>
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
