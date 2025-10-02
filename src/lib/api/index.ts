import axios, { AxiosInstance } from 'axios';
import { 
  Product, 
  Package, 
  ProductListResponse, 
  ProductDetailResponse, 
  DrwProductConfig 
} from '../types';
import { defaultConfig } from '../utils';

export class DrwApiClient {
  private client: AxiosInstance;
  private config: DrwProductConfig;

  constructor(config: Partial<DrwProductConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    
    this.client = axios.create({
      baseURL: this.config.apiBaseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[DrwApiClient] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[DrwApiClient] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error('[DrwApiClient] Response error:', error);
        return Promise.reject(error);
      }
    );
  }

  // Get all products and packages
  async getProducts(params?: {
    slug?: string;
    type?: 'products' | 'packages' | 'all';
    search?: string;
    category?: string;
  }): Promise<ProductListResponse> {
    try {
      const response = await this.client.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return {
        success: false,
        error: 'Failed to fetch products',
        data: { products: [], packages: [] }
      };
    }
  }

  // Get packages only
  async getPackages(): Promise<{ success: boolean; data: Package[]; error?: string }> {
    try {
      const response = await this.client.get('/packages');
      return response.data;
    } catch (error) {
      console.error('Error fetching packages:', error);
      return {
        success: false,
        error: 'Failed to fetch packages',
        data: []
      };
    }
  }

  // Get product by slug
  async getProductBySlug(slug: string): Promise<ProductDetailResponse> {
    try {
      const response = await this.client.get('/products', {
        params: { slug }
      });
      
      if (response.data.success && response.data.data) {
        const { products, packages } = response.data.data;
        const product = products.length > 0 ? products[0] : packages[0];
        
        if (product) {
          return {
            success: true,
            data: product
          };
        }
      }
      
      return {
        success: false,
        error: 'Product not found'
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      return {
        success: false,
        error: 'Failed to fetch product'
      };
    }
  }

  // Get featured products
  async getFeaturedProducts(): Promise<ProductListResponse> {
    try {
      const response = await this.client.get('/products/featured');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return {
        success: false,
        error: 'Failed to fetch featured products',
        data: { products: [], packages: [] }
      };
    }
  }

  // Update config
  updateConfig(newConfig: Partial<DrwProductConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.client.defaults.baseURL = this.config.apiBaseUrl;
  }

  // Get current config
  getConfig(): DrwProductConfig {
    return { ...this.config };
  }
}

// Default export singleton instance
export const drwApiClient = new DrwApiClient();

// Factory function for creating new instances
export const createApiClient = (config: Partial<DrwProductConfig> = {}) => {
  return new DrwApiClient(config);
};
