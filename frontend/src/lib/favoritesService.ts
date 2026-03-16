// Service pour gérer les favoris
import { Product } from './api';

export interface FavoriteItem {
  productId: number;
  addedAt: string;
}

const FAVORITES_KEY = 'pureskin_favorites';

export const favoritesService = {
  // Obtenir les favoris
  getFavorites(): FavoriteItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const favorites = localStorage.getItem(FAVORITES_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch {
      return [];
    }
  },

  // Ajouter un produit aux favoris
  addToFavorites(product: Product): void {
    if (typeof window === 'undefined') return;
    try {
      const favorites = this.getFavorites();
      const existingFavorite = favorites.find(fav => fav.productId === product.id);
      
      if (!existingFavorite) {
        const newFavorite: FavoriteItem = {
          productId: product.id,
          addedAt: new Date().toISOString()
        };
        favorites.push(newFavorite);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  },

  // Retirer des favoris
  removeFromFavorites(productId: number): void {
    if (typeof window === 'undefined') return;
    try {
      const favorites = this.getFavorites();
      const updatedFavorites = favorites.filter(fav => fav.productId !== productId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  },

  // Vérifier si un produit est en favoris
  isFavorite(productId: number): boolean {
    const favorites = this.getFavorites();
    return favorites.some(fav => fav.productId === productId);
  }
};
