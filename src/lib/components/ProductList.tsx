import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faSpinner, 
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import { ProductListProps } from '../types';
import { ProductCard } from './ProductCard';
import { cn, mergeConfig } from '../utils';

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onWhatsAppClick,
  onCategoryClick,
  config = {},
  className = '',
  enableSearch = true,
  enableFilters = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'products' | 'packages'>('all');
  
  const finalConfig = mergeConfig(config);
  
  // Filter products based on search and filter
  const filteredProducts = React.useMemo(() => {
    let filtered = products;
    
    // Filter by type
    if (enableFilters && activeFilter !== 'all') {
      filtered = filtered.filter(product => {
        if (activeFilter === 'products') {
          return !product.type || product.type === 'product';
        }
        return product.type === 'package';
      });
    }
    
    // Filter by search
    if (enableSearch && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => {
        const name = (product.namaProduk || (product as any).nama_produk || '').toLowerCase();
        const description = (
          product.deskripsi || 
          (product as any).deskripsi_singkat || 
          ''
        ).toLowerCase();
        const bpom = (product.bpom || '').toLowerCase();
        
        return name.includes(query) || description.includes(query) || bpom.includes(query);
      });
    }
    
    return filtered;
  }, [products, searchQuery, activeFilter, enableSearch, enableFilters]);
  
  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleCategoryClick = (categoryName: string) => {
    if (onCategoryClick) {
      onCategoryClick(categoryName);
    }
    // Also set the search to show the category name
    setSearchQuery(categoryName);
    setActiveFilter('all');
  };

  const productCount = products.filter(p => !p.type || p.type === 'product').length;
  const packageCount = products.filter(p => p.type === 'package').length;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search and Filters */}
      {(enableSearch || enableFilters) && (
        <div className="space-y-4">
          {/* Search Bar */}
          {enableSearch && (
            <div className="flex justify-center">
              <div className="drw-search-container">
                <input
                  type="text"
                  placeholder="Cari produk, kategori, atau BPOM..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="drw-search-input"
                />
                <FontAwesomeIcon 
                  icon={faSearch}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="drw-search-clear"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          {enableFilters && (
            <div className="flex justify-center">
              <div className="drw-filter-tabs">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={cn(
                    'drw-filter-tab',
                    activeFilter === 'all' ? 'drw-filter-tab--active' : 'drw-filter-tab--inactive'
                  )}
                >
                  Semua ({products.length})
                </button>
                <button
                  onClick={() => setActiveFilter('products')}
                  className={cn(
                    'drw-filter-tab',
                    activeFilter === 'products' ? 'drw-filter-tab--active' : 'drw-filter-tab--inactive'
                  )}
                >
                  Produk ({productCount})
                </button>
                {finalConfig.enablePackages && packageCount > 0 && (
                  <button
                    onClick={() => setActiveFilter('packages')}
                    className={cn(
                      'drw-filter-tab',
                      activeFilter === 'packages' ? 'drw-filter-tab--active' : 'drw-filter-tab--inactive'
                    )}
                  >
                    Paket ({packageCount})
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Results Info */}
      {searchQuery && (
        <div className="text-center py-4">
          <p className="text-gray-600">
            Menampilkan <span className="font-semibold text-primary">{filteredProducts.length}</span> hasil 
            untuk "<span className="font-semibold">{searchQuery}</span>"
          </p>
          {filteredProducts.length === 0 && (
            <button
              onClick={clearSearch}
              className="mt-2 text-primary hover:text-pink-600 underline"
            >
              Hapus pencarian
            </button>
          )}
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="drw-product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id_produk || (product as any).id_paket}
              product={product}
              onWhatsAppClick={onWhatsAppClick}
              onCategoryClick={handleCategoryClick}
              config={config}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="drw-empty-state">
          <FontAwesomeIcon icon={faSearch} className="drw-empty-icon" />
          <h3 className="drw-empty-title">
            {searchQuery ? 'Tidak ada produk yang ditemukan' : 'Belum ada produk'}
          </h3>
          <p className="drw-empty-description">
            {searchQuery 
              ? 'Coba ubah kata kunci pencarian atau hapus filter'
              : 'Produk akan ditampilkan di sini'
            }
          </p>
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="drw-error-button"
            >
              Hapus Pencarian
            </button>
          )}
        </div>
      )}
    </div>
  );
};
