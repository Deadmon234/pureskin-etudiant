// API Service for PureSkin Étudiant Frontend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Types
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  image?: string; // Champ legacy pour compatibilité
  badge?: string;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  categoryId?: number;
  ingredients?: string;
  usageInstructions?: string;
  benefits?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  author: string;
  readingTime: number;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
}

export interface Routine {
  id: number;
  name: string;
  slug: string;
  description?: string;
  skinTypeId?: number;
  steps: string;
  durationMinutes: number;
  difficultyLevel: string;
  isRecommended: boolean;
  productsNeeded?: string;
  skinConcerns?: string;
  createdAt: string;
}

export interface Testimonial {
  id: number;
  customerId?: number;
  name: string;
  age: number;
  studies?: string;
  rating: number;
  text: string;
  results?: string;
  isApproved: boolean;
  createdAt: string;
}

// API Functions
class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Products API
  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>('/products');
  }

  async getProduct(id: number): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return this.request<Product[]>('/products/featured');
  }

  async getAvailableProducts(): Promise<Product[]> {
    return this.request<Product[]>('/products/available');
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.request<Product[]>(`/products/search?q=${encodeURIComponent(query)}`);
  }

  async deleteProduct(id: number): Promise<void> {
    return this.request<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  // Categories API
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories');
  }

  async getCategory(id: number): Promise<Category> {
    return this.request<Category>(`/categories/${id}`);
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    return this.request<Category>(`/categories/slug/${slug}`);
  }

  // Blog API
  async getBlogPosts(): Promise<BlogPost[]> {
    return this.request<BlogPost[]>('/blog');
  }

  async getBlogPost(id: number): Promise<BlogPost> {
    return this.request<BlogPost>(`/blog/${id}`);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost> {
    return this.request<BlogPost>(`/blog/slug/${slug}`);
  }

  async getRecentPosts(limit: number = 3): Promise<BlogPost[]> {
    return this.request<BlogPost[]>(`/blog/recent?limit=${limit}`);
  }

  async searchBlogPosts(query: string): Promise<BlogPost[]> {
    return this.request<BlogPost[]>(`/blog/search?q=${encodeURIComponent(query)}`);
  }

  // Routines API
  async getRoutines(): Promise<Routine[]> {
    return this.request<Routine[]>('/routines');
  }

  async getRecommendedRoutines(): Promise<Routine[]> {
    return this.request<Routine[]>('/routines/recommended');
  }

  async getRoutine(id: number): Promise<Routine> {
    return this.request<Routine>(`/routines/${id}`);
  }

  async getRoutineBySlug(slug: string): Promise<Routine> {
    return this.request<Routine>(`/routines/slug/${slug}`);
  }

  async getRoutinesBySkinType(skinTypeId: number): Promise<Routine[]> {
    return this.request<Routine[]>(`/routines/skin-type/${skinTypeId}`);
  }

  // Testimonials API
  async getTestimonials(): Promise<Testimonial[]> {
    return this.request<Testimonial[]>('/testimonials');
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health');
  }
}

export const apiService = new ApiService();
export default apiService;
