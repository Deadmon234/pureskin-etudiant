import { Product } from './api';

export interface FavoriteItem {
  id: number;
  product: Product;
  addedAt: string;
}

class FavoritesService {
  private readonly STORAGE_KEY = 'pureskin_favorites';

  // Obtenir tous les favoris
  getFavorites(): FavoriteItem[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const favorites = localStorage.getItem(this.STORAGE_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris:', error);
      return [];
    }
  }

  // Ajouter un produit aux favoris
  addToFavorites(product: Product): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const favorites = this.getFavorites();
      
      // Vérifier si le produit est déjà dans les favoris
      if (favorites.some(fav => fav.id === product.id)) {
        return false; // Déjà dans les favoris
      }
      
      // Ajouter le nouveau favori
      const newFavorite: FavoriteItem = {
        id: product.id,
        product,
        addedAt: new Date().toISOString()
      };
      
      favorites.push(newFavorite);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
      return false;
    }
  }

  // Retirer un produit des favoris
  removeFromFavorites(productId: number): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const favorites = this.getFavorites();
      const filteredFavorites = favorites.filter(fav => fav.id !== productId);
      
      if (filteredFavorites.length === favorites.length) {
        return false; // Le produit n'était pas dans les favoris
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredFavorites));
      return true;
    } catch (error) {
      console.error('Erreur lors du retrait des favoris:', error);
      return false;
    }
  }

  // Vérifier si un produit est dans les favoris
  isFavorite(productId: number): boolean {
    const favorites = this.getFavorites();
    return favorites.some(fav => fav.id === productId);
  }

  // Obtenir le nombre de favoris
  getFavoritesCount(): number {
    return this.getFavorites().length;
  }

  // Vider tous les favoris
  clearFavorites(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Erreur lors du vidage des favoris:', error);
      return false;
    }
  }
}

export const favoritesService = new FavoritesService();
