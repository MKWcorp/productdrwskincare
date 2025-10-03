import React, { useState, useEffect } from 'react'
import { DatabaseProduct } from '../types'
import { useDrwSkincareConfig } from './DrwSkincareProvider'
import { buildApiUrl } from '../lib/generic-utils'
import { GenericProductCard } from './GenericProductCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faExclamationCircle, faSearch } from '@fortawesome/free-solid-svg-icons'

interface FilterConfig {
  categories?: boolean
  search?: boolean
  priceRange?: boolean
  sortBy?: boolean
  customFilters?: CustomFilter[]
}

interface CustomFilter {
  id: string
  label: string
  type: 'select' | 'checkbox' | 'range'
  options?: { value: string; label: string }[]
  render?: (value: any, onChange: (value: any) => void) => React.ReactNode
}

interface GenericProductListProps {
  filters?: FilterConfig
  defaultCategory?: string
  productsPerPage?: number
  showPagination?: boolean
  gridColumns?: {
    mobile: number
    tablet: number
    desktop: number
  }
  onProductClick?: (product: DatabaseProduct) => void
  onCategoryChange?: (category: string) => void
  customProductCard?: React.ComponentType<{ product: DatabaseProduct }>
  className?: string
  emptyStateMessage?: string
  emptyStateIcon?: any
}

interface ApiResponse {
  success: boolean
  data: DatabaseProduct[]
  message?: string
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const GenericProductList: React.FC<GenericProductListProps> = ({
  filters = { categories: true, search: true },
  defaultCategory = '',
  productsPerPage = 12,
  showPagination = true,
  gridColumns = { mobile: 1, tablet: 2, desktop: 3 },
  onProductClick,
  onCategoryChange,
  customProductCard: CustomProductCard,
  className = '',
  emptyStateMessage = 'Tidak ada produk yang ditemukan',
  emptyStateIcon = faExclamationCircle
}) => {
  const config = useDrwSkincareConfig()
  const [products, setProducts] = useState<DatabaseProduct[]>([])
  const [categories, setCategories] = useState<Array<{ id: string; nama_kategori: string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory)
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 })
  const [sortBy, setSortBy] = useState('name_asc')
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch categories
  useEffect(() => {
    if (filters.categories) {
      const fetchCategories = async () => {
        try {
          const apiUrl = buildApiUrl('/categories', config.api)
          const response = await fetch(apiUrl)
          if (response.ok) {
            const data = await response.json()
            if (data.success) {
              setCategories(data.data)
            }
          }
        } catch (err) {
          console.error('Failed to fetch categories:', err)
        }
      }
      fetchCategories()
    }
  }, [filters.categories, config.api])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        
        if (selectedCategory) params.append('category', selectedCategory)
        if (searchQuery) params.append('search', searchQuery)
        if (priceRange.min > 0) params.append('minPrice', priceRange.min.toString())
        if (priceRange.max < 1000000) params.append('maxPrice', priceRange.max.toString())
        if (sortBy) params.append('sort', sortBy)
        if (showPagination) {
          params.append('page', currentPage.toString())
          params.append('limit', productsPerPage.toString())
        }

        const apiUrl = buildApiUrl(`/products?${params.toString()}`, config.api)
        const response = await fetch(apiUrl)
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const data: ApiResponse = await response.json()
        if (data.success) {
          setProducts(data.data)
        } else {
          setError(data.message || 'Failed to load products')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, searchQuery, priceRange, sortBy, currentPage, productsPerPage, showPagination, config.api])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
    onCategoryChange?.(category)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const getGridClasses = () => {
    const { mobile, tablet, desktop } = gridColumns
    return `grid grid-cols-${mobile} md:grid-cols-${tablet} lg:grid-cols-${desktop} gap-6`
  }

  const ProductCardComponent = CustomProductCard || GenericProductCard

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Filter */}
          {filters.search && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari Produk
              </label>
              <div className="relative">
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Nama produk..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Category Filter */}
          {filters.categories && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nama_kategori}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort Filter */}
          {filters.sortBy && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urutkan
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name_asc">Nama A-Z</option>
                <option value="name_desc">Nama Z-A</option>
                <option value="price_asc">Harga Terendah</option>
                <option value="price_desc">Harga Tertinggi</option>
                <option value="newest">Terbaru</option>
              </select>
            </div>
          )}

          {/* Price Range Filter */}
          {filters.priceRange && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rentang Harga
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="10000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="text-xs text-gray-600">
                  Rp 0 - Rp {priceRange.max.toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <FontAwesomeIcon 
              icon={faSpinner} 
              className="text-4xl text-blue-500 animate-spin mb-4" 
            />
            <p className="text-gray-600">Memuat produk...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <FontAwesomeIcon 
              icon={faExclamationCircle} 
              className="text-4xl text-red-500 mb-4" 
            />
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <FontAwesomeIcon 
                  icon={emptyStateIcon} 
                  className="text-4xl text-gray-400 mb-4" 
                />
                <p className="text-gray-600">{emptyStateMessage}</p>
              </div>
            </div>
          ) : (
            <div className={getGridClasses()}>
              {products.map((product) => (
                <ProductCardComponent
                  key={product.id}
                  product={product}
                  onProductClick={onProductClick}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {showPagination && products.length > 0 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sebelumnya
              </button>
              
              <span className="text-gray-600">
                Halaman {currentPage}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={products.length < productsPerPage}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}