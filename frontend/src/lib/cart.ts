import { Product } from './api';

export interface CartItem extends Product {
  quantity: number;
  addedAt: Date;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

class CartService {
  private cart: CartState = {
    items: [],
    total: 0,
    itemCount: 0
  };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pureskin-cart');
      if (saved) {
        this.cart = JSON.parse(saved);
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pureskin-cart', JSON.stringify(this.cart));
    }
  }

  private calculateTotals() {
    this.cart.total = this.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.cart.itemCount = this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  addToCart(product: Product, quantity: number = 1) {
    // Vérifier si le produit est en rupture de stock
    if (product.stockQuantity !== undefined && product.stockQuantity <= 0) {
      throw new Error(`Le produit "${product.name}" est en rupture de stock`);
    }
    
    // Vérifier si la quantité demandée est disponible
    if (product.stockQuantity !== undefined && quantity > product.stockQuantity) {
      throw new Error(`Quantité demandée (${quantity}) supérieure au stock disponible (${product.stockQuantity})`);
    }
    
    const existingItem = this.cart.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.items.push({
        ...product,
        quantity,
        addedAt: new Date()
      });
    }
    
    this.calculateTotals();
    this.saveToStorage();
    return this.cart;
  }

  removeFromCart(productId: number) {
    this.cart.items = this.cart.items.filter(item => item.id !== productId);
    this.calculateTotals();
    this.saveToStorage();
    return this.cart;
  }

  updateQuantity(productId: number, quantity: number) {
    const item = this.cart.items.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.calculateTotals();
        this.saveToStorage();
      }
    }
    return this.cart;
  }

  clearCart() {
    this.cart = {
      items: [],
      total: 0,
      itemCount: 0
    };
    this.saveToStorage();
    return this.cart;
  }

  getCart(): CartState {
    return { ...this.cart };
  }

  isInCart(productId: number): boolean {
    return this.cart.items.some(item => item.id === productId);
  }

  getItemQuantity(productId: number): number {
    const item = this.cart.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }

  // Méthode pour mettre à jour le stock des produits (utilisée lors d'une commande)
  updateProductStock(productId: number, quantityChange: number) {
    // Mettre à jour le stock dans le localStorage pour les produits du panier
    const cartItems = this.cart.items.filter(item => item.id === productId);
    cartItems.forEach(item => {
      item.stockQuantity = Math.max(0, (item.stockQuantity || 0) - quantityChange);
    });
    this.calculateTotals();
    this.saveToStorage();
    return this.cart;
  }

  // Méthode pour vérifier si un produit est en rupture de stock
  isOutOfStock(product: Product): boolean {
    return product.stockQuantity !== undefined && product.stockQuantity <= 0;
  }

  // Méthode pour obtenir les produits en rupture de stock dans le panier
  getOutOfStockItems(): CartItem[] {
    return this.cart.items.filter(item => this.isOutOfStock(item));
  }
}

export const cartService = new CartService();
