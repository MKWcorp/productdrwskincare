import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Product, 
  Package, 
  DrwProductConfig, 
  ProductListResponse 
} from '../types';
import { drwApiClient, DrwApiClient } from '../api';
import { 
  filterProducts, 
  filterByCategory, 
  filterByType, 
  mergeConfig 
} from '../utils';

// Hook for managing product list with search and filters
export const useProductList = (config?: Partial<DrwProductConfig>) => {
  const [products, setProducts] = useState<(Product | Package)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'products' | 'packages'>('all');

  const finalConfig = useMemo(() => mergeConfig(config || {}), [config]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let apiClient = drwApiClient;
      if (config) {
        apiClient = new DrwApiClient(config);
      }

      const response = await apiClient.getProducts();
      
      if (response.success && response.data) {
        const allProducts = [...response.data.products, ...response.data.packages];
        setProducts(allProducts);
      } else {
        setError(response.error || 'Failed to fetch products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [config]);

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by type first
    filtered = filterByType(filtered, activeFilter);

    // Filter by category
    if (selectedCategory) {
      filtered = filterByCategory(filtered, selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filterProducts(filtered, searchQuery);
    }

    return filtered;
  }, [products, activeFilter, selectedCategory, searchQuery]);

  // Handle search
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Handle category selection
  const handleCategoryClick = useCallback((categoryName: string) => {
    setSelectedCategory(categoryName);
    setSearchQuery(categoryName); // Show category name in search field
    setActiveFilter('all'); // Reset type filter
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('');
    setActiveFilter('all');
  }, []);

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products: filteredProducts,
    allProducts: products,
    loading,
    error,
    searchQuery,
    selectedCategory,
    activeFilter,
    handleSearchChange,
    handleCategoryClick,
    setActiveFilter,
    clearFilters,
    refetch: fetchProducts,
    config: finalConfig,
  };
};

// Hook for managing single product detail
export const useProductDetail = (slug: string, config?: Partial<DrwProductConfig>) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const finalConfig = useMemo(() => mergeConfig(config || {}), [config]);

  const fetchProduct = useCallback(async () => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    try {
      let apiClient = drwApiClient;
      if (config) {
        apiClient = new DrwApiClient(config);
      }

      const response = await apiClient.getProductBySlug(slug);
      
      if (response.success && response.data) {
        setProduct(response.data);
      } else {
        setError(response.error || 'Product not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [slug, config]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
    config: finalConfig,
  };
};

// Hook for featured products
export const useFeaturedProducts = (config?: Partial<DrwProductConfig>) => {
  const [products, setProducts] = useState<(Product | Package)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const finalConfig = useMemo(() => mergeConfig(config || {}), [config]);

  const fetchFeaturedProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let apiClient = drwApiClient;
      if (config) {
        apiClient = new DrwApiClient(config);
      }

      const response = await apiClient.getFeaturedProducts();
      
      if (response.success && response.data) {
        const allProducts = [...response.data.products, ...response.data.packages];
        setProducts(allProducts);
      } else {
        setError(response.error || 'Failed to fetch featured products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchFeaturedProducts,
    config: finalConfig,
  };
};

// Hook for WhatsApp integration
export const useWhatsApp = (config?: Partial<DrwProductConfig>) => {
  const finalConfig = useMemo(() => mergeConfig(config || {}), [config]);

  const openWhatsApp = useCallback((product: Product | Package) => {
    const { generateWhatsAppUrl } = require('../utils');
    const url = generateWhatsAppUrl(product, finalConfig);
    window.open(url, '_blank');
  }, [finalConfig]);

  return {
    openWhatsApp,
    config: finalConfig,
  };
};
